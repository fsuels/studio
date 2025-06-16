import type { DocumentMetadata } from '@/types/documents';

export const metadata: DocumentMetadata = {
  id: 'general-inquiry',
  jurisdiction: 'US',
  category: 'Miscellaneous',
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
  upsellClauses: [],
};