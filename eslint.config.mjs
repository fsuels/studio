/* eslint.config.mjs — Flat config for ESLint 9
   Core: @eslint/js, @typescript-eslint, react, react-hooks, jsx-a11y          */

   import js from '@eslint/js';
   import globals from 'globals';
   import tseslint from 'typescript-eslint';
   import pluginReact from 'eslint-plugin-react';
   import pluginReactHooks from 'eslint-plugin-react-hooks';
   import pluginA11y from 'eslint-plugin-jsx-a11y';
   import { defineConfig } from 'eslint/config';
   
   /* pull a11y recommended rules without eslintrc metadata */
   const a11yRules = pluginA11y.configs.recommended.rules;
   /* pull react-hooks recommended rules */
   const hooksRules = pluginReactHooks.configs.recommended.rules;
   
   export default defineConfig([
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
       rules: {
         ...a11yRules,
         ...hooksRules,
         /* Modern JSX runtime (React 17+) */
         'react/react-in-jsx-scope': 'off',
       },
       languageOptions: { globals: globals.browser },
       settings: { react: { version: 'detect' } },
     },
   
     /* TypeScript rules */
     tseslint.configs.recommended,
   
     /* React rules (flat preset) */
     pluginReact.configs.flat.recommended,
   
     /* Import guard for documents pages */
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
                   "Wrap this import with lazyClient(): " +
                   "import { lazyClient } from '@/lib/lazy-client'; " +
                   "const Foo = lazyClient(() => import('./Foo'));",
               },
             ],
           },
         ],
       },
     },
   ]);
   