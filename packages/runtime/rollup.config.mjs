import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  plugins: [cleanup()],
  output: [
    {
      file: "dist/listenjs.js",
      format: "esm",
      sourcemap: true,
      plugins: [terser(), filesize()],
    },
  ],
};
