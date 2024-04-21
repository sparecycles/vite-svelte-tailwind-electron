import { ConfigEnv, defineConfig, mergeConfig } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  getBuildConfig,
  getBuildDefine,
  external,
  pluginHotRestart,
} from "./vite.base.config";

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
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"build">;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);

  const config = {
    resolve: {
      preserveSymlinks: true,
    },
    build: {
      sourcemap: "inline",
      minify: false,
      // from vite.base
      lib: {
        entry: forgeConfigSelf.entry!,
        fileName: () => "[name].js",
        formats: ["cjs"],
      },
      rollupOptions: {
        input: {
          main: "./electron/main.ts",
        },
        output: {
          exports: "named",
        },
        external, // from vite.base
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        ignoreDynamicRequires: true,
      },
    },
    plugins: [pluginHotRestart("restart")], // from vite.base
    define, // from vite.base
  };

  // getBuildConfig from vite.base
  return mergeConfig(getBuildConfig(forgeEnv), config);
});
