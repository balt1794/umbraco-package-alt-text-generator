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
    js: () => import("./dashboard.element-gPzh1_9t.js"),
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
  ...t,
  ...e
];
export {
  a as manifests
};
