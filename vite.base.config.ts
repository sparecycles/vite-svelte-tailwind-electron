import { builtinModules } from "node:module";
import type { AddressInfo } from "node:net";
import {
  ForgedConfigEnv,
  UserConfigExport,
  ViteDevServer,
  mergeConfig,
  type ConfigEnv,
  type Plugin,
  type UserConfig,
} from "vite";
import pkg from "./package.json";

export function extendMainConfig(config: UserConfigExport): UserConfigExport {
  return async (env: ConfigEnv) =>
    await applyBaseBuildConfig(env as ForgedConfigEnv<"build">, config, "main");
}

export function extendPreloadConfig(
  config: UserConfigExport
): UserConfigExport {
  return async (env: ConfigEnv) =>
    await applyBaseBuildConfig(
      env as ForgedConfigEnv<"build">,
      config,
      "preload"
    );
}

export function extendRendererConfig(
  config: UserConfigExport
): UserConfigExport {
  return async (env: ConfigEnv) =>
    await applyBaseRendererConfig(env as ForgedConfigEnv<"renderer">, config);
}

const builtins = [
  "electron",
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

const external = [...builtins, ...Object.keys(pkg["dependencies"] ?? {})];

// not quite sure why we need to smuggle this value via a global object.
const viteDevServers = ((process as any).viteDevServers ??= {}) as Record<
  string,
  ViteDevServer
>;

function isPromiseForUserConfig(
  config: UserConfigExport
): config is Promise<UserConfig> {
  return typeof (config as Promise<UserConfig>)?.then === "function";
}

async function resolveConfigExport(config: UserConfigExport, env: ConfigEnv) {
  if (typeof config === "function") {
    config = config(env);
  }

  if (isPromiseForUserConfig(config)) {
    config = await config;
  }

  return config;
}

async function applyBaseBuildConfig(
  env: ForgedConfigEnv<"build">,
  config: UserConfigExport,
  type: "main" | "preload"
) {
  const { root, mode, command } = env;
  const { entry } = env.forgeConfigSelf;
  const format = pkg.type === "module" ? "es" : "cjs";

  const define = env.forgeConfig.renderer
    .map(({ name }) => name)
    .filter(Boolean)
    .reduce<Record<string, string>>((define, name) => {
      const devServerUrlKey = `${name!.toUpperCase()}_VITE_DEV_SERVER_URL`;
      const viteName = `${name!.toUpperCase()}_VITE_NAME`;

      define[devServerUrlKey] = JSON.stringify(
        command === "serve"
          ? `http://localhost:${
              (viteDevServers[name!].httpServer?.address?.() as AddressInfo)
                ?.port
            }`
          : undefined
      );

      define[viteName] = JSON.stringify(name);

      return define;
    }, {});

  const mergedConfig = mergeConfig(
    {
      root,
      mode,
      ...(type === "main" && {
        resolve: {
          mainFields: ["module", "jsnext:main", "jsnext"],
        },
      }),
      build: {
        outDir: ".vite/build",
        emptyOutDir: false,
        watch: command === "serve" ? {} : null,
        minify: command === "build",
        ...(type === "main" && {
          lib: {
            entry: entry!,
            fileName: () => "[name].js",
            formats: [format],
          },
        }),
        rollupOptions: {
          external,
          ...(type === "preload" && {
            input: entry,
            output: {
              format,
              inlineDynamicImports: true,
              entryFileNames: "[name].js",
              chunkFileNames: "[name].js",
              assetFileNames: "[name].[ext]",
            },
          }),
        },
      },
      clearScreen: false,
      define,
    } satisfies UserConfig,
    await resolveConfigExport(config, env)
  );

  (mergedConfig.plugins ??= []).push(pluginHotRestart("restart"));

  return mergedConfig;
}

async function applyBaseRendererConfig(
  env: ForgedConfigEnv<"renderer">,
  config: UserConfigExport
) {
  const {
    root,
    mode,
    forgeConfigSelf: { name },
  } = env;

  const mergedConfig = mergeConfig(
    {
      root,
      mode,
      base: "./",
      build: {
        outDir: `.vite/renderer/${name}`,
      },
      resolve: {
        preserveSymlinks: true,
      },
      clearScreen: false,
    } as UserConfig,
    await resolveConfigExport(config, env)
  );

  (mergedConfig.plugins ??= []).push(pluginExposeRenderer(name!));

  return mergedConfig;
}

//
export function pluginExposeRenderer(name: string): Plugin {
  return {
    name: "./plugin-vite:expose-renderer",
    configureServer(server) {
      viteDevServers[name] = server;
    },
  };
}

export function pluginHotRestart(command: "reload" | "restart"): Plugin {
  return {
    name: "./plugin-vite:hot-restart",
    closeBundle() {
      if (command === "reload") {
        for (const server of Object.values(viteDevServers)) {
          // Preload scripts hot reload.
          server.hot.send({ type: "full-reload" });
        }
      } else {
        // Main process hot restart.
        // https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
        process.stdin.emit("data", "rs");
      }
    },
  };
}
