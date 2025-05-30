import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import pluginA11y from "eslint-plugin-jsx-a11y";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js, "jsx-a11y": pluginA11y }, extends: ["js/recommended", "plugin:jsx-a11y/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended, // Replaced by pluginA11y config for flat config? No, this is correct way.
  {
    files: ['src/app/**/documents/**/page.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
         {
          patterns: [
            './*Faq*',
            './*Hero*',
            './*Animation*',
            './*Lottie*',
            './*Markdown*',
            './*Viewer*',
            './*Preview*',
            './*Chart*',
            './*Map*',
          ],
          message:
            'Wrap this import with lazyClient(): ' +
            "import { lazyClient } from '@/lib/lazy-client'; " +
            "const Foo = lazyClient(() => import('./Foo'));",
        },
      ],
    },
  },
]);
