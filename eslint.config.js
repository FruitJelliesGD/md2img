import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{ts,vue}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "vue/multi-word-component-names": "off",
    },
  },
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.js"],
  },
];
