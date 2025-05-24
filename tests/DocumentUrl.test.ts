import test from 'node:test';
import assert from 'node:assert/strict';
import { promissoryNoteCA } from '../src/lib/documents/ca/promissory-note';
import { getDocumentUrl } from '../src/lib/document-library/utils';

test('getDocumentUrl builds correct path for Canadian promissory note', () => {
  const url = getDocumentUrl(promissoryNoteCA, 'en');
  assert.strictEqual(url, '/en/docs/ca/promissory-note-ca');
});
