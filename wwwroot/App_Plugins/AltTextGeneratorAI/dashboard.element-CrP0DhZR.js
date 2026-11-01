import { LitElement as U, html as l, nothing as g, css as H, state as u, customElement as R } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as W } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as F } from "@umbraco-cms/backoffice/notification";
import { tryExecute as f } from "@umbraco-cms/backoffice/resources";
import { c as v } from "./client.gen-BFCdw88j.js";
const Y = (e) => (e?.client ?? v).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/generate",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), q = (e) => (e?.client ?? v).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/images",
  ...e
}), J = (e) => (e?.client ?? v).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/save",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), X = (e) => (e?.client ?? v).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/settings",
  ...e
}), Q = (e) => (e?.client ?? v).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/settings",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), V = [
  ["english", "English"],
  ["spanish", "Spanish"],
  ["french", "French"],
  ["german", "German"],
  ["italian", "Italian"],
  ["portuguese", "Portuguese"],
  ["dutch", "Dutch"],
  ["russian", "Russian"],
  ["chinese", "Chinese"],
  ["japanese", "Japanese"],
  ["korean", "Korean"],
  ["arabic", "Arabic"],
  ["swedish", "Swedish"],
  ["norwegian", "Norwegian"],
  ["danish", "Danish"],
  ["finnish", "Finnish"],
  ["polish", "Polish"],
  ["turkish", "Turkish"],
  ["hindi", "Hindi"],
  ["bengali", "Bengali"],
  ["urdu", "Urdu"],
  ["thai", "Thai"],
  ["vietnamese", "Vietnamese"],
  ["indonesian", "Indonesian"],
  ["malay", "Malay"],
  ["filipino", "Filipino"],
  ["greek", "Greek"],
  ["hebrew", "Hebrew"],
  ["hungarian", "Hungarian"],
  ["czech", "Czech"],
  ["romanian", "Romanian"],
  ["bulgarian", "Bulgarian"],
  ["ukrainian", "Ukrainian"],
  ["croatian", "Croatian"],
  ["serbian", "Serbian"],
  ["afrikaans", "Afrikaans"],
  ["albanian", "Albanian"],
  ["amharic", "Amharic"],
  ["armenian", "Armenian"],
  ["assamese", "Assamese"],
  ["aymara", "Aymara"],
  ["azerbaijani", "Azerbaijani"],
  ["bambara", "Bambara"],
  ["basque", "Basque"],
  ["belarusian", "Belarusian"],
  ["bhojpuri", "Bhojpuri"],
  ["bosnian", "Bosnian"],
  ["catalan", "Catalan"],
  ["cebuano", "Cebuano"],
  ["corsican", "Corsican"],
  ["dhivehi", "Dhivehi"],
  ["dogri", "Dogri"],
  ["esperanto", "Esperanto"],
  ["estonian", "Estonian"],
  ["ewe", "Ewe"],
  ["frisian", "Frisian"],
  ["galician", "Galician"],
  ["georgian", "Georgian"],
  ["guarani", "Guarani"],
  ["gujarati", "Gujarati"],
  ["haitiancreole", "Haitian Creole"],
  ["hausa", "Hausa"],
  ["hawaiian", "Hawaiian"],
  ["hmong", "Hmong"],
  ["icelandic", "Icelandic"],
  ["igbo", "Igbo"],
  ["ilocano", "Ilocano"],
  ["irish", "Irish"],
  ["javanese", "Javanese"],
  ["kannada", "Kannada"],
  ["kazakh", "Kazakh"],
  ["khmer", "Khmer"],
  ["kinyarwanda", "Kinyarwanda"],
  ["konkani", "Konkani"],
  ["krio", "Krio"],
  ["kurdish", "Kurdish"],
  ["kyrgyz", "Kyrgyz"],
  ["lao", "Lao"],
  ["latin", "Latin"],
  ["latvian", "Latvian"],
  ["lingala", "Lingala"],
  ["lithuanian", "Lithuanian"],
  ["luganda", "Luganda"],
  ["luxembourgish", "Luxembourgish"],
  ["macedonian", "Macedonian"],
  ["maithili", "Maithili"],
  ["malagasy", "Malagasy"],
  ["malayalam", "Malayalam"],
  ["maltese", "Maltese"],
  ["maori", "Maori"],
  ["marathi", "Marathi"],
  ["meiteilon", "Meiteilon (Manipuri)"],
  ["mizo", "Mizo"],
  ["mongolian", "Mongolian"],
  ["myanmar", "Myanmar (Burmese)"],
  ["nepali", "Nepali"],
  ["nyanja", "Nyanja (Chichewa)"],
  ["odia", "Odia (Oriya)"],
  ["oromo", "Oromo"],
  ["pashto", "Pashto"],
  ["persian", "Persian"],
  ["punjabi", "Punjabi"],
  ["quechua", "Quechua"],
  ["samoan", "Samoan"],
  ["sanskrit", "Sanskrit"],
  ["scotsgaelic", "Scots Gaelic"],
  ["sepedi", "Sepedi"],
  ["sesotho", "Sesotho"],
  ["shona", "Shona"],
  ["sindhi", "Sindhi"],
  ["sinhala", "Sinhala (Sinhalese)"],
  ["slovak", "Slovak"],
  ["slovenian", "Slovenian"],
  ["somali", "Somali"],
  ["sundanese", "Sundanese"],
  ["swahili", "Swahili"],
  ["tajik", "Tajik"],
  ["tamil", "Tamil"],
  ["tatar", "Tatar"],
  ["telugu", "Telugu"],
  ["tigrinya", "Tigrinya"],
  ["tsonga", "Tsonga"],
  ["turkmen", "Turkmen"],
  ["twi", "Twi (Akan)"],
  ["uyghur", "Uyghur"],
  ["uzbek", "Uzbek"],
  ["welsh", "Welsh"],
  ["xhosa", "Xhosa"],
  ["yiddish", "Yiddish"],
  ["yoruba", "Yoruba"],
  ["zulu", "Zulu"]
];
var Z = Object.defineProperty, ee = Object.getOwnPropertyDescriptor, G = (e) => {
  throw TypeError(e);
}, o = (e, t, a, h) => {
  for (var n = h > 1 ? void 0 : h ? ee(t, a) : t, y = e.length - 1, c; y >= 0; y--)
    (c = e[y]) && (n = (h ? c(t, a, n) : c(n)) || n);
  return h && n && Z(t, a, n), n;
}, z = (e, t, a) => t.has(e) || G("Cannot " + a), d = (e, t, a) => (z(e, t, "read from private field"), a ? a.call(e) : t.get(e)), $ = (e, t, a) => t.has(e) ? G("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), S = (e, t, a, h) => (z(e, t, "write to private field"), t.set(e, a), a), s = (e, t, a) => (z(e, t, "access private method"), a), w, _, i, C, p, b, E, A, x, I, T, m, K, M, j, L, P, B, O;
const k = 100, D = "altTextGeneratorAI.language";
let r = class extends W(U) {
  constructor() {
    super(), $(this, i), this._rows = [], this._loading = !0, this._filter = "missing", this._language = s(this, i, C).call(this), this._overwrite = !1, this._selected = /* @__PURE__ */ new Set(), this._shown = k, this._running = !1, this._saving = !1, this._keyInput = "", this._keyBusy = !1, this._editingKey = !1, this._error = "", $(this, w), $(this, _, !1), this.consumeContext(F, (e) => {
      S(this, w, e);
    });
  }
  connectedCallback() {
    super.connectedCallback(), s(this, i, E).call(this);
  }
  render() {
    if (this._loading)
      return l`<div class="center"><uui-loader></uui-loader></div>`;
    if (this._error)
      return l`<uui-box headline="Alt Text Generator AI"><p>${this._error}</p></uui-box>`;
    const e = !this._settings?.hasKey || this._editingKey, t = d(this, i, I), a = d(this, i, x).length, h = d(this, i, T).length, n = this._selected.size, y = n > 0 ? `Generate selected (${n})` : this._overwrite ? `Generate all (${t.length})` : `Generate all missing (${a})`;
    return l`
      <div class="head">
        <div>
          <h1>Alt Text Generator AI</h1>
          <p class="lead">Write alt text for the images in your media library. Review it, change anything you like, then save.</p>
        </div>
        ${this._settings?.credits != null ? l`<div class="credits">Credits left: <strong>${this._settings.credits}</strong></div>` : g}
      </div>

      ${e ? s(this, i, B).call(this) : g}

      ${this._settings?.hasKey ? l`
            <uui-box>
              <div class="controls">
                <label class="field">
                  <span>Language of the alt text</span>
                  <uui-select
                    label="Language of the alt text"
                    .options=${V.map(([c, N]) => ({ name: N, value: c, selected: c === this._language }))}
                    @change=${(c) => s(this, i, P).call(this, c.target.value)}
                  ></uui-select>
                </label>
                <uui-checkbox
                  label="Overwrite images that already have alt text"
                  .checked=${this._overwrite}
                  @change=${(c) => this._overwrite = c.target.checked}
                >Overwrite images that already have alt text</uui-checkbox>
                <div class="spacer"></div>
                ${this._settings.canEditKey && !this._editingKey ? l`<uui-button look="secondary" label="Change API key" @click=${() => this._editingKey = !0}></uui-button>` : g}
                ${this._running ? l`<uui-button look="secondary" color="danger" label="Stop" @click=${() => S(this, _, !0)}></uui-button>` : l`<uui-button
                      look="primary"
                      label=${y}
                      ?disabled=${n === 0 && (this._overwrite ? t.length === 0 : a === 0)}
                      @click=${s(this, i, M)}
                    ></uui-button>`}
                <uui-button
                  look="primary"
                  color="positive"
                  label="Save changes (${h})"
                  ?disabled=${h === 0 || this._running}
                  .state=${this._saving ? "waiting" : void 0}
                  @click=${s(this, i, j)}
                ></uui-button>
              </div>

              <uui-tab-group>
                <uui-tab label="Missing (${a})" ?active=${this._filter === "missing"} @click=${() => {
      this._filter = "missing", this._shown = k;
    }}>Missing (${a})</uui-tab>
                <uui-tab label="All (${this._rows.length})" ?active=${this._filter === "all"} @click=${() => {
      this._filter = "all", this._shown = k;
    }}>All (${this._rows.length})</uui-tab>
              </uui-tab-group>

              ${t.length === 0 ? l`<p class="empty">${this._filter === "missing" ? "Every image has alt text." : "Your media library has no images yet."}</p>` : l`
                    ${t.slice(0, this._shown).map((c) => s(this, i, O).call(this, c))}
                    ${t.length > this._shown ? l`<div class="more"><uui-button look="secondary" label="Show more" @click=${() => this._shown += k}></uui-button></div>` : g}
                  `}
            </uui-box>
          ` : g}
    `;
  }
};
w = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakMap();
i = /* @__PURE__ */ new WeakSet();
C = function() {
  try {
    return localStorage.getItem(D) || "english";
  } catch {
    return "english";
  }
};
p = function(e, t, a) {
  d(this, w)?.peek(e, { data: { headline: t, message: a ?? "" } });
};
b = function(e) {
  const t = e;
  return t?.problemDetails?.detail || t?.detail || t?.message || "Something went wrong.";
};
E = async function() {
  this._loading = !0, this._error = "";
  const e = await f(this, X());
  if (e.data && (this._settings = e.data), e.data?.hasKey || !e.error) {
    const t = await f(this, q());
    t.error ? this._error = s(this, i, b).call(this, t.error) : t.data && (this._rows = t.data.items.map((a) => ({ ...a, draft: a.altText, busy: !1 })));
  }
  this._loading = !1;
};
A = async function() {
  if (!this._keyInput.trim()) return;
  this._keyBusy = !0;
  const { data: e, error: t } = await f(this, Q({ body: { apiKey: this._keyInput.trim() } }));
  if (this._keyBusy = !1, t || !e) {
    s(this, i, p).call(this, "danger", "Key not saved", s(this, i, b).call(this, t));
    return;
  }
  this._settings = e, this._keyInput = "", this._editingKey = !1, s(this, i, p).call(this, "positive", "API key saved");
};
x = function() {
  return this._rows.filter((e) => !e.draft.trim());
};
I = function() {
  return this._filter === "missing" ? d(this, i, x) : this._rows;
};
T = function() {
  return this._rows.filter((e) => e.draft.trim() !== e.altText);
};
m = function(e, t) {
  this._rows = this._rows.map((a) => a.key === e ? { ...a, ...t } : a);
};
K = async function(e) {
  s(this, i, m).call(this, e, { busy: !0, failed: void 0 });
  const { data: t, error: a } = await f(this, Y({ body: { key: e, language: this._language } }));
  if (a || !t) {
    const h = s(this, i, b).call(this, a);
    return s(this, i, m).call(this, e, { busy: !1, failed: h }), !1;
  }
  return s(this, i, m).call(this, e, { busy: !1, draft: t.altText }), this._settings && t.creditsLeft != null && (this._settings = { ...this._settings, credits: t.creditsLeft }), !0;
};
M = async function() {
  const e = this._selected.size > 0 ? this._rows.filter((a) => this._selected.has(a.key)) : this._overwrite ? d(this, i, I) : d(this, i, x);
  if (e.length === 0) return;
  this._running = !0, S(this, _, !1);
  let t = 0;
  for (const a of e) {
    if (d(this, _) || !await s(this, i, K).call(this, a.key))
      break;
    t++;
  }
  this._running = !1, t > 0 && s(this, i, p).call(this, "positive", `Generated alt text for ${t} image${t === 1 ? "" : "s"}`, "Read it, change anything you like, then click Save changes.");
};
j = async function() {
  const e = d(this, i, T).map((n) => ({ key: n.key, altText: n.draft.trim() }));
  if (e.length === 0) return;
  this._saving = !0;
  const { data: t, error: a } = await f(this, J({ body: { items: e } }));
  if (this._saving = !1, a || !t) {
    s(this, i, p).call(this, "danger", "Could not save", s(this, i, b).call(this, a));
    return;
  }
  const h = new Set(e.map((n) => n.key));
  this._rows = this._rows.map((n) => h.has(n.key) ? { ...n, altText: n.draft.trim() } : n), this._selected = /* @__PURE__ */ new Set(), s(this, i, p).call(this, "positive", `Saved ${t.saved} image${t.saved === 1 ? "" : "s"}`);
};
L = function(e, t) {
  const a = new Set(this._selected);
  t ? a.add(e) : a.delete(e), this._selected = a;
};
P = function(e) {
  this._language = e;
  try {
    localStorage.setItem(D, e);
  } catch {
  }
};
B = function() {
  const e = this._settings?.canEditKey ?? !1;
  return l`
      <uui-box headline="Add your API key">
        ${e ? l`
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
                  @input=${(t) => this._keyInput = t.target.value}
                  @keydown=${(t) => t.key === "Enter" && s(this, i, A).call(this)}
                ></uui-input>
                <uui-button
                  look="primary"
                  color="positive"
                  label="Save key"
                  .state=${this._keyBusy ? "waiting" : void 0}
                  @click=${s(this, i, A)}
                ></uui-button>
                ${this._settings?.hasKey ? l`<uui-button look="secondary" label="Cancel" @click=${() => this._editingKey = !1}></uui-button>` : g}
              </div>
            ` : l`<p>Ask an administrator to add the API key in this dashboard.</p>`}
      </uui-box>
    `;
};
O = function(e) {
  return l`
      <div class="row">
        <uui-checkbox
          aria-label="Select ${e.name}"
          .checked=${this._selected.has(e.key)}
          @change=${(t) => s(this, i, L).call(this, e.key, t.target.checked)}
        ></uui-checkbox>
        <img class="thumb" src="${e.thumbnail}" alt="" loading="lazy" />
        <div class="body">
          <div class="name">${e.name}</div>
          <uui-textarea
            label="Alt text for ${e.name}"
            placeholder="No alt text yet"
            .value=${e.draft}
            @input=${(t) => s(this, i, m).call(this, e.key, { draft: t.target.value })}
          ></uui-textarea>
          ${e.failed ? l`<div class="failed">${e.failed}</div>` : g}
        </div>
        <uui-button
          look="secondary"
          label=${e.draft.trim() ? "Regenerate" : "Generate"}
          .state=${e.busy ? "waiting" : void 0}
          ?disabled=${this._running}
          @click=${() => s(this, i, K).call(this, e.key)}
        ></uui-button>
      </div>
    `;
};
r.styles = [
  H`
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
    `
];
o([
  u()
], r.prototype, "_settings", 2);
o([
  u()
], r.prototype, "_rows", 2);
o([
  u()
], r.prototype, "_loading", 2);
o([
  u()
], r.prototype, "_filter", 2);
o([
  u()
], r.prototype, "_language", 2);
o([
  u()
], r.prototype, "_overwrite", 2);
o([
  u()
], r.prototype, "_selected", 2);
o([
  u()
], r.prototype, "_shown", 2);
o([
  u()
], r.prototype, "_running", 2);
o([
  u()
], r.prototype, "_saving", 2);
o([
  u()
], r.prototype, "_keyInput", 2);
o([
  u()
], r.prototype, "_keyBusy", 2);
o([
  u()
], r.prototype, "_editingKey", 2);
o([
  u()
], r.prototype, "_error", 2);
r = o([
  R("alt-text-generator-ai-dashboard")
], r);
const re = r;
export {
  r as AltTextGeneratorAIDashboardElement,
  re as default
};
