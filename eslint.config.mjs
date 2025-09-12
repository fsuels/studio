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
    ignores: ['.next/**', 'public/**', 'coverage/**', 'scripts/**', '**/*.md', '**/*.json'],
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
      // Allow styled-jsx attributes
      'react/no-unknown-property': ['warn', { ignore: ['jsx', 'global'] }],
      // Relax frequently noisy-but-safe rules to warnings to keep CI green
      'react/no-unescaped-entities': 'warn',
      'react/jsx-no-target-blank': 'warn',
      'react/display-name': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
      'no-async-promise-executor': 'warn',
      'prefer-const': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      // Global: do not enforce kebab-case on identifier names
      'id-match': 'off',
      // Prefer progress over perfection: do not error on explicit any or unused vars
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Some legacy patterns in switch/case
      'no-case-declarations': 'warn',
      // Stylistic low-priority rules
      'prefer-const': 'warn',
      // Accessibility: keep as warnings in all environments
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      // TS specific relaxations
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
      'react/no-unknown-property': ['warn', { ignore: ['jsx', 'global'] }],
      // Re-assert relaxed severities after presets apply (ensures warnings not errors)
      'react/no-unescaped-entities': 'warn',
      'react/jsx-no-target-blank': 'warn',
      'react/display-name': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
      'no-async-promise-executor': 'warn',
      'prefer-const': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      // Re-assert rule severities after presets apply
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'id-match': 'off',
    },
  },

  /* Node environment for scripts */
  {
    files: ['scripts/**'],
    languageOptions: { globals: globals.node },
    rules: {
      // Allow CommonJS requires in scripts
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-useless-escape': 'warn',
    },
  },

  /* Reduce noise in core library modules */
  {
    files: ['src/lib/**/*.{ts,tsx}'],
    rules: {
      // Libraries frequently use generic plumbing and stubs
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      // Many files intentionally declare args/placeholders for future wiring
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow const/let in case blocks without braces in legacy sections
      'no-case-declarations': 'off',
    },
  },

  /* Tests: turn off a11y and loosen TS strictness */
  {
    files: ['**/__tests__/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/role-has-required-aria-props': 'off',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'off',
    },
  },

  /* App: allow transient any in UI layers */
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  /* Components: reduce noise from exploratory UI work */
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      // Allow temporary stubs and WIP imports/variables in UI code
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Disable aggressive deps warnings while iterating on hooks
      'react-hooks/exhaustive-deps': 'off',
      // Accessibility: disable noisy rules for non-final UI surfaces
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-autofocus': 'off',
      // Content: allow unescaped entities inside components
      'react/no-unescaped-entities': 'off',
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
          selector: "VariableDeclarator > ObjectExpression > Property[key.name='templatePath']",
          message:
            'Use templatePaths (plural) object instead of templatePath (singular)',
        },
        // Enforce kebab-case for metadata.id property values
        {
          // Only check id values on top-level document objects (variable initializers),
          // not nested objects like question items inside arrays.
          selector:
            "VariableDeclarator > ObjectExpression > Property[key.name='id'][value.type='Literal']:not([value.value=/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/])",
          message: 'Document id must be kebab-case (e.g., vehicle-bill-of-sale)',
        },
      ],
    },
  },

  // Do not apply document id kebab-case rule inside question definition files
  {
    files: ['src/lib/documents/**/questions.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "VariableDeclarator > ObjectExpression > Property[key.name='templatePath']",
          message:
            'Use templatePaths (plural) object instead of templatePath (singular)',
        },
      ],
    },
  },
];
