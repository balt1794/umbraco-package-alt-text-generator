export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: "AltTextGeneratorAI.PropertyEditorUi",
    name: "Alt Text Generator AI Property Editor UI",
    element: () => import("./alt-text-property-editor.element.js"),
    meta: {
      label: "Alt text with Generate button",
      propertyEditorSchemaAlias: "Umbraco.TextBox",
      icon: "icon-picture",
      group: "common",
    },
  },
];
