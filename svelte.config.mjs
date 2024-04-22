import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import path from "node:path";

const { name, script } = vitePreprocess({ script: true });
const { style } = sveltePreprocess({
  postcss: {
    configFilePath: path.resolve(
      new URL(import.meta.url).pathname,
      "../postcss.config.cjs",
    ),
  },
});

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: { name, script, style },
};
