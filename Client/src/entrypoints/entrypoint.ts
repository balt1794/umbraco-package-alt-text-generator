import type { UmbEntryPointOnInit, UmbEntryPointOnUnload } from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { client } from "../api/client.gen.js";

export const onInit: UmbEntryPointOnInit = async (host) => {
  // Wire the generated API client into the backoffice auth context so its calls are signed in.
  const authContext = await host.getContext(UMB_AUTH_CONTEXT);
  if (!authContext) {
    console.warn("UMB_AUTH_CONTEXT not available, the Alt Text Generator AI API client will not be authenticated");
    return;
  }
  authContext.configureClient(client);
};

export const onUnload: UmbEntryPointOnUnload = () => {};
