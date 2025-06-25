import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";

export default {
  input: "src/index.ts",
  plugins: [
    typescript({
      tsconfig: false, // <-- use TypeScript defaults
    }),
    cleanup(),
  ],
  output: [
    {
      file: "dist/listenjs.js",
      format: "esm",
      plugins: [filesize()],
    },
  ],
};
