import { svelte } from "@sveltejs/vite-plugin-svelte";
import { extendRendererConfig } from "./vite.base.config";

// https://vitejs.dev/config
export default extendRendererConfig({
  plugins: [svelte({})],
});
