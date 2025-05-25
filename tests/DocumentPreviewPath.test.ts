import test from 'node:test';
import assert from 'node:assert/strict';
import { documentLibrary } from '../src/lib/document-library/index';
import { getTemplatePath } from '../src/lib/templateUtils';

// Ensure getTemplatePath constructs correct path used by DocumentPreview

test('DocumentPreview fallback path generation', () => {
  const doc = documentLibrary.find(d => d.id === 'bill-of-sale-vehicle');
  const path = getTemplatePath(doc!, 'en', 'us');
  assert.strictEqual(path, '/templates/en/us/bill-of-sale-vehicle.md');
});
