#!/usr/bin/env node

/**
 * Final verification that all documents are properly connected and working
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Final Document System Verification\n');

// Check document directories
const usDocsDir = path.join(__dirname, '../src/lib/documents/us');
const documentDirs = fs
  .readdirSync(usDocsDir)
  .filter((item) => {
    const itemPath = path.join(usDocsDir, item);
    return fs.statSync(itemPath).isDirectory();
  })
  .sort();

// Check exports
const usIndexPath = path.join(usDocsDir, 'index.ts');
const indexContent = fs.readFileSync(usIndexPath, 'utf8');
const exportLines = indexContent
  .split('\n')
  .filter((line) => line.trim().startsWith('export {') && !line.includes('//'));

// Check templates
const templatesDir = path.join(__dirname, '../public/templates');
const enTemplates = fs
  .readdirSync(path.join(templatesDir, 'en'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace('.md', ''));
const esTemplates = fs
  .readdirSync(path.join(templatesDir, 'es'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace('.md', ''));

console.log('📊 SYSTEM OVERVIEW:');
console.log('┌─────────────────────────────────────┐');
console.log(
  `│  📁 Document Directories: ${documentDirs.length.toString().padEnd(9)} │`,
);
console.log(
  `│  📤 Exported Documents: ${exportLines.length.toString().padEnd(11)} │`,
);
console.log(
  `│  🇺🇸 English Templates: ${enTemplates.length.toString().padEnd(11)} │`,
);
console.log(
  `│  🇪🇸 Spanish Templates: ${esTemplates.length.toString().padEnd(11)} │`,
);
console.log('└─────────────────────────────────────┘');

console.log('\n✅ VERIFICATION RESULTS:\n');

// 1. Check that all directories have exports
let allExported = true;
let exportedDocs = [];
exportLines.forEach((line) => {
  const match = line.match(/export \{ (.+) \} from ['"]\.\/(.+)['"];?/);
  if (match) {
    exportedDocs.push({ name: match[1], dir: match[2] });
  }
});

console.log('1️⃣  EXPORT VERIFICATION:');
documentDirs.forEach((dir) => {
  const hasExport = exportedDocs.some((exp) => exp.dir === dir);
  if (hasExport) {
    console.log(`   ✅ ${dir}: Properly exported`);
  } else {
    console.log(`   ❌ ${dir}: Missing export`);
    allExported = false;
  }
});

// 2. Check that all documents have complete structure
console.log('\n2️⃣  STRUCTURE VERIFICATION:');
let allComplete = true;
documentDirs.forEach((dir) => {
  const docPath = path.join(usDocsDir, dir);
  const hasIndex = fs.existsSync(path.join(docPath, 'index.ts'));
  const hasMetadata = fs.existsSync(path.join(docPath, 'metadata.ts'));
  const hasSchema = fs.existsSync(path.join(docPath, 'schema.ts'));
  const hasQuestions = fs.existsSync(path.join(docPath, 'questions.ts'));

  if (hasIndex && hasMetadata && hasSchema && hasQuestions) {
    console.log(`   ✅ ${dir}: Complete structure`);
  } else {
    const missing = [];
    if (!hasIndex) missing.push('index.ts');
    if (!hasMetadata) missing.push('metadata.ts');
    if (!hasSchema) missing.push('schema.ts');
    if (!hasQuestions) missing.push('questions.ts');
    console.log(`   ⚠️  ${dir}: Missing ${missing.join(', ')}`);
    allComplete = false;
  }
});

// 3. Check that all documents have templates
console.log('\n3️⃣  TEMPLATE VERIFICATION:');
let allTemplated = true;
documentDirs.forEach((dir) => {
  const hasEn = enTemplates.includes(dir);
  const hasEs = esTemplates.includes(dir);

  if (hasEn && hasEs) {
    console.log(`   ✅ ${dir}: EN + ES templates`);
  } else {
    const missing = [];
    if (!hasEn) missing.push('EN');
    if (!hasEs) missing.push('ES');
    console.log(`   ⚠️  ${dir}: Missing ${missing.join(', ')} template(s)`);
    allTemplated = false;
  }
});

// 4. Check for aliases in metadata
console.log('\n4️⃣  ALIAS VERIFICATION:');
let aliasCount = 0;
documentDirs.forEach((dir) => {
  const metadataPath = path.join(usDocsDir, dir, 'metadata.ts');
  if (fs.existsSync(metadataPath)) {
    const content = fs.readFileSync(metadataPath, 'utf8');
    if (content.includes('aliases:')) {
      aliasCount++;
      console.log(`   ✅ ${dir}: Has search aliases`);
    } else {
      console.log(`   ⚠️  ${dir}: No aliases found`);
    }
  }
});

// 5. Check mega menu component
console.log('\n5️⃣  MEGA MENU VERIFICATION:');
const megaMenuPath = path.join(
  __dirname,
  '../src/components/mega-menu/MegaMenuContent.tsx',
);
const hasMegaMenu = fs.existsSync(megaMenuPath);
console.log(
  `   ${hasMegaMenu ? '✅' : '❌'} Mega menu component: ${hasMegaMenu ? 'Exists' : 'Missing'}`,
);

if (hasMegaMenu) {
  const megaMenuContent = fs.readFileSync(megaMenuPath, 'utf8');
  const usesWorkflowDocuments = megaMenuContent.includes('getWorkflowDocuments');
  console.log(
    `   ${usesWorkflowDocuments ? '✅' : '⚠️'} Uses manifest helpers: ${usesWorkflowDocuments ? 'Yes' : 'No'}`,
  );
}

console.log('\n🎯 FINAL SUMMARY:');
console.log('┌─────────────────────────────────────┐');
console.log(
  `│  📁 Total Documents: ${documentDirs.length.toString().padEnd(15)} │`,
);
console.log(
  `│  📤 Properly Exported: ${allExported ? '✅' : '❌'} ${allExported ? 'All' : 'Some missing'}       │`,
);
console.log(
  `│  🏗️  Complete Structure: ${allComplete ? '✅' : '⚠️'} ${allComplete ? 'All' : 'Some incomplete'}     │`,
);
console.log(
  `│  📄 Full Templates: ${allTemplated ? '✅' : '⚠️'} ${allTemplated ? 'All' : 'Some missing'}         │`,
);
console.log(
  `│  🏷️  With Aliases: ${aliasCount}/${documentDirs.length}${' '.repeat(15 - (aliasCount + '/' + documentDirs.length).length)}│`,
);
console.log(
  `│  🎛️  Mega Menu: ${hasMegaMenu ? '✅' : '❌'} ${hasMegaMenu ? 'Ready' : 'Missing'}               │`,
);
console.log('└─────────────────────────────────────┘');

const allGood =
  allExported &&
  allComplete &&
  allTemplated &&
  hasMegaMenu &&
  aliasCount >= documentDirs.length * 0.8;

if (allGood) {
  console.log('\n🎉 EXCELLENT! Your document system is fully operational!');
  console.log('\n📋 What you have accomplished:');
  console.log(`   ✅ ${documentDirs.length} complete legal documents`);
  console.log(`   ✅ ${enTemplates.length} English templates`);
  console.log(`   ✅ ${esTemplates.length} Spanish templates`);
  console.log(`   ✅ Comprehensive search aliases`);
  console.log(`   ✅ Mega menu integration`);
  console.log(`   ✅ Bilingual support (EN/ES)`);
  console.log('\n🚀 Your legal document platform is ready for production!');
} else {
  console.log('\n⚠️  Some issues need attention:');
  if (!allExported) console.log('   • Fix document exports');
  if (!allComplete) console.log('   • Complete document structures');
  if (!allTemplated) console.log('   • Add missing templates');
  if (!hasMegaMenu) console.log('   • Create mega menu component');
  if (aliasCount < documentDirs.length * 0.8)
    console.log('   • Add more search aliases');

  console.log('\n✨ Once these are resolved, your system will be complete!');
}

console.log('\n📚 Document Categories Available:');
const categories = {};
documentDirs.forEach((dir) => {
  const metadataPath = path.join(usDocsDir, dir, 'metadata.ts');
  if (fs.existsSync(metadataPath)) {
    const content = fs.readFileSync(metadataPath, 'utf8');
    const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      if (!categories[category]) categories[category] = 0;
      categories[category]++;
    }
  }
});

Object.keys(categories)
  .sort()
  .forEach((category) => {
    console.log(`   📂 ${category}: ${categories[category]} documents`);
  });

console.log(
  `\n🎯 You now have ${documentDirs.length} professional legal documents ready!`,
);
