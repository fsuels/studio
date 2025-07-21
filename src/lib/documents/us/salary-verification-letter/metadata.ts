// src/lib/documents/us/salary-verification-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const salaryVerificationLetterMeta: LegalDocument = {
  id: 'salary-verification-letter',
  jurisdiction: 'US',
  category: 'HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/salary-verification-letter.md',
    es: '/templates/es/salary-verification-letter.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Salary Verification Letter',
      description: 'Official letter verifying employee salary information',
      aliases: [],
    },
    es: {
      name: 'Salary Verification Letter',
      description: 'Official letter verifying employee salary information',
      aliases: [],
    },
  },
};
