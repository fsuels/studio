// src/lib/documents/us/eviction-notice/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const evictionNoticeMeta: LegalDocument = {
  id: 'eviction-notice',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 10,
  states: 'all',
  templatePaths: {
    en: '/templates/en/eviction-notice.md',
    es: '/templates/es/eviction-notice.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Eviction Notice',
      description: 'Formal notice to a tenant to vacate the property.',
      aliases: ['remove tenant', 'late rent', 'kick out', 'notice to quit'],
    },
    es: {
      name: 'Aviso de Desalojo',
      description:
        'Notifica legalmente a los inquilinos que deben abandonar tu propiedad. Primer paso requerido antes de presentar desalojo en corte.',
      aliases: [
        'desalojar inquilino',
        'renta atrasada',
        'echar',
        'notificación de desalojo',
      ],
    },
  },
};
