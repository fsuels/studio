// src/lib/documents/us/release-for-use-of-likeness/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ReleaseforuseoflikenessSchema } from './schema';
import { releaseforuseoflikenessQuestions } from './questions';

export const releaseforuseoflikenessMeta: LegalDocument = {
  id: 'release-for-use-of-likeness',
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
    en: '/templates/en/release-for-use-of-likeness.md',
    es: '/templates/es/release-for-use-of-likeness.md',
  },
  schema: ReleaseforuseoflikenessSchema,
  questions: releaseforuseoflikenessQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Release For Use Of Likeness',
      description: 'Professional release for use of likeness document.',
      aliases: ['release for use of likeness'],
    },
    es: {
      name: 'Release For Use Of Likeness en Español',
      description: 'Documento profesional de release for use of likeness.',
      aliases: ['release for use of likeness'],
    },
  },
};
