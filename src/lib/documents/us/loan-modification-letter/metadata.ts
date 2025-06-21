// src/lib/documents/us/loan-modification-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LoanModificationLetterSchema } from './schema';
import { loanModificationLetterQuestions } from './questions';

export const loanModificationLetterMeta: LegalDocument = {
  id: 'loan-modification-letter',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 4,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/loan-modification-letter.md',
    es: '/templates/es/loan-modification-letter.md',
  },
  schema: LoanModificationLetterSchema,
  questions: loanModificationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Loan Modification Letter',
      description:
        'Request a loan modification from your lender due to financial hardship or changed circumstances.',
      aliases: [
        'loan mod request',
        'payment modification',
        'hardship letter',
        'loan adjustment request',
      ],
    },
    es: {
      name: 'Carta de Modificación de Préstamo',
      description:
        'Solicitar una modificación de préstamo de su prestamista debido a dificultades financieras o circunstancias cambiadas.',
      aliases: [
        'solicitud de modificación',
        'modificación de pago',
        'carta de dificultad',
        'solicitud de ajuste de préstamo',
      ],
    },
  },
};
