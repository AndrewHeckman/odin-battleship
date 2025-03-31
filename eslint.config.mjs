import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";

export default [
  ...defineConfig([
    { files: ["**/*.{js,mjs,cjs}"] },
    {
      files: ["**/*.{js,mjs,cjs}"],
      languageOptions: { globals: globals.node },
    },
    {
      files: ["**/*.{js,mjs,cjs}"],
      plugins: { js },
      extends: ["js/recommended"],
    },
    {
      files: ["**/*.test.{js,mjs,cjs}"],
      plugins: { jest: pluginJest },
      languageOptions: {
        globals: pluginJest.environments.globals.globals,
      },
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
      },
    },
  ]),
  eslintConfigPrettier,
];
