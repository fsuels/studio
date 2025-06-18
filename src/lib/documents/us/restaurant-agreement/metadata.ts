// src/lib/documents/us/restaurant-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RestaurantAgreementSchema } from './schema';
import { restaurantAgreementQuestions } from './questions';

export const restaurantAgreementMeta: LegalDocument = {
  id: 'restaurant-agreement',
  jurisdiction: 'US',
  category: 'Food & Hospitality',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/restaurant-agreement.md',
    es: '/templates/es/restaurant-agreement.md',
  },
  schema: RestaurantAgreementSchema,
  questions: restaurantAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Restaurant Agreement',
      description: 'Agreement for restaurant operations, partnerships, or management.',
      aliases: ['restaurant partnership', 'restaurant management agreement'],
    },
    es: {
      name: 'Acuerdo de Restaurante',
      description: 'Acuerdo para operaciones, asociaciones o gestión de restaurantes.',
      aliases: ['sociedad de restaurante', 'acuerdo de gestión'],
    },
  },
};