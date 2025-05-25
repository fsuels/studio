import test from 'node:test';
import assert from 'node:assert/strict';
import { getDocumentUrl } from '../../src/lib/document-library/url';
import { promissoryNoteCA } from '../../src/lib/documents/ca/promissory-note';
import { billOfSaleVehicle } from '../../src/lib/documents/us/bill-of-sale-vehicle';

test('builds review URL for Canadian promissory note', () => {
  const url = getDocumentUrl('en', 'ca', promissoryNoteCA.id, 'review');
  assert.strictEqual(url, '/en/docs/ca/promissory-note-ca/review');
});

test('builds share URL for US vehicle bill of sale', () => {
  const url = getDocumentUrl('es', 'us', billOfSaleVehicle.id, 'share');
  assert.strictEqual(url, '/es/docs/us/bill-of-sale-vehicle/share');
});
