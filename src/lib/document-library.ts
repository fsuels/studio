// src/lib/document-library.ts
import { z } from 'zod';
import { documentLibraryAdditions } from './document-library-additions';
// BillOfSaleSchema is now imported within its own document file (us/vehicle-bill-of-sale.ts)
import type { LegalDocument } from '@/types/documents'; // Import types
import * as docs from './documents';
import { usStates } from './usStates'; // Import usStates from its new location

// The main library of legal documents - now assembled from individual files
export let documentLibrary: LegalDocument[] = [
  ...Object.values(docs),
  ...documentLibraryAdditions
];

// Utility to generate a unique ID from a name (if IDs are not manually set)
export function generateIdFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Ensure all documents have an ID, generate if missing (example logic)
documentLibrary.forEach(doc => {
  if (!doc.id) {
    doc.id = generateIdFromName(doc.name);
  }
});

// Ensure all documents have a schema, assign a default if missing
const defaultSchema = z.object({
  details: z.string().min(1, "Details are required."),
  state: z.string().length(2).optional()
});

documentLibrary.forEach(doc => {
  if (!doc.schema) {
    console.warn(`Document "${doc.name}" is missing a Zod schema. Assigning default.`);
    doc.schema = defaultSchema;
  }
   // Ensure questions are at least an empty array if undefined
  if (!doc.questions) {
    doc.questions = [];
  }
});

// Function to find documents matching search term and language
export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string // Optional state filter
): LegalDocument[] {
  const lowerQuery = query.toLowerCase();
  return documentLibrary.filter(doc => {
    const name = lang === 'es' && doc.name_es ? doc.name_es : doc.name;
    const description = lang === 'es' && doc.description_es ? doc.description_es : doc.description;
    const aliases = lang === 'es' && doc.aliases_es ? doc.aliases_es : (doc.aliases || []);

    const matchesQuery = name.toLowerCase().includes(lowerQuery) ||
      (description && description.toLowerCase().includes(lowerQuery)) ||
      aliases.some(alias => alias.toLowerCase().includes(lowerQuery));

    const matchesState = !state || state === 'all' || doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(state));

    return matchesQuery && matchesState;
  });
}

// Make the final documentLibrary available as the default export
// This is the array that will be used by the rest of the application.
export default documentLibrary;
