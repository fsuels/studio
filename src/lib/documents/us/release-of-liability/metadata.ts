// src/lib/documents/us/release-of-liability/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ReleaseOfLiabilitySchema } from './schema';
import { releaseOfLiabilityQuestions } from './questions';

export const releaseOfLiabilityMeta: LegalDocument = {
  id: 'release-of-liability',
  jurisdiction: 'US',
  category: 'Risk & Liability',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/release-of-liability.md',
    es: '/templates/es/release-of-liability.md',
  },
  schema: ReleaseOfLiabilitySchema,
  questions: releaseOfLiabilityQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Release of Liability',
      description: 'General release form to waive liability for activities or services.',
      aliases: ['liability release', 'general release', 'waiver and release'],
    },
    es: {
      name: 'Liberación de Responsabilidad',
      description: 'Formulario general de liberación para eximir responsabilidad por actividades o servicios.',
      aliases: ['liberación de responsabilidad', 'liberación general', 'exención y liberación'],
    },
  },
};