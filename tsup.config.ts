import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  clean: true,
  target: "es2022",
  dts: true,
  sourcemap: true,
  minify: false,
  splitting: false,
});
