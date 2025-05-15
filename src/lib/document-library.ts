import { z } from 'zod';
import { documentLibraryAdditions } from './document-library-additions';
import type { LegalDocument } from '@/types/documents';
import * as docs from './documents';

import { usStates } from './usStates';   // <- still fine

/* ------------------------------------------------------------- *
 * 1️⃣  Collect every export from ./documents, but immediately
 *     drop anything that came through as `undefined`.
 * ------------------------------------------------------------- */
const coreDocs: unknown[] = Object.values(docs);

// keep only objects that look like LegalDocument
function isLegalDocument(x: unknown): x is LegalDocument {
  return !!x && typeof x === 'object' && 'name' in x && 'templatePath' in x;
}

export let documentLibrary: LegalDocument[] = [
  ...coreDocs.filter(isLegalDocument),
  ...documentLibraryAdditions
];

/* ------------------------------------------------------------- *
 * 2️⃣  Utility helpers (unchanged)
 * ------------------------------------------------------------- */
export function generateIdFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// add IDs if missing
documentLibrary.forEach(doc => {
  if (!doc.id) doc.id = generateIdFromName(doc.name);
});

// make sure every doc has a schema / questions so renderers don’t crash
const defaultSchema = z.object({
  details: z.string().min(1, 'Details are required.'),
  state:   z.string().length(2).optional(),
});

documentLibrary.forEach(doc => {
  if (!doc.schema)   doc.schema   = defaultSchema;
  if (!doc.questions) doc.questions = [];           // empty, but defined
});

/* ------------------------------------------------------------- *
 * 3️⃣  Search helper (unchanged)
 * ------------------------------------------------------------- */
export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  const lower = query.toLowerCase();
  return documentLibrary.filter(doc => {
    const name  = lang === 'es' && doc.name_es        ? doc.name_es        : doc.name;
    const desc  = lang === 'es' && doc.description_es ? doc.description_es : doc.description;
    const alias = lang === 'es' && doc.aliases_es     ? doc.aliases_es     : (doc.aliases || []);

    const matchesQuery =
      name.toLowerCase().includes(lower) ||
      (!!desc  && desc.toLowerCase().includes(lower)) ||
      alias.some(a => a.toLowerCase().includes(lower));

    const matchesState =
      !state || state === 'all' ||
      doc.states === 'all' ||
      (Array.isArray(doc.states) && doc.states.includes(state));

    return matchesQuery && matchesState;
  });
}

export default documentLibrary;
