import { UMB_AUTH_CONTEXT as o } from "@umbraco-cms/backoffice/auth";
import { c as e } from "./client.gen-BFCdw88j.js";
const r = async (n) => {
  const t = await n.getContext(o);
  if (!t) {
    console.warn("UMB_AUTH_CONTEXT not available, the Alt Text Generator AI API client will not be authenticated");
    return;
  }
  t.configureClient(e);
}, c = () => {
};
export {
  r as onInit,
  c as onUnload
};
