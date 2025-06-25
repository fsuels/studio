// src/lib/documents/us/court-filing-document/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CourtFilingDocumentSchema } from './schema';
import { courtFilingDocumentQuestions } from './questions';

export const courtFilingDocumentMeta: LegalDocument = {
  id: 'court-filing-document',
  jurisdiction: 'US',
  category: 'Government & Legal Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/court-filing-document.md',
    es: '/templates/es/court-filing-document.md',
  },
  schema: CourtFilingDocumentSchema,
  questions: courtFilingDocumentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Court Filing Document',
      description:
        'Present your case professionally with properly formatted court documents that meet legal requirements.',
      aliases: ['legal pleading', 'court document', 'legal filing'],
    },
    es: {
      name: 'Documento de Presentación Judicial',
      description:
        'Plantilla general para documentos de presentación judicial y alegatos legales.',
      aliases: ['alegato legal', 'documento judicial'],
    },
  },
};
