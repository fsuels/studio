#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MAX_SIZE_KB = 250; // 250 KB per bundle

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.js')) {
      results.push({ path: filePath, size: stat.size });
    }
  });
  return results;
}

const targetDir = path.join('.next', 'static');
if (!fs.existsSync(targetDir)) {
  console.error('Build output not found. Run "npm run build" first.');
  process.exit(1);
}

const bundles = walk(targetDir);
let hasError = false;
for (const b of bundles) {
  const sizeKb = b.size / 1024;
  if (sizeKb > MAX_SIZE_KB) {
    console.error(`Bundle ${b.path} is ${(sizeKb).toFixed(2)} KB - exceeds ${MAX_SIZE_KB} KB`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('All bundles within size budget');
}
