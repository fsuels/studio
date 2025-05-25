import test from 'node:test';
import assert from 'node:assert/strict';
import { docs } from '../src/lib/document-library';

test('all docs have at least one template language', () => {
  for (const d of docs) {
    assert.ok(d.languages.length > 0, `${d.country}/${d.id} missing template`);
  }
});
