import test from 'node:test';
import assert from 'node:assert/strict';
import { docs } from '../src/lib/document-library';
import { getTemplatePath } from '../src/lib/templateUtils';

test('DocumentPreview fallback path generation', () => {
  const doc = docs.find(d => d.id === 'bill-of-sale-vehicle' && d.country === 'us');
  const path = getTemplatePath(doc as any, 'en', 'us');
  assert.strictEqual(path, '/templates/en/us/bill-of-sale-vehicle.md');
});
