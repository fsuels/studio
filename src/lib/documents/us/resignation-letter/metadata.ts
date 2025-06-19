// src/lib/documents/us/resignation-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const resignationLetterMeta: LegalDocument = {
  id: 'resignation-letter',
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
    en: '/templates/en/resignation-letter.md',
    es: '/templates/es/resignation-letter.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Resignation Letter',
      description: 'Professional resignation letter template',
      aliases: [],
    },
    es: {
      name: 'Resignation Letter',
      description: 'Professional resignation letter template',
      aliases: [],
    },
  },
};
