import type { UserConfig } from "vite";

// https://vitejs.dev/config
export default async () =>
  ({
    plugins: [(await import("@sveltejs/vite-plugin-svelte")).svelte({})],
  } satisfies UserConfig);
