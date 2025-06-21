// src/lib/documents/us/proof-of-income-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const proofOfIncomeLetterMeta: LegalDocument = {
  id: 'proof-of-income-letter',
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
    en: '/templates/en/proof-of-income-letter.md',
    es: '/templates/es/proof-of-income-letter.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Proof of Income Letter',
      description:
        'Official letter verifying employee income for third parties',
      aliases: [],
    },
    es: {
      name: 'Proof of Income Letter',
      description:
        'Official letter verifying employee income for third parties',
      aliases: [],
    },
  },
};
