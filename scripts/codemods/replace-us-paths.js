// scripts/codemods/replace-us-paths.js
// jscodeshift transform to update deprecated usStates import paths.
//
// Replaces imports of `usStates` from '@/lib/usStates' (or relative
// paths like './usStates' or '../usStates') with the consolidated
// utilities module `@/lib/document-library/utils`.
//
// Usage:
//   npx jscodeshift -t scripts/codemods/replace-us-paths.js <paths>
//
// The script also updates re-export statements using the same paths.

const path = require('path');

module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const fileDir = path.dirname(fileInfo.path);

  const absUtils = path.resolve('src/lib/document-library/utils.ts');

  function computeRelative() {
    let rel = path.relative(fileDir, absUtils).replace(/\\/g, '/');
    rel = rel.replace(/\.ts$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel;
  }

  function transform(sourceValue) {
    if (typeof sourceValue !== 'string') return null;
    if (sourceValue === '@/lib/usStates') {
      return '@/lib/document-library/utils';
    }
    if (sourceValue.endsWith('/usStates') || sourceValue === 'usStates') {
      if (sourceValue.startsWith('@/')) {
        return '@/lib/document-library/utils';
      }
      return computeRelative();
    }
    return null;
  }

  root.find(j.ImportDeclaration)
    .forEach(p => {
      const newVal = transform(p.node.source.value);
      if (newVal) p.node.source = j.literal(newVal);
    });

  root.find(j.ExportNamedDeclaration)
    .filter(p => p.node.source)
    .forEach(p => {
      const newVal = transform(p.node.source.value);
      if (newVal) p.node.source = j.literal(newVal);
    });

  return root.toSource({ quote: 'single' });
};
