import { defineConfig } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const dist = new URL(import.meta.resolve("./.vite/build/")).pathname.replace(
  /[/]([A-Z]):[/]/,
  "$1:/"
);

mkdirSync(dist, { recursive: true });
writeFileSync(
  path.join(dist, "package.json"),
  JSON.stringify({ type: "commonjs" })
);

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: "inline",
    minify: false,
    rollupOptions: {
      input: {
        main: "./electron/main.ts",
      },
      output: {
        exports: "named",
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      ignoreDynamicRequires: true,
    },
  },
});
