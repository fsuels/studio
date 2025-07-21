// src/lib/documents/us/debt-validation-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DebtValidationLetterSchema } from './schema';
import { debtValidationLetterQuestions } from './questions';

export const debtValidationLetterMeta: LegalDocument = {
  id: 'debt-validation-letter',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  basePrice: 4,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/debt-validation-letter.md',
    es: '/templates/es/debt-validation-letter.md',
  },
  schema: DebtValidationLetterSchema,
  questions: debtValidationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Debt Validation Letter',
      description:
        'Protect yourself from unfair debt collection by demanding proof that claimed debts are legitimate and accurate.',
      aliases: [
        'debt dispute letter',
        'validation request',
        'debt verification',
        'collector challenge',
      ],
    },
    es: {
      name: 'Carta de Validación de Deuda',
      description:
        'Solicitar validación de deuda de cobradores para verificar legitimidad y precisión de la deuda reclamada.',
      aliases: [
        'carta de disputa de deuda',
        'solicitud de validación',
        'verificación de deuda',
        'desafío de cobrador',
      ],
    },
  },
};
