import { LitElement as f, nothing as d, html as c, css as g, property as E, state as h, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as b } from "@umbraco-cms/backoffice/element-api";
import { UmbChangeEvent as A } from "@umbraco-cms/backoffice/event";
import { UMB_MEDIA_WORKSPACE_CONTEXT as w } from "@umbraco-cms/backoffice/media";
import { tryExecute as C } from "@umbraco-cms/backoffice/resources";
import { c as P } from "./sdk.gen-DKpuKDXF.js";
var T = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, m = (t) => {
  throw TypeError(t);
}, o = (t, e, r, n) => {
  for (var i = n > 1 ? void 0 : n ? $(e, r) : e, u = t.length - 1, p; u >= 0; u--)
    (p = t[u]) && (i = (n ? p(e, r, i) : p(i)) || i);
  return n && i && T(e, r, i), i;
}, K = (t, e, r) => e.has(t) || m("Cannot " + r), O = (t, e, r) => e.has(t) ? m("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), l = (t, e, r) => (K(t, e, "access private method"), r), s, v, _, y;
const G = "altTextGeneratorAI.language";
let a = class extends b(f) {
  constructor() {
    super(), O(this, s), this.value = "", this._busy = !1, this._error = "", this.consumeContext(w, (t) => {
      this._mediaKey = t?.getUnique() ?? void 0;
    });
  }
  render() {
    return c`
      <div class="row">
        <uui-input
          label="Alt text"
          .value=${this.value ?? ""}
          @input=${(t) => l(this, s, _).call(this, t.target.value)}
        ></uui-input>
        ${this._mediaKey ? c`<uui-button
              look="secondary"
              label=${this.value?.trim() ? "Regenerate" : "Generate"}
              .state=${this._busy ? "waiting" : void 0}
              @click=${l(this, s, y)}
            ></uui-button>` : d}
      </div>
      ${this._error ? c`<div class="error">${this._error}</div>` : d}
    `;
  }
};
s = /* @__PURE__ */ new WeakSet();
v = function() {
  try {
    return localStorage.getItem(G) || "english";
  } catch {
    return "english";
  }
};
_ = function(t) {
  this.value = t, this.dispatchEvent(new A());
};
y = async function() {
  if (!this._mediaKey) return;
  this._busy = !0, this._error = "";
  const { data: t, error: e } = await C(
    this,
    P({ body: { key: this._mediaKey, language: l(this, s, v).call(this) } })
  );
  if (this._busy = !1, e || !t) {
    const r = e;
    this._error = r?.problemDetails?.detail || r?.message || "Alt text could not be generated.";
    return;
  }
  l(this, s, _).call(this, t.altText);
};
a.styles = [
  g`
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
    `
];
o([
  E({ type: String })
], a.prototype, "value", 2);
o([
  h()
], a.prototype, "_busy", 2);
o([
  h()
], a.prototype, "_error", 2);
o([
  h()
], a.prototype, "_mediaKey", 2);
a = o([
  x("alt-text-generator-ai-property-editor")
], a);
const z = a;
export {
  a as AltTextPropertyEditorElement,
  z as default
};
