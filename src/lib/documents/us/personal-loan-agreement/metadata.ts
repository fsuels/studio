// src/lib/documents/us/personal-loan-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PersonalLoanAgreementSchema } from './schema';
import { personalLoanAgreementQuestions } from './questions';

export const personalLoanAgreementMeta: LegalDocument = {
  id: 'personal-loan-agreement',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/personal-loan-agreement.md',
    es: '/templates/es/personal-loan-agreement.md',
  },
  schema: PersonalLoanAgreementSchema,
  questions: personalLoanAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Personal Loan Agreement',
      description:
        'Protect your money when lending to friends or family and avoid damaged relationships. Ensure clear repayment terms and legal recourse if needed.',
      aliases: ['loan contract', 'lending agreement', 'borrower agreement'],
    },
    es: {
      name: 'Acuerdo de Préstamo Personal',
      description:
        'Acuerdo integral para préstamos personales con términos de pago detallados y protecciones.',
      aliases: ['contrato de préstamo', 'acuerdo de préstamo'],
    },
  },
};
