import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: "inline",
    minify: false,
    outDir: "./.vite/build",
    lib: {
      entry: "./electron/main.ts",
      fileName: () => "[name].js",
      formats: ["es"],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      ignoreDynamicRequires: true,
    },
  },
});
