import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bundle.manifests.ts", // Bundle registers one or more manifests
      formats: ["es"],
      fileName: "alt-text-generator-ai",
    },
    outDir: "../wwwroot/App_Plugins/AltTextGeneratorAI", // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  },
});
