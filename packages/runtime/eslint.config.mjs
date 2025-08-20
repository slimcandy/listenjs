import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { parser: tseslint.parser, globals: globals.browser },
    plugins: {
      js,
      import: importPlugin,
      "@typescript-eslint": tseslint.plugin,
    },
    extends: [
      "js/recommended",
      ...tseslint.configs.recommended, // TS rules
    ],
    rules: {
      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      // Function declarations preferred
      "func-style": ["error", "declaration", { allowArrowFunctions: false }],

      // Always require braces
      curly: ["error", "all"],

      // Ban `any`
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
