// src/lib/documents/us/pet-addendum/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PetAddendumSchema } from './schema';
import { petAddendumQuestions } from './questions';

export const petAddendumMeta: LegalDocument = {
  id: 'pet-addendum',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/pet-addendum.md',
    es: '/templates/es/pet-addendum.md',
  },
  schema: PetAddendumSchema,
  questions: petAddendumQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Pet Addendum',
      description: 'Add pet terms to existing lease agreements',
      aliases: [],
    },
    es: {
      name: 'Pet Addendum', // TODO: Add Spanish translation
      description: 'Add pet terms to existing lease agreements', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};