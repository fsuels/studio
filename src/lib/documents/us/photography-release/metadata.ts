// src/lib/documents/us/photography-release/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PhotographyReleaseSchema } from './schema';
import { photographyReleaseQuestions } from './questions';

export const photographyReleaseMeta: LegalDocument = {
  id: 'photography-release',
  jurisdiction: 'US',
  category: 'Entertainment & Media',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/photography-release.md',
    es: '/templates/es/photography-release.md',
  },
  schema: PhotographyReleaseSchema,
  questions: photographyReleaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Photography Release',
      description: 'Release form granting permission to use photographs and images.',
      aliases: ['photo release', 'image release', 'model release'],
    },
    es: {
      name: 'Liberación de Fotografía',
      description: 'Formulario de liberación que otorga permiso para usar fotografías e imágenes.',
      aliases: ['liberación de foto', 'liberación de imagen'],
    },
  },
};