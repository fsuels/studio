// src/lib/documents/us/lease-addendum/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LeaseAddendumSchema } from './schema';
import { leaseAddendumQuestions } from './questions';

export const leaseAddendumMeta: LegalDocument = {
  id: 'lease-addendum',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/lease-addendum.md',
    es: '/templates/es/lease-addendum.md',
  },
  schema: LeaseAddendumSchema,
  questions: leaseAddendumQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Lease Addendum',
      description:
        'Add terms to existing lease agreements with a legally binding lease addendum',
      aliases: [],
    },
    es: {
      name: 'Lease Addendum', // TODO: Add Spanish translation
      description:
        'Add terms to existing lease agreements with a legally binding lease addendum', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
