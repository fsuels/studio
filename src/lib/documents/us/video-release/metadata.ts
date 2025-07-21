// src/lib/documents/us/video-release/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { VideoreleaseSchema } from './schema';
import { videoreleaseQuestions } from './questions';

export const videoreleaseMeta: LegalDocument = {
  id: 'video-release',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/video-release.md',
    es: '/templates/es/video-release.md',
  },
  schema: VideoreleaseSchema,
  questions: videoreleaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Video Release',
      description: 'Professional video release document.',
      aliases: ['video release'],
    },
    es: {
      name: 'Video Release en Español',
      description: 'Documento profesional de video release.',
      aliases: ['video release'],
    },
  },
};
