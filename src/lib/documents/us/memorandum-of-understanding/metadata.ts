// src/lib/documents/us/memorandum-of-understanding/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MemorandumOfUnderstandingSchema } from './schema';
import { memorandumOfUnderstandingQuestions } from './questions';

export const memorandumOfUnderstandingMeta: LegalDocument = {
  id: 'memorandum-of-understanding',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/memorandum-of-understanding.md',
    es: '/templates/es/memorandum-of-understanding.md',
  },
  schema: MemorandumOfUnderstandingSchema,
  questions: memorandumOfUnderstandingQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Memorandum of Understanding (MOU)',
      description:
        'Build strong partnerships and secure business collaborations before formal contracts. Establish clear expectations and protect your interests in joint ventures.',
      aliases: ['MOU', 'memorandum of understanding', 'cooperation agreement'],
    },
    es: {
      name: 'Memorando de Entendimiento (MOU)',
      description:
        'Crea un MOU formal para delinear el entendimiento mutuo y la cooperación entre partes.',
      aliases: ['MOU', 'memorando de entendimiento', 'acuerdo de cooperación'],
    },
  },
};
