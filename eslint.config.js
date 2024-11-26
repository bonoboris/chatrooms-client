// @ts-check

import eslint from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
// import reactAll from "eslint-plugin-react/configs/all.js";
// import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        project: ["tsconfig.json", "tsconfig.node.json"],
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "detect" },
    },
  },
  // @ts-ignore
  reactPlugin.configs.flat.all,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      "react/jsx-filename-extension": ["error", { extensions: [".tsx"], allow: "as-needed" }],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-max-depth": ["error", { max: 5 }],
      "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
      "react/jsx-no-literals": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-newline": "off",
      "react/forbid-component-props": "off",
      "react/no-multi-comp": ["error", { ignoreStateless: true }],
      "react/require-default-props": ["error", { functions: "defaultArguments" }],
      "react-refresh/only-export-components": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
);
