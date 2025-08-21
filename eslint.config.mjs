import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import angular from 'angular-eslint';

export const tsBaseConfig = {
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    ...angular.configs.tsRecommended,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
  },
  processor: angular.processInlineTemplates,
  rules: {
    "@angular-eslint/directive-selector": [
      "error",
      {
        type: "attribute",
        prefix: "app",
        style: "camelCase",
      },
    ],
    "@angular-eslint/component-selector": [
      "error",
      {
        type: "element",
        prefix: "app",
        style: "kebab-case",
      },
    ],
    "@angular-eslint/prefer-inject": [
      "warn"
    ]
  },
};

const authConfig = {
  ...tsBaseConfig,
  files: ["src/app/auth/**/*.ts"],
  rules: {
    ...tsBaseConfig.rules,
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@auth/*"],
            message: "Use relative imports within domain 'auth'.",
          },
        ],
      },
    ],
  },
};

export default defineConfig([
  tsBaseConfig,
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
    ]
  },
  authConfig,
  {
    ...tsBaseConfig,
    files: ["src/app/shared/**/*.ts"],
    rules: {
      ...tsBaseConfig.rules,
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@features/*"],
              message: "Domain 'shared' cannot import from domain 'features'.",
            },
          ],
        },
      ],
    }
  },
]);
