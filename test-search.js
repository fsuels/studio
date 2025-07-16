// Quick test script to verify search functionality
const { findMatchingDocuments } = require('./src/lib/document-library.ts');

console.log('Testing Smart Document Finder search...');

const testQueries = [
  'car',
  'vehicle', 
  'buy',
  'employment',
  'lease',
  'contract',
  'nda',
  'business'
];

testQueries.forEach(query => {
  try {
    const results = findMatchingDocuments(query, 'en');
    console.log(`\n"${query}" -> ${results.length} results`);
    
    if (results.length > 0) {
      results.slice(0, 3).forEach((doc, i) => {
        const name = doc.translations?.en?.name || doc.name || doc.id;
        console.log(`  ${i + 1}. ${name}`);
      });
    }
  } catch (error) {
    console.error(`Error searching for "${query}":`, error.message);
  }
});

console.log('\n✅ Search test completed!');