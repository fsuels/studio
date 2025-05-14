// Tell jscodeshift to use its built-in TSX parser
module.exports.parser = 'tsx';

const mappings = [
  { test: /src\/components\/layout\/Footer\.tsx$/, ns: 'footer' },
  { test: /src\/components\/layout\/Header\.tsx$/, ns: 'header' },
  { test: /src\/components\/layout\/Logo\.tsx$/, ns: 'common' },
  { test: /src\/components\/Nav\.tsx$/, ns: 'header' },
  { test: /src\/components\/SearchBar\.tsx$/, ns: 'header' },
  { test: /src\/components\/TopDocsChips\.tsx$/, ns: 'common' },
  { test: /src\/components\/AuthModal\.tsx$/, ns: 'common' },
  { test: /src\/components\/SupportContent\.tsx$/, ns: 'support' },
  { test: /src\/components\/LanguageSwitcher\.tsx$/, ns: 'common' },
  // …add more mappings as needed…
];

module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const mapping = mappings.find(m => m.test.test(fileInfo.path));
  if (!mapping) return null;

  root
    .find(j.CallExpression, {
      callee: { name: 'useTranslation' },
      arguments: args => args.length === 0
    })
    .forEach(path => {
      path.node.arguments = [j.literal(mapping.ns)];
    });

  return root.toSource({ quote: 'single' });
};