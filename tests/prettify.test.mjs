import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const tsPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
  'src',
  'lib',
  'schema-utils.ts',
);
const tsCode = fs.readFileSync(tsPath, 'utf8');

// naive transform: strip TypeScript type annotations and convert export to function
const jsCode = tsCode
  .replace(
    /export const prettify\s*=\s*\(key: string\): string =>/,
    'function prettify(key)',
  )
  .replace(/: string/g, '');

// eslint-disable-next-line no-new-func
const load = new Function(`${jsCode}; return prettify;`);
const prettify = load();

test('prettify converts snake_case to title case', () => {
 expect(prettify('buyer_name')).toBe('Buyer Name');
});

test('prettify converts camelCase to title case', () => {
 expect(prettify('vehicleVin')).toBe('Vehicle Vin');
});
