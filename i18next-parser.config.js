// i18next-parser.config.js
module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'common',
  defaultValue: function (locale, namespace, key) {
    return key;
  },
  indentation: 2,
  keepRemoved: false,
  keySeparator: '.',
  lexers: {
    tsx: ['JavascriptLexer'],
    ts: ['JavascriptLexer'],
    jsx: ['JavascriptLexer'],
    js: ['JavascriptLexer'],
    default: ['JavascriptLexer'],
  },
  lineEnding: 'auto',
  locales: ['en', 'es'],
  namespaceSeparator: ':',
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  pluralSeparator: '_',
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  verbose: true,
  failOnWarnings: false,
  customValueTemplate: null,
  resetDefaultValueLocale: null,
  i18nextOptions: null,
  yamlOptions: null,
};