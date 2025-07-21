// src/lib/documents/us/general-inquiry/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const generalInquiryMeta: LegalDocument = {
  id: 'general-inquiry',
  jurisdiction: 'US',
  category: 'Miscellaneous',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 0,
  states: 'all',
  templatePaths: {
    en: '/templates/en/general-inquiry.md',
    es: '/templates/es/general-inquiry.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Inquiry',
      description:
        "For situations where a specific document isn't immediately clear or needed.",
      aliases: ['help', 'question', 'legal advice', 'not sure'],
    },
    es: {
      name: 'Consulta General',
      description:
        'Para situaciones donde un documento específico no está claro o no se necesita de inmediato.',
      aliases: ['ayuda', 'pregunta', 'consejo legal', 'no estoy seguro'],
    },
  },
};
