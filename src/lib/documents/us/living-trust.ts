import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const livingTrust: LegalDocument = {
  id: 'living-trust',
  category: 'Estate Planning',
  translations: {
    en: {
      name: 'Living Trust (Revocable)',
      description:
        'Manage assets during life and distribute after death, potentially avoiding probate.',
    },
    es: {
      name: 'Fideicomiso en Vida (Revocable)',
      description:
        'Gestionar activos durante la vida y distribuirlos después de la muerte, potencialmente evitando el proceso sucesorio.',
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 10,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [], // Placeholder
};
