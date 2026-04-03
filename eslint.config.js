import pluginJs from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";
import { readFileSync } from "fs";

export default defineConfig([
  globalIgnores(["dist"]),
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs["flat/recommended"],

  // --- TypeScript + React files ---
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      // Recommended rule sets
      ...reactHooks.configs["recommended-latest"].rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactRefresh.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended-requiring-type-checking"].rules,
      ...importPlugin.configs.typescript.rules,

      // React
      "react/display-name": "warn",
      "react/jsx-curly-brace-presence": "warn",
      "react/jsx-sort-props": "warn",
      "react/prop-types": "off",
      "react/self-closing-comp": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@/no-nested-ternary": "error",

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

    // Filters out react-hooks/incompatible-library errors for files containing "use no memo"
    processor: {
      preprocess(text) {
        return [text];
      },
      postprocess(messages, filename) {
        const flat = messages.flat().filter(Boolean);
        try {
          const content = readFileSync(filename, "utf-8");
          if (/use\s+no\s+memo/i.test(content)) {
            return flat.filter((m) => m.ruleId !== "react-hooks/incompatible-library");
          }
        } catch {
          // If we can't read the file, return messages as-is
        }
        return flat;
      },
      supportsAutofix: true,
    },
  },
  prettierConfig,
]);
