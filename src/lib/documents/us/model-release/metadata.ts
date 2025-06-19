// src/lib/documents/us/model-release/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ModelreleaseSchema } from './schema';
import { modelreleaseQuestions } from './questions';

export const modelreleaseMeta: LegalDocument = {
  id: 'model-release',
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
    en: '/templates/en/model-release.md',
    es: '/templates/es/model-release.md',
  },
  schema: ModelreleaseSchema,
  questions: modelreleaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Model Release',
      description: 'Professional model release document.',
      aliases: ['model release'],
    },
    es: {
      name: 'Model Release en Español',
      description: 'Documento profesional de model release.',
      aliases: ['model release'],
    },
  },
};
