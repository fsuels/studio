// src/lib/documents/us/loan-modification-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LoanModificationAgreementSchema } from './schema';
import { loanModificationAgreementQuestions } from './questions';

export const loanModificationAgreementMeta: LegalDocument = {
  id: 'loan-modification-agreement',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 17.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/loan-modification-agreement.md',
    es: '/templates/es/loan-modification-agreement.md',
  },
  schema: LoanModificationAgreementSchema,
  questions: loanModificationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Loan Modification Agreement',
      description:
        'Agreement to modify the terms and conditions of an existing loan agreement.',
      aliases: [
        'loan amendment',
        'loan restructure agreement',
        'loan workout agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Modificación de Préstamo',
      description:
        'Cambia los términos de un préstamo existente para evitar el impago. Reduce pagos, cambia tasas de interés o extiende el plazo de pago.',
      aliases: [
        'enmienda de préstamo',
        'acuerdo de reestructuración',
        'acuerdo de entrenamiento de préstamos',
      ],
    },
  },
};
