// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: "@typescript-eslint/parser",
  },

  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // any 사용 경고로 변경
  },
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
