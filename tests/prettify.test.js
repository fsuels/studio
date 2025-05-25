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

// -------- BillOfSaleSchema Tests --------
import { z } from 'zod';
function isValidVIN(vin) {
  if (typeof vin !== 'string') return false;
  const vinUpper = vin.trim().toUpperCase();
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vinUpper);
}

const schemaPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src', 'schemas', 'billOfSale.ts');
const schemaTs = fs.readFileSync(schemaPath, 'utf8');
const schemaJs = schemaTs
  .replace(/import[^;]+;\n/g, '')
  .replace('export const BillOfSaleSchema', 'const BillOfSaleSchema')
  .replace(/export type [^;]+;/g, '');
// eslint-disable-next-line no-new-func
const loadSchema = new Function('z', 'isValidVIN', `${schemaJs}; return BillOfSaleSchema;`);
const BillOfSaleSchema = loadSchema(z, isValidVIN);

test('BillOfSaleSchema accepts 1 seller and 1 buyer', () => {
  const result = BillOfSaleSchema.safeParse({
    sellers: [{ name: 'Alice', address: '123 Main', phone: '(123) 456-7890' }],
    buyers: [{ name: 'Bob', address: '456 Oak', phone: '' }],
    vin: '1HGCM82633A004352',
    year: 2020,
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    sale_date: new Date(),
    price: 5000,
    odometer: 1000,
    odo_status: 'ACTUAL',
    state: 'CA'
  });
  assert.strictEqual(result.success, true);
});

test('BillOfSaleSchema accepts multiple sellers and buyers', () => {
  const result = BillOfSaleSchema.safeParse({
    sellers: [
      { name: 'Alice', address: '123 Main', phone: '' },
      { name: 'Carol', address: '789 Pine', phone: '(111) 222-3333' }
    ],
    buyers: [
      { name: 'Bob', address: '456 Oak', phone: '' },
      { name: 'Dave', address: '321 Cedar', phone: '(222) 333-4444' }
    ],
    vin: '1HGCM82633A004352',
    year: 2021,
    make: 'Ford',
    model: 'F150',
    color: 'Red',
    sale_date: new Date(),
    price: 10000,
    odometer: 2000,
    odo_status: 'ACTUAL',
    state: 'TX'
  });
  assert.strictEqual(result.success, true);
});

test('BillOfSaleSchema fails with no sellers', () => {
  const result = BillOfSaleSchema.safeParse({
    sellers: [],
    buyers: [{ name: 'Bob', address: '456 Oak', phone: '' }],
    vin: '1HGCM82633A004352',
    year: 2020,
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    sale_date: new Date(),
    price: 5000,
    odometer: 1000,
    odo_status: 'ACTUAL',
    state: 'CA'
  });
  assert.strictEqual(result.success, false);
});

test('BillOfSaleSchema fails with invalid phone format', () => {
  const result = BillOfSaleSchema.safeParse({
    sellers: [{ name: 'Alice', address: '123 Main', phone: '123-456-7890' }],
    buyers: [{ name: 'Bob', address: '456 Oak', phone: '' }],
    vin: '1HGCM82633A004352',
    year: 2020,
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    sale_date: new Date(),
    price: 5000,
    odometer: 1000,
    odo_status: 'ACTUAL',
    state: 'CA'
  });
  assert.strictEqual(result.success, false);
});
