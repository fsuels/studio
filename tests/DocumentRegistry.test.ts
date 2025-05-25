import test from 'node:test';
import assert from 'node:assert/strict';
import { registry } from '../src/lib/document-library/index';
import { getTemplatePath } from '../src/lib/templateUtils';

test('registry documents expose core fields', () => {
  for (const [key, doc] of Object.entries(registry)) {
    assert.ok(doc.jurisdiction, `Document ${key} missing country`);
    assert.ok(Array.isArray(doc.languageSupport) && doc.languageSupport.length > 0, `Document ${key} missing languages`);
    const lang = doc.languageSupport[0];
    const path = getTemplatePath(doc as any, lang, doc.jurisdiction);
    assert.ok(path, `Document ${key} missing template path`);
    assert.ok(Object.prototype.hasOwnProperty.call(doc, 'compliance'), `Document ${key} missing compliance`);
  }
});
