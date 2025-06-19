// src/lib/documents/us/two-weeks-notice-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const twoweeksnoticeletterMeta: LegalDocument = {
  id: 'two-weeks-notice-letter',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/two-weeks-notice-letter.md',
    es: '/templates/es/two-weeks-notice-letter.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Two Weeks Notice Letter',
      description: 'Standard two weeks notice resignation letter',
      aliases: [],
    },
    es: {
      name: 'Two Weeks Notice Letter',
      description: 'Standard two weeks notice resignation letter',
      aliases: [],
    },
  },
};
