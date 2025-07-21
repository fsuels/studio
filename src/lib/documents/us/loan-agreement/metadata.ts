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
        'Access or provide funding with confidence and legal protection. Establish clear terms that prevent future disputes.',
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
        'Formaliza préstamos familiares o comerciales para evitar conflictos. Protege relaciones personales al establecer términos claros de reembolso.',
      aliases: [
        'contrato de préstamo',
        'préstamo personal',
        'acuerdo de préstamo',
      ],
    },
  },
};
