export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Alt Text Generator AI Entrypoint",
    alias: "AltTextGeneratorAI.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
