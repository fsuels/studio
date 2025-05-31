/* eslint.config.mjs — Flat config for ESLint 9
   Core: @eslint/js, @typescript-eslint, react, react-hooks, jsx-a11y        */

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig } from 'eslint/config';

/* pull a11y recommended rules and down-grade them to “warn” */
const a11yWarnRules = {};
for (const [rule, level] of Object.entries(
  pluginA11y.configs.recommended.rules ?? {},
)) {
  a11yWarnRules[rule] = level === 'error' ? 'warn' : level;
}

/* react-hooks recommended */
const hooksRules = pluginReactHooks.configs.recommended.rules ?? {};

export default defineConfig([
  {
    ignores: ['.next/**', 'public/**', 'coverage/**', '*.md', '*.json'],
  },
  /* ───────── all JS/TS files ───────── */
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginA11y,
    },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: { react: { version: 'detect' } },

    rules: {
      /* accessibility as warnings */
      ...a11yWarnRules,
      /* react-hooks rules */
      ...hooksRules,

      /* never-break-the-build overrides */
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-irregular-whitespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  /* TypeScript rules */
  tseslint.configs.recommended,

  /* React flat preset (after TS to avoid overlap) */
  pluginReact.configs.flat.recommended,

  /* project overrides */
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-irregular-whitespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  /* Import guard for big documents pages */
  {
    files: ['src/app/**/documents/**/page.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
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
      ],
    },
  },
]);
