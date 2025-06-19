// src/lib/documents/us/residential-rental-application/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ResidentialRentalApplicationSchema } from './schema';
import { residentialRentalApplicationQuestions } from './questions';

export const residentialRentalApplicationMeta: LegalDocument = {
  id: 'residential-rental-application',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/residential-rental-application.md',
    es: '/templates/es/residential-rental-application.md',
  },
  schema: ResidentialRentalApplicationSchema,
  questions: residentialRentalApplicationQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Residential Rental Application',
      description: 'Comprehensive rental application form for prospective tenants',
      aliases: [],
    },
    es: {
      name: 'Residential Rental Application', // TODO: Add Spanish translation
      description: 'Comprehensive rental application form for prospective tenants', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};