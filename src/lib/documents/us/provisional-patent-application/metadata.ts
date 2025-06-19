// src/lib/documents/us/provisional-patent-application/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ProvisionalPatentApplicationSchema } from './schema';
import { provisionalPatentApplicationQuestions } from './questions';

export const provisionalPatentApplicationMeta: LegalDocument = {
  id: 'provisional-patent-application',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 35,
  states: 'all',
  templatePaths: {
    en: '/templates/en/provisional-patent-application.md',
    es: '/templates/es/provisional-patent-application.md',
  },
  schema: ProvisionalPatentApplicationSchema,
  questions: provisionalPatentApplicationQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Provisional Patent Application',
      description: 'Prepare a provisional patent application to establish an early filing date for your invention.',
      aliases: ['provisional patent', 'patent application', 'provisional filing', 'invention filing'],
    },
    es: {
      name: 'Solicitud de Patente Provisional',
      description: 'Prepare una solicitud de patente provisional para establecer una fecha de presentación temprana para su invención.',
      aliases: ['patente provisional', 'solicitud patente', 'presentación provisional', 'registro invención'],
    },
  },
};