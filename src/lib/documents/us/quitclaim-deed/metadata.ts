import type { LegalDocumentMetadata } from '@/types/documents';

export const quitclaimDeedMetadata: LegalDocumentMetadata = {
  category: 'Real Estate',
  templatePaths: {
    en: '/templates/en/quitclaim-deed.md',
    es: '/templates/es/quitclaim-deed.md'
  },
  translations: {
    en: {
      name: 'Quitclaim Deed',
      description: 'Transfer property interest without warranty of title.',
      aliases: ['property transfer', 'quit claim deed', 'transfer ownership'],
    },
    es: {
      name: 'Escritura de Finiquito',
      description: 'Transferir interés en una propiedad sin garantía de título.',
      aliases: [
        'transferencia de propiedad',
        'escritura de finiquito',
        'transferir titularidad',
      ],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 5,
  states: 'all',
};