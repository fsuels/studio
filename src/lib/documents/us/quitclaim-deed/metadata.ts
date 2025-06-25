// src/lib/documents/us/quitclaim-deed/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { quitclaimDeedSchema } from './schema';
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
  schema: quitclaimDeedSchema,
  questions: quitclaimDeedQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Quitclaim Deed',
      description: 'Transfer property ownership quickly for family or divorce situations. Simplify property transfers without title warranties.',
      aliases: ['property transfer', 'quit claim deed', 'transfer ownership'],
    },
    es: {
      name: 'Escritura de Finiquito',
      description:
        'Transfiere tu parte de una propiedad rápidamente. Común en divorcios o transferencias familiares, pero no garantiza que no hay problemas legales.',
      aliases: [
        'transferencia de propiedad',
        'escritura de finiquito',
        'transferir titularidad',
      ],
    },
  },
};
