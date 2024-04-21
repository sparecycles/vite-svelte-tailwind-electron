import { ConfigEnv, defineConfig, mergeConfig } from "vite";
import {
  getBuildConfig,
  getBuildDefine,
  external,
  pluginHotRestart,
} from "./vite.base.config";

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
        formats: ["es"],
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
