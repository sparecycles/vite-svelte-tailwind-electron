import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [svelte({})],
  build: {
    sourcemap: "inline",
    minify: false,
  },
});
