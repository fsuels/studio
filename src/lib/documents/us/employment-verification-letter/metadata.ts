// src/lib/documents/us/employment-verification-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EmploymentVerificationLetterSchema } from './schema';
import { employmentVerificationLetterQuestions } from './questions';

export const employmentVerificationLetterMeta: LegalDocument = {
  id: 'employment-verification-letter',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 4.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employment-verification-letter.md',
    es: '/templates/es/employment-verification-letter.md',
  },
  schema: EmploymentVerificationLetterSchema,
  questions: employmentVerificationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employment Verification Letter',
      description:
        'Official letter confirming employee status, salary, and employment details.',
      aliases: [
        'employment letter',
        'verification of employment',
        'salary verification',
      ],
    },
    es: {
      name: 'Carta de Verificación de Empleo',
      description:
        'Carta oficial que confirma el estado del empleado, salario y detalles del empleo.',
      aliases: ['carta de empleo', 'verificación de empleo'],
    },
  },
};
