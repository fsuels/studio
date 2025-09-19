// src/lib/documents/us/rent-increase-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RentIncreaseLetterSchema } from './schema';
import { rentIncreaseLetterQuestions } from './questions';

export const rentIncreaseLetterMeta: LegalDocument = {
  id: 'rent-increase-letter',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 13.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/rent-increase-letter.md',
    es: '/templates/es/rent-increase-letter.md',
  },
  schema: RentIncreaseLetterSchema,
  questions: rentIncreaseLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Rent Increase Letter',
      description: 'Formal notice to tenants regarding rent increases',
      aliases: [],
    },
    es: {
      name: 'Carta de aumento de renta',
      description: 'Aviso formal a los inquilinos sobre incrementos en la renta.',
      aliases: [],
    },
  },
};
