const t = [
  {
    name: "Alt Text Generator AI Entrypoint",
    alias: "AltTextGeneratorAI.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CmF6uVhA.js")
  }
], e = [
  {
    name: "Alt Text Generator AI Dashboard",
    alias: "AltTextGeneratorAI.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-nmSPZNWE.js"),
    weight: 100,
    meta: {
      label: "Alt Text Generator AI",
      pathname: "alt-text-generator-ai"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Media"
      }
    ]
  }
], a = [
  {
    type: "propertyEditorUi",
    alias: "AltTextGeneratorAI.PropertyEditorUi",
    name: "Alt Text Generator AI Property Editor UI",
    element: () => import("./alt-text-property-editor.element-D_j-qOd4.js"),
    meta: {
      label: "Alt text with Generate button",
      propertyEditorSchemaAlias: "Umbraco.TextBox",
      icon: "icon-picture",
      group: "common"
    }
  }
], o = [
  ...t,
  ...e,
  ...a
];
export {
  o as manifests
};
