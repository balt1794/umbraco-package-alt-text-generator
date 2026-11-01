import {
  LitElement,
  css,
  html,
  nothing,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import {
  getImages,
  getSettings,
  postGenerate,
  postSave,
  postSettings,
  type ImageItemModel,
  type SettingsResponseModel,
} from "../api/index.js";
import { LANGUAGES } from "../languages.js";

type Row = ImageItemModel & {
  /** The text in the box, which can differ from what is saved. */
  draft: string;
  busy: boolean;
  failed?: string;
};

type Filter = "missing" | "all";

const PAGE = 100;
const LANGUAGE_KEY = "altTextGeneratorAI.language";

@customElement("alt-text-generator-ai-dashboard")
export class AltTextGeneratorAIDashboardElement extends UmbElementMixin(LitElement) {
  @state() private _settings?: SettingsResponseModel;
  @state() private _rows: Row[] = [];
  @state() private _loading = true;
  @state() private _filter: Filter = "missing";
  @state() private _language = this.#storedLanguage();
  @state() private _overwrite = false;
  @state() private _selected = new Set<string>();
  @state() private _shown = PAGE;
  @state() private _running = false;
  @state() private _saving = false;
  @state() private _keyInput = "";
  @state() private _keyBusy = false;
  @state() private _editingKey = false;
  @state() private _error = "";

  #notifications?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #stop = false;

  constructor() {
    super();
    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
      this.#notifications = context;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.#load();
  }

  #storedLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_KEY) || "english";
    } catch {
      return "english";
    }
  }

  #notify(color: "positive" | "danger" | "warning", headline: string, message?: string) {
    this.#notifications?.peek(color, { data: { headline, message: message ?? "" } });
  }

  #errorMessage(error: unknown) {
    const e = error as { message?: string; detail?: string; problemDetails?: { detail?: string } } | undefined;
    return e?.problemDetails?.detail || e?.detail || e?.message || "Something went wrong.";
  }

  async #load() {
    this._loading = true;
    this._error = "";

    const settings = await tryExecute(this, getSettings());
    if (settings.data) {
      this._settings = settings.data;
    }

    if (settings.data?.hasKey || !settings.error) {
      const images = await tryExecute(this, getImages());
      if (images.error) {
        this._error = this.#errorMessage(images.error);
      } else if (images.data) {
        this._rows = images.data.items.map((item) => ({ ...item, draft: item.altText, busy: false }));
      }
    }

    this._loading = false;
  }

  async #saveKey() {
    if (!this._keyInput.trim()) return;
    this._keyBusy = true;
    const { data, error } = await tryExecute(this, postSettings({ body: { apiKey: this._keyInput.trim() } }));
    this._keyBusy = false;

    if (error || !data) {
      this.#notify("danger", "Key not saved", this.#errorMessage(error));
      return;
    }

    this._settings = data;
    this._keyInput = "";
    this._editingKey = false;
    this.#notify("positive", "API key saved");
  }

  get #missing() {
    return this._rows.filter((row) => !row.draft.trim());
  }

  get #visible() {
    return this._filter === "missing" ? this.#missing : this._rows;
  }

  get #dirty() {
    return this._rows.filter((row) => row.draft.trim() !== row.altText);
  }

  #update(key: string, patch: Partial<Row>) {
    this._rows = this._rows.map((row) => (row.key === key ? { ...row, ...patch } : row));
  }

  async #generate(key: string): Promise<boolean> {
    this.#update(key, { busy: true, failed: undefined });
    const { data, error } = await tryExecute(this, postGenerate({ body: { key, language: this._language } }));

    if (error || !data) {
      const message = this.#errorMessage(error);
      this.#update(key, { busy: false, failed: message });
      return false;
    }

    this.#update(key, { busy: false, draft: data.altText });
    if (this._settings && data.creditsLeft != null) {
      this._settings = { ...this._settings, credits: data.creditsLeft };
    }
    return true;
  }

  async #generateMany() {
    const targets = this._selected.size > 0
      ? this._rows.filter((row) => this._selected.has(row.key))
      : this._overwrite ? this.#visible : this.#missing;

    if (targets.length === 0) return;

    this._running = true;
    this.#stop = false;
    let done = 0;
    for (const row of targets) {
      if (this.#stop) break;
      const ok = await this.#generate(row.key);
      if (!ok) {
        // Stop at the first problem, which is usually the key or the credits, so they are not all tried.
        break;
      }
      done++;
    }
    this._running = false;
    if (done > 0) {
      this.#notify("positive", `Generated alt text for ${done} image${done === 1 ? "" : "s"}`, "Read it, change anything you like, then click Save changes.");
    }
  }

  async #saveAll() {
    const items = this.#dirty.map((row) => ({ key: row.key, altText: row.draft.trim() }));
    if (items.length === 0) return;

    this._saving = true;
    const { data, error } = await tryExecute(this, postSave({ body: { items } }));
    this._saving = false;

    if (error || !data) {
      this.#notify("danger", "Could not save", this.#errorMessage(error));
      return;
    }

    const savedKeys = new Set(items.map((item) => item.key));
    this._rows = this._rows.map((row) => (savedKeys.has(row.key) ? { ...row, altText: row.draft.trim() } : row));
    this._selected = new Set();
    this.#notify("positive", `Saved ${data.saved} image${data.saved === 1 ? "" : "s"}`);
  }

  #toggle(key: string, on: boolean) {
    const next = new Set(this._selected);
    on ? next.add(key) : next.delete(key);
    this._selected = next;
  }

  #setLanguage(value: string) {
    this._language = value;
    try {
      localStorage.setItem(LANGUAGE_KEY, value);
    } catch {
      /* the language is only remembered when the browser allows it */
    }
  }

  #renderSetup() {
    const canEdit = this._settings?.canEditKey ?? false;
    return html`
      <uui-box headline="Add your API key">
        ${canEdit
          ? html`
              <p>
                Get a free key at
                <a href="https://alttextgeneratorai.com/dashboard" target="_blank" rel="noopener">alttextgeneratorai.com</a>.
                New accounts get free credits. Your key stays on your server and never reaches the browser.
              </p>
              <div class="key-row">
                <uui-input
                  type="password"
                  label="API key"
                  placeholder="Paste your API key"
                  .value=${this._keyInput}
                  @input=${(e: Event) => (this._keyInput = (e.target as HTMLInputElement).value)}
                  @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.#saveKey()}
                ></uui-input>
                <uui-button
                  look="primary"
                  color="positive"
                  label="Save key"
                  .state=${this._keyBusy ? "waiting" : undefined}
                  @click=${this.#saveKey}
                ></uui-button>
                ${this._settings?.hasKey
                  ? html`<uui-button look="secondary" label="Cancel" @click=${() => (this._editingKey = false)}></uui-button>`
                  : nothing}
              </div>
            `
          : html`<p>Ask an administrator to add the API key in this dashboard.</p>`}
      </uui-box>
    `;
  }

  #renderRow(row: Row) {
    return html`
      <div class="row">
        <uui-checkbox
          aria-label="Select ${row.name}"
          .checked=${this._selected.has(row.key)}
          @change=${(e: Event) => this.#toggle(row.key, (e.target as HTMLInputElement).checked)}
        ></uui-checkbox>
        <img class="thumb" src="${row.thumbnail}" alt="" loading="lazy" />
        <div class="body">
          <div class="name">${row.name}</div>
          <uui-textarea
            label="Alt text for ${row.name}"
            placeholder="No alt text yet"
            .value=${row.draft}
            @input=${(e: Event) => this.#update(row.key, { draft: (e.target as HTMLTextAreaElement).value })}
          ></uui-textarea>
          ${row.failed ? html`<div class="failed">${row.failed}</div>` : nothing}
        </div>
        <uui-button
          look="secondary"
          label=${row.draft.trim() ? "Regenerate" : "Generate"}
          .state=${row.busy ? "waiting" : undefined}
          ?disabled=${this._running}
          @click=${() => this.#generate(row.key)}
        ></uui-button>
      </div>
    `;
  }

  render() {
    if (this._loading) {
      return html`<div class="center"><uui-loader></uui-loader></div>`;
    }

    if (this._error) {
      return html`<uui-box headline="Alt Text Generator AI"><p>${this._error}</p></uui-box>`;
    }

    const showSetup = !this._settings?.hasKey || this._editingKey;
    const visible = this.#visible;
    const missing = this.#missing.length;
    const dirty = this.#dirty.length;
    const selected = this._selected.size;
    const generateLabel = selected > 0
      ? `Generate selected (${selected})`
      : this._overwrite ? `Generate all (${visible.length})` : `Generate all missing (${missing})`;

    return html`
      <div class="head">
        <div>
          <h1>Alt Text Generator AI</h1>
          <p class="lead">Write alt text for the images in your media library. Review it, change anything you like, then save.</p>
        </div>
        ${this._settings?.credits != null
          ? html`<div class="credits">Credits left: <strong>${this._settings.credits}</strong></div>`
          : nothing}
      </div>

      ${showSetup ? this.#renderSetup() : nothing}

      ${this._settings?.hasKey
        ? html`
            <uui-box>
              <div class="controls">
                <label class="field">
                  <span>Language of the alt text</span>
                  <uui-select
                    label="Language of the alt text"
                    .options=${LANGUAGES.map(([value, name]) => ({ name, value, selected: value === this._language }))}
                    @change=${(e: Event) => this.#setLanguage((e.target as HTMLSelectElement).value)}
                  ></uui-select>
                </label>
                <uui-checkbox
                  label="Overwrite images that already have alt text"
                  .checked=${this._overwrite}
                  @change=${(e: Event) => (this._overwrite = (e.target as HTMLInputElement).checked)}
                >Overwrite images that already have alt text</uui-checkbox>
                <div class="spacer"></div>
                ${this._settings.canEditKey && !this._editingKey
                  ? html`<uui-button look="secondary" label="Change API key" @click=${() => (this._editingKey = true)}></uui-button>`
                  : nothing}
                ${this._running
                  ? html`<uui-button look="secondary" color="danger" label="Stop" @click=${() => (this.#stop = true)}></uui-button>`
                  : html`<uui-button
                      look="primary"
                      label=${generateLabel}
                      ?disabled=${selected === 0 && (this._overwrite ? visible.length === 0 : missing === 0)}
                      @click=${this.#generateMany}
                    ></uui-button>`}
                <uui-button
                  look="primary"
                  color="positive"
                  label="Save changes (${dirty})"
                  ?disabled=${dirty === 0 || this._running}
                  .state=${this._saving ? "waiting" : undefined}
                  @click=${this.#saveAll}
                ></uui-button>
              </div>

              <uui-tab-group>
                <uui-tab label="Missing (${missing})" ?active=${this._filter === "missing"} @click=${() => { this._filter = "missing"; this._shown = PAGE; }}>Missing (${missing})</uui-tab>
                <uui-tab label="All (${this._rows.length})" ?active=${this._filter === "all"} @click=${() => { this._filter = "all"; this._shown = PAGE; }}>All (${this._rows.length})</uui-tab>
              </uui-tab-group>

              ${visible.length === 0
                ? html`<p class="empty">${this._filter === "missing" ? "Every image has alt text." : "Your media library has no images yet."}</p>`
                : html`
                    ${visible.slice(0, this._shown).map((row) => this.#renderRow(row))}
                    ${visible.length > this._shown
                      ? html`<div class="more"><uui-button look="secondary" label="Show more" @click=${() => (this._shown += PAGE)}></uui-button></div>`
                      : nothing}
                  `}
            </uui-box>
          `
        : nothing}
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--uui-size-layout-1);
      }
      h1 {
        margin: 0 0 var(--uui-size-space-2);
        font-size: var(--uui-size-8);
      }
      .lead {
        margin: 0 0 var(--uui-size-layout-1);
        color: var(--uui-color-text-alt);
      }
      .credits {
        white-space: nowrap;
      }
      .credits strong {
        font-size: var(--uui-size-8);
      }
      uui-box {
        margin-bottom: var(--uui-size-layout-1);
      }
      .key-row {
        display: flex;
        gap: var(--uui-size-space-3);
        align-items: center;
      }
      .key-row uui-input {
        flex: 1;
        max-width: 480px;
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: var(--uui-size-space-4);
        margin-bottom: var(--uui-size-space-5);
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-space-2);
        min-width: 220px;
      }
      .spacer {
        flex: 1;
      }
      .row {
        display: grid;
        grid-template-columns: auto 72px 1fr auto;
        gap: var(--uui-size-space-4);
        align-items: start;
        padding: var(--uui-size-space-4) 0;
        border-top: 1px solid var(--uui-color-divider-standalone);
      }
      .thumb {
        width: 72px;
        height: 72px;
        object-fit: contain;
        background: var(--uui-color-surface-alt);
        border-radius: var(--uui-border-radius);
      }
      .name {
        font-weight: bold;
        margin-bottom: var(--uui-size-space-2);
        word-break: break-all;
      }
      uui-textarea {
        width: 100%;
      }
      .failed {
        color: var(--uui-color-danger);
        margin-top: var(--uui-size-space-2);
      }
      .empty,
      .more {
        text-align: center;
        padding: var(--uui-size-layout-1);
        color: var(--uui-color-text-alt);
      }
      .center {
        display: flex;
        justify-content: center;
        padding: var(--uui-size-layout-2);
      }
    `,
  ];
}

export default AltTextGeneratorAIDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "alt-text-generator-ai-dashboard": AltTextGeneratorAIDashboardElement;
  }
}
