// src/lib/documents/us/quitclaim-deed/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { QuitclaimDeedSchema } from './schema';
import { quitclaimDeedQuestions } from './questions';

export const quitclaimDeedMeta: LegalDocument = {
  id: 'quitclaim-deed',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/quitclaim-deed.md',
    es: '/templates/es/quitclaim-deed.md',
  },
  schema: QuitclaimDeedSchema,
  questions: quitclaimDeedQuestions,
  upsellClauses: [],
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
};