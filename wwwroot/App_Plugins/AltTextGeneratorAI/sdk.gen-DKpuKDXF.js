import { c as t } from "./client.gen-BFCdw88j.js";
const r = (e) => (e?.client ?? t).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/generate",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), s = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/images",
  ...e
}), c = (e) => (e?.client ?? t).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/save",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), n = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/settings",
  ...e
}), i = (e) => (e?.client ?? t).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/alttextgeneratorai/api/v1/settings",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
});
export {
  s as a,
  i as b,
  r as c,
  n as g,
  c as p
};
