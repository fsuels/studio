#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('📚 Validating document library...');

const docsDir = 'src/lib/documents/us';
let validated = 0;
let errors = 0;

if (fs.existsSync(docsDir)) {
  const docs = fs.readdirSync(docsDir);

  docs.forEach((doc) => {
    const docPath = path.join(docsDir, doc);
    if (fs.statSync(docPath).isDirectory()) {
      const requiredFiles = [
        'index.ts',
        'schema.ts',
        'questions.ts',
        'metadata.ts',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(docPath, file);
        if (fs.existsSync(filePath)) {
          validated++;
        } else {
          console.log(`❌ Missing ${file} in ${doc}`);
          errors++;
        }
      });
    }
  });
}

console.log(
  `✅ Document validation complete: ${validated} files validated, ${errors} errors`,
);
process.exit(errors > 0 ? 1 : 0);
