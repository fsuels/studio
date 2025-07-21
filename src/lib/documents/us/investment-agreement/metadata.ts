// src/lib/documents/us/investment-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InvestmentAgreementSchema } from './schema';
import { investmentAgreementQuestions } from './questions';

export const investmentAgreementMeta: LegalDocument = {
  id: 'investment-agreement',
  jurisdiction: 'US',
  category: 'Finance & Lending',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/investment-agreement.md',
    es: '/templates/es/investment-agreement.md',
  },
  schema: InvestmentAgreementSchema,
  questions: investmentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Investment Agreement',
      description:
        'Secure your financial future by clearly defining investment terms, returns, and responsibilities for all parties.',
      aliases: ['investor agreement', 'investment contract'],
    },
    es: {
      name: 'Acuerdo de Inversión',
      description:
        'Acuerdo que describe términos para transacciones de inversión.',
      aliases: ['contrato de inversionista', 'acuerdo de capital'],
    },
  },
};
