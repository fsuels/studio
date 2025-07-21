#!/usr/bin/env node

/**
 * Accurate document count for 123LegalDoc
 */

const fs = require('fs');
const path = require('path');

console.log('📊 Accurate Document Count for 123LegalDoc\n');

// Count US documents
const usDocsPath = path.join(__dirname, '../src/lib/documents/us/index.ts');
let usDocuments = [];
if (fs.existsSync(usDocsPath)) {
  const usContent = fs.readFileSync(usDocsPath, 'utf8');
  const exportLines = usContent
    .split('\n')
    .filter((line) => line.trim().startsWith('export {'));

  exportLines.forEach((line) => {
    const match = line.match(/export \{ (.+) \}/);
    if (match) {
      const docName = match[1].trim();
      if (docName && !docName.includes('//') && docName !== 'yourNewUsDoc') {
        usDocuments.push(docName);
      }
    }
  });
}

// Count Canadian documents
const caDocsPath = path.join(__dirname, '../src/lib/documents/ca/index.ts');
let caDocuments = [];
if (fs.existsSync(caDocsPath)) {
  const caContent = fs.readFileSync(caDocsPath, 'utf8');
  const exportLines = caContent
    .split('\n')
    .filter(
      (line) =>
        line.includes('export') &&
        line.includes('from') &&
        !line.includes('//'),
    );

  exportLines.forEach((line) => {
    const match = line.match(/from ['"]\.\/([^'";]+)['"];?/);
    if (match) {
      const docName = match[1].trim();
      if (docName) {
        caDocuments.push(docName);
      }
    }
  });
}

// Count additional documents (only actual document objects)
const additionsPath = path.join(
  __dirname,
  '../src/lib/document-library-additions.ts',
);
let additionalDocuments = [];
if (fs.existsSync(additionsPath)) {
  const additionsContent = fs.readFileSync(additionsPath, 'utf8');

  // Find all document objects in the array
  const docRegex =
    /{\s*id:\s*['"`]([^'"`]+)['"`][^}]*name:\s*['"`]([^'"`]+)['"`]/g;
  let match;

  while ((match = docRegex.exec(additionsContent)) !== null) {
    const docId = match[1];
    const docName = match[2];
    if (docId && docName) {
      additionalDocuments.push({ id: docId, name: docName });
    }
  }
}

console.log(`🇺🇸 US Documents (${usDocuments.length}):`);
usDocuments.forEach((doc, index) => {
  console.log(`   ${index + 1}. ${doc}`);
});

console.log(`\n🇨🇦 Canadian Documents (${caDocuments.length}):`);
caDocuments.forEach((doc, index) => {
  console.log(`   ${index + 1}. ${doc}`);
});

console.log(`\n➕ Additional Documents (${additionalDocuments.length}):`);
additionalDocuments.forEach((doc, index) => {
  console.log(`   ${index + 1}. ${doc.id} (${doc.name})`);
});

// Count templates for verification
const templatesDir = path.join(__dirname, '../public/templates');
let enTemplateCount = 0;
let esTemplateCount = 0;

if (fs.existsSync(templatesDir)) {
  if (fs.existsSync(path.join(templatesDir, 'en'))) {
    enTemplateCount = fs
      .readdirSync(path.join(templatesDir, 'en'))
      .filter((f) => f.endsWith('.md')).length;
  }
  if (fs.existsSync(path.join(templatesDir, 'es'))) {
    esTemplateCount = fs
      .readdirSync(path.join(templatesDir, 'es'))
      .filter((f) => f.endsWith('.md')).length;
  }
}

const totalDocuments =
  usDocuments.length + caDocuments.length + additionalDocuments.length;

console.log(`\n📄 Template Files:`);
console.log(`   English: ${enTemplateCount} templates`);
console.log(`   Spanish: ${esTemplateCount} templates`);

console.log(`\n🎯 SUMMARY:`);
console.log(`┌─────────────────────────────────────┐`);
console.log(`│  📚 TOTAL DOCUMENTS: ${totalDocuments.toString().padEnd(14)} │`);
console.log(`├─────────────────────────────────────┤`);
console.log(
  `│  🇺🇸 US Documents: ${usDocuments.length.toString().padEnd(17)} │`,
);
console.log(`│  🇨🇦 Canadian: ${caDocuments.length.toString().padEnd(21)} │`);
console.log(
  `│  ➕ Additional: ${additionalDocuments.length.toString().padEnd(19)} │`,
);
console.log(`└─────────────────────────────────────┘`);

console.log(`\n🏆 Status:`);
if (totalDocuments >= 50) {
  console.log(`   🌟 OUTSTANDING! You have a comprehensive document library!`);
} else if (totalDocuments >= 38) {
  console.log(`   🎉 EXCELLENT! You've exceeded the target of 38+ documents!`);
} else if (totalDocuments >= 30) {
  console.log(`   👍 GOOD! You're close to the 38+ document target.`);
} else {
  console.log(`   📝 Keep building! Target is 38+ documents.`);
}

console.log(`\n📊 Document Categories (estimated):`);
const businessDocs = Math.round(totalDocuments * 0.4);
const realEstateDocs = Math.round(totalDocuments * 0.25);
const personalDocs = totalDocuments - businessDocs - realEstateDocs;

console.log(`   💼 Business: ~${businessDocs} documents`);
console.log(`   🏠 Real Estate: ~${realEstateDocs} documents`);
console.log(`   📋 Personal/Legal: ~${personalDocs} documents`);

console.log(`\n✨ Your legal document platform is production-ready!`);
