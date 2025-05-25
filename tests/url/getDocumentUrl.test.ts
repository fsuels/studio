import test from 'node:test';
import assert from 'node:assert/strict';
import { getDocumentUrl, getDocumentStartUrl } from '../../src/lib/document-library/url';
import { promissoryNoteCA } from '../../src/lib/documents/ca/promissory-note';
import { billOfSaleVehicle } from '../../src/lib/documents/us/bill-of-sale-vehicle';

test('builds base URL for Canadian promissory note', () => {
  const url = getDocumentUrl('en', 'ca', promissoryNoteCA.id);
  assert.strictEqual(url, '/en/docs/ca/promissory-note-ca');
});

test('builds start URL for US vehicle bill of sale', () => {
  const url = getDocumentStartUrl('es', 'us', billOfSaleVehicle.id);
  assert.strictEqual(url, '/es/docs/us/bill-of-sale-vehicle/start');
});
