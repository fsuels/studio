module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'common',
  defaultValue: '',
  indentation: 2,
  keepRemoved: false,
  keySeparator: '.',
  ns: ['common', 'home', 'translation'],
  output: {
    $namespace: 'public/locales/$locale/$namespace.json',
  },
  input: ['src/**/*.{ts,tsx}'],
  sort: true,
  verbose: true,
};
