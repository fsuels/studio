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
      description:
        'Secure your real estate purchase by properly handling earnest money deposits with clear refund conditions.',
      aliases: [],
    },
    es: {
      name: 'Acuerdo de depósito en garantía',
      description:
        'Asegura tu compra de bienes raíces gestionando correctamente el depósito en garantía con condiciones claras de reembolso.',
      aliases: [],
    },
  },
};
