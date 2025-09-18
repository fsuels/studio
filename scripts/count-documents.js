#!/usr/bin/env node

/**
 * Script to count documents using the generated manifest metadata.
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

console.log('📊 Counting Documents via manifest.generated.ts\n');

const manifestPath = path.join(
  __dirname,
  '../src/lib/documents/manifest.generated.ts',
);

if (!fs.existsSync(manifestPath)) {
  console.error(
    '❌ manifest.generated.ts not found. Run `node scripts/generate-document-manifest.mjs` first.',
  );
  process.exit(1);
}

const manifestSource = fs.readFileSync(manifestPath, 'utf8');
const transpiled = ts.transpileModule(manifestSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2019,
  },
});

const moduleWrapper = { exports: {} };
new Function(
  'exports',
  'require',
  'module',
  '__filename',
  '__dirname',
  transpiled.outputText,
)(moduleWrapper.exports, require, moduleWrapper, manifestPath, path.dirname(manifestPath));

const {
  DOCUMENT_MANIFEST = [],
  DOCUMENT_METADATA = {},
} = moduleWrapper.exports;

const manifestEntries = DOCUMENT_MANIFEST.length;
const metadataCount = Object.keys(DOCUMENT_METADATA).length;

console.log(`📁 Manifest entries: ${manifestEntries}`);
console.log(`🧾 Metadata records: ${metadataCount}`);

const docsByJurisdiction = DOCUMENT_MANIFEST.reduce((acc, entry) => {
  const jurisdiction = (entry.meta.jurisdiction || 'unknown').toLowerCase();
  acc[jurisdiction] = (acc[jurisdiction] || 0) + 1;
  return acc;
}, {});

console.log('\n🌎 Documents per jurisdiction:');
Object.entries(docsByJurisdiction)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([jurisdiction, count]) => {
    console.log(`   ${jurisdiction.toUpperCase()}: ${count}`);
  });

const docsByCategory = DOCUMENT_MANIFEST.reduce((acc, entry) => {
  const category = entry.meta.category || 'Uncategorized';
  acc[category] = (acc[category] || 0) + 1;
  return acc;
}, {});

console.log('\n🏷️  Top categories:');
Object.entries(docsByCategory)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10)
  .forEach(([category, count], index) => {
    console.log(`   ${index + 1}. ${category} — ${count}`);
  });

const templatesDir = path.join(__dirname, '../public/templates');
if (fs.existsSync(templatesDir)) {
  const enTemplates = fs.existsSync(path.join(templatesDir, 'en'))
    ? fs
        .readdirSync(path.join(templatesDir, 'en'))
        .filter((f) => f.endsWith('.md')).length
    : 0;
  const esTemplates = fs.existsSync(path.join(templatesDir, 'es'))
    ? fs
        .readdirSync(path.join(templatesDir, 'es'))
        .filter((f) => f.endsWith('.md')).length
    : 0;

  console.log('\n📄 Template files available:');
  console.log(`   English templates: ${enTemplates}`);
  console.log(`   Spanish templates: ${esTemplates}`);
}

console.log(`\n🎯 TOTAL DOCUMENTS (manifest): ${manifestEntries}`);
console.log('\n✨ Manifest-driven document inventory ready!');
