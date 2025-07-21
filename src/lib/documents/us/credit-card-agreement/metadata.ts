// src/lib/documents/us/credit-card-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CreditCardAgreementSchema } from './schema';
import { creditCardAgreementQuestions } from './questions';

export const creditCardAgreementMeta: LegalDocument = {
  id: 'credit-card-agreement',
  jurisdiction: 'US',
  category: 'Finance & Lending',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/credit-card-agreement.md',
    es: '/templates/es/credit-card-agreement.md',
  },
  schema: CreditCardAgreementSchema,
  questions: creditCardAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Credit Card Agreement',
      description: 'Agreement outlining terms for credit card use and payment.',
      aliases: ['credit agreement', 'cardholder agreement'],
    },
    es: {
      name: 'Acuerdo de Tarjeta de Crédito',
      description:
        'Acuerdo que describe los términos de uso y pago de tarjeta de crédito.',
      aliases: ['acuerdo de crédito', 'contrato de tarjetahabiente'],
    },
  },
};
