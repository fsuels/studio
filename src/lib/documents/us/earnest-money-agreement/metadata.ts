// src/lib/documents/us/earnest-money-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EarnestMoneyAgreementSchema } from './schema';
import { earnestMoneyAgreementQuestions } from './questions';

export const earnestMoneyAgreementMeta: LegalDocument = {
  id: 'earnest-money-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/earnest-money-agreement.md',
    es: '/templates/es/earnest-money-agreement.md',
  },
  schema: EarnestMoneyAgreementSchema,
  questions: earnestMoneyAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Earnest Money Agreement',
      description: 'Agreement for earnest money deposits in real estate transactions',
      aliases: [],
    },
    es: {
      name: 'Earnest Money Agreement', // TODO: Add Spanish translation
      description: 'Agreement for earnest money deposits in real estate transactions', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};