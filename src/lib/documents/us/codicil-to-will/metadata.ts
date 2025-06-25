// src/lib/documents/us/codicil-to-will/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CodicilToWillSchema } from './schema';
import { codicilToWillQuestions } from './questions';

export const codicilToWillMeta: LegalDocument = {
  id: 'codicil-to-will',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/codicil-to-will.md',
    es: '/templates/es/codicil-to-will.md',
  },
  schema: CodicilToWillSchema,
  questions: codicilToWillQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Codicil to Will',
      description:
        'Make amendments to your existing will without rewriting the entire document.',
      aliases: ['will amendment', 'will codicil', 'will modification'],
    },
    es: {
      name: 'Codicilo al Testamento',
      description:
        'Mantén tu testamento actualizado sin costos legales excesivos. Adapta tu herencia a cambios familiares y financieros fácilmente.',
      aliases: ['enmienda al testamento', 'modificación de testamento'],
    },
  },
};
