import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { extendMainConfig } from "./vite.base.config";

const dist = new URL(import.meta.resolve("./.vite/build/")).pathname.replace(
  /[/]([A-Z]):[/]/,
  "$1:/"
);

mkdirSync(dist, { recursive: true });
writeFileSync(
  path.join(dist, "package.json"),
  JSON.stringify({ type: "commonjs" })
);

export default extendMainConfig({});
