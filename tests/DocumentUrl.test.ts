import test from 'node:test';
import assert from 'node:assert/strict';
import { promissoryNoteCA } from '../src/lib/documents/ca/promissory-note';
import { getDocumentUrl } from '../src/lib/document-library/url';

// Basic sanity check for URL generation using the CA promissory note document

test('getDocumentUrl builds correct path for Canadian promissory note', () => {
  const url = getDocumentUrl('en', 'ca', promissoryNoteCA.id, 'start');
  assert.strictEqual(url, '/en/docs/ca/promissory-note-ca/start');
});
