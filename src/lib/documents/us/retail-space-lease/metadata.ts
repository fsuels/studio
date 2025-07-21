// src/lib/documents/us/retail-space-lease/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RetailSpaceLeaseSchema } from './schema';
import { retailSpaceLeaseQuestions } from './questions';

export const retailSpaceLeaseMeta: LegalDocument = {
  id: 'retail-space-lease',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/retail-space-lease.md',
    es: '/templates/es/retail-space-lease.md',
  },
  schema: RetailSpaceLeaseSchema,
  questions: retailSpaceLeaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Retail Space Lease',
      description:
        'Commercial lease agreement for retail locations and storefronts',
      aliases: [],
    },
    es: {
      name: 'Retail Space Lease', // TODO: Add Spanish translation
      description:
        'Commercial lease agreement for retail locations and storefronts', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
