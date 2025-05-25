import test from 'node:test';
import assert from 'node:assert/strict';
import { promissoryNoteCA } from '../src/lib/documents/ca/promissory-note';
import { getDocumentStartUrl } from '../src/lib/document-library/url';

// Basic sanity check for URL generation using the CA promissory note document

test('getDocumentStartUrl builds correct start path for Canadian promissory note', () => {
  const url = getDocumentStartUrl('en', 'ca', promissoryNoteCA.id);
  assert.strictEqual(url, '/en/docs/ca/promissory-note-ca/start');
});
