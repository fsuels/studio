// src/lib/documents/us/restaurant-lease/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RestaurantLeaseSchema } from './schema';
import { restaurantLeaseQuestions } from './questions';

export const restaurantLeaseMeta: LegalDocument = {
  id: 'restaurant-lease',
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
    en: '/templates/en/restaurant-lease.md',
    es: '/templates/es/restaurant-lease.md',
  },
  schema: RestaurantLeaseSchema,
  questions: restaurantLeaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Restaurant Lease',
      description:
        'Specialized lease agreement for restaurant and food service businesses',
      aliases: [],
    },
    es: {
      name: 'Restaurant Lease', // TODO: Add Spanish translation
      description:
        'Specialized lease agreement for restaurant and food service businesses', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
