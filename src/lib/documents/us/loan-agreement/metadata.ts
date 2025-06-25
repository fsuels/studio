import type { LegalDocument } from '@/types/documents';
import { loanAgreementSchema } from './schema';
import { loanAgreementQuestions } from './questions';

export const loanAgreementMeta: LegalDocument = {
  id: 'loan-agreement',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/loan-agreement.md',
    es: '/templates/es/loan-agreement.md',
  },
  schema: loanAgreementSchema,
  questions: loanAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Loan Agreement',
      description:
        'Create a legally binding loan agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'loan contract',
        'personal loan',
        'lending agreement',
        'borrowing contract',
      ],
    },
    es: {
      name: 'Acuerdo de Préstamo',
      description:
        'Presta o pide dinero prestado con términos claros de pago. Protege tanto al prestamista como al prestatario con un acuerdo escrito.',
      aliases: [
        'contrato de préstamo',
        'préstamo personal',
        'acuerdo de préstamo',
      ],
    },
  },
};
