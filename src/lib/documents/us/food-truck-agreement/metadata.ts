// src/lib/documents/us/food-truck-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FoodTruckAgreementSchema } from './schema';
import { foodTruckAgreementQuestions } from './questions';

export const foodTruckAgreementMeta: LegalDocument = {
  id: 'food-truck-agreement',
  jurisdiction: 'US',
  category: 'Food & Hospitality',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/food-truck-agreement.md',
    es: '/templates/es/food-truck-agreement.md',
  },
  schema: FoodTruckAgreementSchema,
  questions: foodTruckAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Food Truck Agreement',
      description:
        'Agreement for food truck operations, vending, and location services.',
      aliases: [
        'mobile food vendor agreement',
        'food cart contract',
        'street food agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Food Truck',
      description:
        'Acuerdo para operaciones de food truck, venta y servicios de ubicación.',
      aliases: ['contrato de vendedor ambulante', 'acuerdo de comida móvil'],
    },
  },
};
