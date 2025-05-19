// src/lib/documents/us/testing1/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FirstSecondSchema } from './schema';
import { firstSecondQuestions } from './questions';

export const firstSecondMeta: LegalDocument = {
  id: 'testing1',
  jurisdiction: 'US',
  category: 'General',
  languageSupport: ['en', 'es'],
  basePrice: 0,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePath: '/templates/en/testing1.md',
  templatePath_es: '/templates/es/testing1.md',
  schema: FirstSecondSchema,
  questions: firstSecondQuestions,
  translations: {
    en: { name: 'Testing1', description: 'Placeholder document', aliases: [] },
    es: { name: 'Testing1', description: 'Documento de prueba', aliases: [] }
  }
};
