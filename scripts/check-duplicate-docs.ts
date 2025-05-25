import fg from 'fast-glob';
import path from 'path';

const entries = fg.sync('src/lib/documents/*/*/index.ts');
const seen = new Set<string>();
let dup = false;
for (const p of entries) {
  const [, , country, id] = p.split(path.sep);
  const key = `${country}/${id}`;
  if (seen.has(key)) {
    console.error(`Duplicate document detected: ${key}`);
    dup = true;
  }
  seen.add(key);
}
if (dup) {
  process.exit(1);
}
