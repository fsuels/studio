// fix-specific-strings.js
const fs = require('fs');
const path = require('path');

const files = [
  'src/lib/documents/invoice.ts',
  'src/lib/documents/vehicle-bill-of-sale.ts'
];

files.forEach(rel => {
  const fullPath = path.resolve(rel);
  let src = fs.readFileSync(fullPath, 'utf8');

  if (rel.endsWith('invoice.ts')) {
    // Replace the exact multi-line placeholder with a proper backtick template literal
    src = src.replace(
      'placeholder: "Item 1 - $100\\nService B - $250"',
      'placeholder: `Item 1 - $100\\\\nService B - $250`'
    );
  }

  if (rel.endsWith('vehicle-bill-of-sale.ts')) {
    // Escape the inner "None"
    src = src.replace(
      'label: "Existing Liens (if any, otherwise leave blank or \\"None\\")"',
      'label: "Existing Liens (if any, otherwise leave blank or \\"None\\")"'
    );
    // Escape the inner "as-is"
    src = src.replace(
      'label: "Is the vehicle sold \\"as-is\\"?"',
      'label: "Is the vehicle sold \\"as-is\\"?"'
    );
  }

  fs.writeFileSync(fullPath, src, 'utf8');
  console.log(`Patched ${rel}`);
});
