import type { DocumentMetadata } from '@/types/documents';

export const metadata: DocumentMetadata = {
  id: 'eviction-notice',
  jurisdiction: 'US',
  category: 'Real Estate',
  translations: {
    en: {
      name: 'Eviction Notice',
      description: 'Formal notice to a tenant to vacate the property.',
      aliases: ['remove tenant', 'late rent', 'kick out', 'notice to quit'],
    },
    es: {
      name: 'Aviso de Desalojo',
      description:
        'Notificación formal a un inquilino para desalojar la propiedad.',
      aliases: [
        'desalojar inquilino',
        'renta atrasada',
        'echar',
        'notificación de desalojo',
      ],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/eviction-notice.md',
    es: '/templates/es/eviction-notice.md',
  },
  upsellClauses: [],
};