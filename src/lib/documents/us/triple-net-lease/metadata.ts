// src/lib/documents/us/triple-net-lease/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TripleNetLeaseSchema } from './schema';
import { tripleNetLeaseQuestions } from './questions';

export const tripleNetLeaseMeta: LegalDocument = {
  id: 'triple-net-lease',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 49.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/triple-net-lease.md',
    es: '/templates/es/triple-net-lease.md',
  },
  schema: TripleNetLeaseSchema,
  questions: tripleNetLeaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Triple Net Lease',
      description: 'Commercial lease where tenant pays all property expenses',
      aliases: [],
    },
    es: {
      name: 'Triple Net Lease', // TODO: Add Spanish translation
      description: 'Commercial lease where tenant pays all property expenses', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};