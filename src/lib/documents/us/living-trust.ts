import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const livingTrust: LegalDocument = {
  id: 'living-trust',
  name: 'Living Trust (Revocable)',
  name_es: 'Fideicomiso en Vida (Revocable)',
  category: 'Estate Planning',
  description:
    'Manage assets during life and distribute after death, potentially avoiding probate.',
  description_es:
    'Gestionar activos durante la vida y distribuirlos después de la muerte, potencialmente evitando el proceso sucesorio.',
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
