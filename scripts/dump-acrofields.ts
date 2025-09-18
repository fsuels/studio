// Usage: npx tsx scripts/dump-acrofields.ts public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf
import { readFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Please provide a PDF file path.');
    process.exit(1);
  }
  const bytes = readFileSync(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  const fields = form.getFields();
  console.log(`Found ${fields.length} fields in ${file}`);
  for (const f of fields) {
    const type = (f as any).constructor.name;
    const name = f.getName();
    console.log(`- ${name} (${type})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

