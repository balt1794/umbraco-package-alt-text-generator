import {
  LitElement,
  css,
  html,
  nothing,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { UMB_MEDIA_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/media";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { postGenerate } from "../api/index.js";

const LANGUAGE_KEY = "altTextGeneratorAI.language";

/** The Alt text field of an image, with a button that writes the text with Alt Text Generator AI. */
@customElement("alt-text-generator-ai-property-editor")
export class AltTextPropertyEditorElement extends UmbElementMixin(LitElement) implements UmbPropertyEditorUiElement {
  @property({ type: String })
  value = "";

  @state() private _busy = false;
  @state() private _error = "";
  @state() private _mediaKey?: string;

  constructor() {
    super();
    this.consumeContext(UMB_MEDIA_WORKSPACE_CONTEXT, (context) => {
      this._mediaKey = context?.getUnique() ?? undefined;
    });
  }

  #language() {
    try {
      return localStorage.getItem(LANGUAGE_KEY) || "english";
    } catch {
      return "english";
    }
  }

  #setValue(value: string) {
    this.value = value;
    this.dispatchEvent(new UmbChangeEvent());
  }

  async #generate() {
    if (!this._mediaKey) return;

    this._busy = true;
    this._error = "";
    const { data, error } = await tryExecute(
      this,
      postGenerate({ body: { key: this._mediaKey, language: this.#language() } }),
    );
    this._busy = false;

    if (error || !data) {
      const e = error as { message?: string; problemDetails?: { detail?: string } } | undefined;
      this._error = e?.problemDetails?.detail || e?.message || "Alt text could not be generated.";
      return;
    }

    this.#setValue(data.altText);
  }

  render() {
    return html`
      <div class="row">
        <uui-input
          label="Alt text"
          .value=${this.value ?? ""}
          @input=${(e: Event) => this.#setValue((e.target as HTMLInputElement).value)}
        ></uui-input>
        ${this._mediaKey
          ? html`<uui-button
              look="secondary"
              label=${this.value?.trim() ? "Regenerate" : "Generate"}
              .state=${this._busy ? "waiting" : undefined}
              @click=${this.#generate}
            ></uui-button>`
          : nothing}
      </div>
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
    `;
  }

  static styles = [
    css`
      .row {
        display: flex;
        gap: var(--uui-size-space-3);
        align-items: center;
      }
      uui-input {
        flex: 1;
      }
      .error {
        color: var(--uui-color-danger);
        margin-top: var(--uui-size-space-2);
      }
    `,
  ];
}

export default AltTextPropertyEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    "alt-text-generator-ai-property-editor": AltTextPropertyEditorElement;
  }
}
