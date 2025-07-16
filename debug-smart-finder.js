#!/usr/bin/env node

// Debug script to test Smart Document Finder data flow
console.log('🔍 Testing Smart Document Finder data flow...\n');

// Let me check a few specific documents to see their structure
const fs = require('fs');
const path = require('path');

function readDocumentMetadata(docPath) {
  try {
    const content = fs.readFileSync(docPath, 'utf8');
    console.log(`\n📄 Reading ${docPath}:`);
    console.log('---START---');
    console.log(content);
    console.log('---END---\n');
  } catch (error) {
    console.error(`❌ Error reading ${docPath}:`, error.message);
  }
}

// Check a few document metadata files
const docsToCheck = [
  'src/lib/documents/us/vehicle-bill-of-sale/metadata.ts',
  'src/lib/documents/us/employment-contract/metadata.ts',
  'src/lib/documents/us/non-disclosure-agreement/metadata.ts'
];

docsToCheck.forEach(readDocumentMetadata);

console.log('\n🔍 Now let\'s check the document library processing...');

// Check how documents are processed in the library
try {
  console.log('\n📚 Checking document library structure...');
  
  // Read the document library file
  const libraryPath = 'src/lib/document-library.ts';
  const libraryContent = fs.readFileSync(libraryPath, 'utf8');
  
  // Look for the enrichment section
  const enrichmentStart = libraryContent.indexOf('// Enrich every document');
  const enrichmentEnd = libraryContent.indexOf('});', enrichmentStart) + 3;
  
  if (enrichmentStart !== -1) {
    console.log('\n🔧 Document enrichment logic:');
    console.log('---START---');
    console.log(libraryContent.substring(enrichmentStart, enrichmentEnd));
    console.log('---END---');
  }
  
} catch (error) {
  console.error('❌ Error checking document library:', error.message);
}