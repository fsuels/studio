// src/lib/documents/us/student-loan-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { StudentLoanAgreementSchema } from './schema';
import { studentLoanAgreementQuestions } from './questions';

export const studentLoanAgreementMeta: LegalDocument = {
  id: 'student-loan-agreement',
  jurisdiction: 'US',
  category: 'Finance & Lending',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/student-loan-agreement.md',
    es: '/templates/es/student-loan-agreement.md',
  },
  schema: StudentLoanAgreementSchema,
  questions: studentLoanAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Student Loan Agreement',
      description:
        'Agreement for educational loan financing and repayment terms.',
      aliases: [
        'education loan agreement',
        'private student loan',
        'educational financing agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Préstamo Estudiantil',
      description:
        'Acuerdo para financiamiento educativo y términos de reembolso.',
      aliases: ['préstamo educativo', 'financiamiento estudiantil'],
    },
  },
};
