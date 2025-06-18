// src/lib/documents/us/hotel-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { HotelAgreementSchema } from './schema';
import { hotelAgreementQuestions } from './questions';

export const hotelAgreementMeta: LegalDocument = {
  id: 'hotel-agreement',
  jurisdiction: 'US',
  category: 'Food & Hospitality',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/hotel-agreement.md',
    es: '/templates/es/hotel-agreement.md',
  },
  schema: HotelAgreementSchema,
  questions: hotelAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Hotel Agreement',
      description: 'Agreement for hotel operations, partnerships, or management.',
      aliases: ['hotel partnership', 'hospitality agreement', 'lodging agreement'],
    },
    es: {
      name: 'Acuerdo de Hotel',
      description: 'Acuerdo para operaciones, asociaciones o gestión de hoteles.',
      aliases: ['sociedad hotelera', 'acuerdo de hospitalidad'],
    },
  },
};