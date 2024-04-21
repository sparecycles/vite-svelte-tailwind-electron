import { ConfigEnv, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { pluginExposeRenderer } from "./vite.base.config";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";
  return {
    root,
    mode,
    base: "./",
    build: {
      // from template
      outDir: `.vite/renderer/${name}`,
      // holdover from my own settings
      sourcemap: "inline",
      minify: false,
    },
    resolve: {
      preserveSymlinks: true,
    },
    plugins: [svelte({}), pluginExposeRenderer(name)],
  };
});
