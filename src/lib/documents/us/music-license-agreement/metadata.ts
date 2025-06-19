// src/lib/documents/us/music-license-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MusiclicenseagreementSchema } from './schema';
import { musiclicenseagreementQuestions } from './questions';

export const musiclicenseagreementMeta: LegalDocument = {
  id: 'music-license-agreement',
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
    en: '/templates/en/music-license-agreement.md',
    es: '/templates/es/music-license-agreement.md',
  },
  schema: MusiclicenseagreementSchema,
  questions: musiclicenseagreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Music License Agreement',
      description: 'Professional music license agreement document.',
      aliases: ['music license agreement'],
    },
    es: {
      name: 'Music License Agreement en Español',
      description: 'Documento profesional de music license agreement.',
      aliases: ['music license agreement'],
    },
  },
};
