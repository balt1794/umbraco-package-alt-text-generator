export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Alt Text Generator AI Dashboard",
    alias: "AltTextGeneratorAI.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    weight: 100,
    meta: {
      label: "Alt Text Generator AI",
      pathname: "alt-text-generator-ai",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Media",
      },
    ],
  },
];
