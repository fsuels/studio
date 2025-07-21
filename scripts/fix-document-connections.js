#!/usr/bin/env node

/**
 * Fix document naming mismatches and create comprehensive US index
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Document Connections...\n');

// Get list of actual document directories
const usDocsDir = path.join(__dirname, '../src/lib/documents/us');
const documentDirs = fs
  .readdirSync(usDocsDir)
  .filter((item) => {
    const itemPath = path.join(usDocsDir, item);
    return fs.statSync(itemPath).isDirectory();
  })
  .sort();

console.log(`Found ${documentDirs.length} document directories:`);
documentDirs.forEach((dir, index) => {
  console.log(`   ${index + 1}. ${dir}`);
});

// Function to convert kebab-case to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Generate the new US index file
const newIndexContent = `// src/lib/documents/us/index.ts
// Auto-generated US documents index - connects all document folders

${documentDirs
  .map((dir) => {
    const camelCase = toCamelCase(dir);
    return `export { ${camelCase} } from './${dir}';`;
  })
  .join('\n')}

// Export count for verification
export const US_DOCUMENT_COUNT = ${documentDirs.length};
`;

// Write the new index file
const indexPath = path.join(usDocsDir, 'index.ts');
fs.writeFileSync(indexPath, newIndexContent);

console.log(`\n✅ Updated US index with ${documentDirs.length} exports`);

// Now check which documents need index.ts files created
console.log('\n🔍 Checking document structure...');

documentDirs.forEach((dir) => {
  const docPath = path.join(usDocsDir, dir);
  const hasIndex = fs.existsSync(path.join(docPath, 'index.ts'));
  const hasMetadata = fs.existsSync(path.join(docPath, 'metadata.ts'));
  const hasSchema = fs.existsSync(path.join(docPath, 'schema.ts'));
  const hasQuestions = fs.existsSync(path.join(docPath, 'questions.ts'));

  const missing = [];
  if (!hasIndex) missing.push('index.ts');
  if (!hasMetadata) missing.push('metadata.ts');
  if (!hasSchema) missing.push('schema.ts');
  if (!hasQuestions) missing.push('questions.ts');

  if (missing.length > 0) {
    console.log(`   ⚠️  ${dir}: Missing ${missing.join(', ')}`);
  } else {
    console.log(`   ✅ ${dir}: Complete`);
  }
});

console.log('\n📄 Checking templates...');

// Check templates
const templatesDir = path.join(__dirname, '../public/templates');
const enTemplatesDir = path.join(templatesDir, 'en');
const esTemplatesDir = path.join(templatesDir, 'es');

let missingTemplates = [];

documentDirs.forEach((dir) => {
  const enTemplate = path.join(enTemplatesDir, `${dir}.md`);
  const esTemplate = path.join(esTemplatesDir, `${dir}.md`);

  const hasEn = fs.existsSync(enTemplate);
  const hasEs = fs.existsSync(esTemplate);

  if (!hasEn || !hasEs) {
    missingTemplates.push({
      dir,
      missingEn: !hasEn,
      missingEs: !hasEs,
    });
  }
});

if (missingTemplates.length > 0) {
  console.log('Missing templates:');
  missingTemplates.forEach((item) => {
    const missing = [];
    if (item.missingEn) missing.push('EN');
    if (item.missingEs) missing.push('ES');
    console.log(`   ⚠️  ${item.dir}: Missing ${missing.join(', ')}`);
  });
} else {
  console.log('✅ All documents have English and Spanish templates');
}

console.log('\n🎯 Summary:');
console.log(`   📁 Document directories: ${documentDirs.length}`);
console.log(`   📤 Exports created: ${documentDirs.length}`);
console.log(`   📄 Missing templates: ${missingTemplates.length}`);

console.log(
  '\n✨ Document connections fixed! All documents should now be available.',
);
console.log(
  'Next: Run the app to verify all documents appear in menus and search.',
);
