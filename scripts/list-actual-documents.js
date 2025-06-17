#!/usr/bin/env node

/**
 * Lists the actual working documents in 123LegalDoc
 * This checks what documents are properly configured and available
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking ACTUAL Working Documents in 123LegalDoc\n');

// Check which US documents have complete folders/files
const usDocsDir = path.join(__dirname, '../src/lib/documents/us');
const workingUSDocs = [];

if (fs.existsSync(usDocsDir)) {
  const items = fs.readdirSync(usDocsDir);
  
  items.forEach(item => {
    const itemPath = path.join(usDocsDir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Check if it has the required files
      const hasIndex = fs.existsSync(path.join(itemPath, 'index.ts'));
      const hasMetadata = fs.existsSync(path.join(itemPath, 'metadata.ts'));
      const hasSchema = fs.existsSync(path.join(itemPath, 'schema.ts'));
      const hasQuestions = fs.existsSync(path.join(itemPath, 'questions.ts'));
      
      if (hasIndex && hasMetadata && hasSchema && hasQuestions) {
        workingUSDocs.push({
          id: item,
          complete: true,
          hasTemplate: checkTemplate(item)
        });
      } else {
        workingUSDocs.push({
          id: item,
          complete: false,
          missing: {
            index: !hasIndex,
            metadata: !hasMetadata,
            schema: !hasSchema,
            questions: !hasQuestions
          },
          hasTemplate: checkTemplate(item)
        });
      }
    } else if (item.endsWith('.ts') && item !== 'index.ts') {
      // Single file document
      const docId = item.replace('.ts', '');
      workingUSDocs.push({
        id: docId,
        complete: true,
        singleFile: true,
        hasTemplate: checkTemplate(docId)
      });
    }
  });
}

function checkTemplate(docId) {
  const enTemplate = path.join(__dirname, '../public/templates/en', `${docId}.md`);
  const esTemplate = path.join(__dirname, '../public/templates/es', `${docId}.md`);
  
  return {
    en: fs.existsSync(enTemplate),
    es: fs.existsSync(esTemplate)
  };
}

// Check what's actually exported in the US index
const usIndexPath = path.join(__dirname, '../src/lib/documents/us/index.ts');
let exportedDocs = [];
if (fs.existsSync(usIndexPath)) {
  const content = fs.readFileSync(usIndexPath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (line.trim().startsWith('export {') && !line.includes('//')) {
      const match = line.match(/export \{ (.+) \}/);
      if (match) {
        const docName = match[1].trim();
        if (docName && docName !== 'yourNewUsDoc') {
          exportedDocs.push(docName);
        }
      }
    }
  });
}

console.log('📁 Documents with Complete Structure:');
const completeDocs = workingUSDocs.filter(doc => doc.complete);
completeDocs.forEach((doc, index) => {
  const templateStatus = doc.hasTemplate.en ? (doc.hasTemplate.es ? '🌐' : '🇺🇸') : '❌';
  const fileType = doc.singleFile ? '📄' : '📁';
  console.log(`   ${index + 1}. ${fileType} ${doc.id} ${templateStatus}`);
});

console.log('\n⚠️  Documents with Missing Components:');
const incompleteDocs = workingUSDocs.filter(doc => !doc.complete);
if (incompleteDocs.length > 0) {
  incompleteDocs.forEach((doc, index) => {
    const missing = Object.keys(doc.missing).filter(key => doc.missing[key]);
    console.log(`   ${index + 1}. ${doc.id} - Missing: ${missing.join(', ')}`);
  });
} else {
  console.log('   None! All documents are properly structured.');
}

console.log('\n📤 Documents Exported in US Index:');
exportedDocs.forEach((doc, index) => {
  const hasStructure = workingUSDocs.find(d => 
    d.id === doc || 
    d.id === doc.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1) ||
    doc.toLowerCase().includes(d.id)
  );
  const status = hasStructure?.complete ? '✅' : '⚠️';
  console.log(`   ${index + 1}. ${doc} ${status}`);
});

// Check what templates exist
const templatesDir = path.join(__dirname, '../public/templates/en');
let templateFiles = [];
if (fs.existsSync(templatesDir)) {
  templateFiles = fs.readdirSync(templatesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

console.log('\n📄 Available Templates:');
templateFiles.forEach((template, index) => {
  const hasDoc = workingUSDocs.find(d => d.id === template || 
    template.includes(d.id) || 
    d.id.includes(template));
  const status = hasDoc ? '📚' : '🔍';
  console.log(`   ${index + 1}. ${template} ${status}`);
});

console.log('\n🎯 REAL DOCUMENT COUNT:');
console.log(`┌─────────────────────────────────────┐`);
console.log(`│  📚 Complete Documents: ${completeDocs.length.toString().padEnd(11)} │`);
console.log(`│  📤 Exported Documents: ${exportedDocs.length.toString().padEnd(11)} │`);
console.log(`│  📄 Template Files: ${templateFiles.length.toString().padEnd(15)} │`);
console.log(`└─────────────────────────────────────┘`);

console.log('\nLegend:');
console.log('📁 = Folder structure  📄 = Single file');
console.log('🌐 = EN+ES templates  🇺🇸 = EN template only  ❌ = No template');
console.log('✅ = Complete  ⚠️ = Missing components  📚 = Has document  🔍 = Template only');

const actualWorkingDocs = Math.min(completeDocs.length, exportedDocs.length);
console.log(`\n🎯 ACTUAL WORKING DOCUMENTS: ${actualWorkingDocs}`);

if (actualWorkingDocs < 10) {
  console.log('❗ You may need to complete more document structures.');
} else if (actualWorkingDocs >= 20) {
  console.log('🎉 Great! You have a solid document library.');
} else {
  console.log('👍 Good progress! You have a decent document collection.');
}