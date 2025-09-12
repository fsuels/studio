/* eslint.config.mjs — Flat config for ESLint 9
   Core: @eslint/js, @typescript-eslint, react, react-hooks, jsx-a11y        */

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginA11y from 'eslint-plugin-jsx-a11y';

/* pull a11y recommended rules and down-grade them to “warn” */
const a11yWarnRules = {};
for (const [rule, level] of Object.entries(
  pluginA11y.configs.recommended.rules ?? {},
)) {
  a11yWarnRules[rule] = level === 'error' ? 'warn' : level;
}

/* react-hooks recommended */
const hooksRules = pluginReactHooks.configs.recommended.rules ?? {};

export default [
  {
    ignores: ['.next/**', 'public/**', 'coverage/**', '**/*.md', '**/*.json'],
  },

  js.configs.recommended,

  /* ───────── all JS/TS files ───────── */
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginA11y,
    },
    languageOptions: { globals: globals.browser },
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
    },
  },

  /* TypeScript rules */
  ...tseslint.configs.recommended,

  /* React flat preset (after TS to avoid overlap) */
  pluginReact.configs.flat.recommended,

  /* Override React rules from the preset */
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  /* Node environment for scripts */
  {
    files: ['scripts/**'],
    languageOptions: { globals: globals.node },
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

  /* Custom rules for document schema consistency */
  {
    files: ['src/lib/documents/**/*.ts'],
    rules: {
      // id-match at identifier-level is too strict for TS (types, consts, etc.).
      // Disable here and enforce kebab-case only for metadata.id values below.
      'id-match': 'off',
      // Require templatePaths object
      'no-restricted-syntax': [
        'error',
        {
          selector: "Property[key.name='templatePath']",
          message:
            'Use templatePaths (plural) object instead of templatePath (singular)',
        },
        // Enforce kebab-case for metadata.id property values
        {
          selector:
            "Property[key.name='id'][value.type='Literal']:not([value.value=/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/])",
          message: 'Document id must be kebab-case (e.g., vehicle-bill-of-sale)',
        },
      ],
    },
  },
];
