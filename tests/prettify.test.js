import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const tsPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src', 'lib', 'schema-utils.ts');
const tsCode = fs.readFileSync(tsPath, 'utf8');

// naive transform: strip TypeScript type annotations and convert export to function
const jsCode = tsCode
  .replace(/export const prettify\s*=\s*\(key: string\): string =>/, 'function prettify(key)')
  .replace(/: string/g, '');

// eslint-disable-next-line no-new-func
const load = new Function(`${jsCode}; return prettify;`);
const prettify = load();

test('prettify converts snake_case to title case', () => {
  assert.strictEqual(prettify('buyer_name'), 'Buyer Name');
});

test('prettify converts camelCase to title case', () => {
  assert.strictEqual(prettify('vehicleVin'), 'Vehicle Vin');
});
