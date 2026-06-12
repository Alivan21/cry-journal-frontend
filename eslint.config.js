import pluginJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      eslintReact.configs["recommended-typescript"],
      reactRefresh.configs.vite,
      jsxA11yPlugin.flatConfigs.recommended,
      ...pluginQuery.configs["flat/recommended"],
    ],

    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      import: importPlugin,
    },

    settings: {
      ...importPlugin.configs.typescript.settings,
    },

    rules: {
      ...importPlugin.configs.typescript.rules,

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-nested-ternary": "error",

      // Imports
      "sort-imports": "off",
      "import/first": "off",
      "import/newline-after-import": "off",
      "import/no-duplicates": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "object",
            "type",
            "index",
            "parent",
            "sibling",
          ],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  prettierConfig,
]);
