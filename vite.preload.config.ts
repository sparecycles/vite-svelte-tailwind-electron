import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: "inline",
    minify: false,
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
});
