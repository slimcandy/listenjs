import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  plugins: [
    typescript({
      target: "ESNext",
      lib: ["ESNext", "DOM"],
    }),
    cleanup(),
  ],
  output: [
    {
      file: "dist/listenjs.js",
      format: "esm",
      sourcemap: true,
      plugins: [terser(), filesize()],
    },
  ],
};
