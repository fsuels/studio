// src/lib/documents/us/mechanics-lien-waiver/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { mechanicslienwaiverSchema } from './schema';
import { mechanicslienwaiverQuestions } from './questions';

export const mechanicslienwaiverMeta: LegalDocument = {
  id: 'mechanics-lien-waiver',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/mechanics-lien-waiver.md',
    es: '/templates/es/mechanics-lien-waiver.md',
  },
  schema: mechanicslienwaiverSchema,
  questions: mechanicslienwaiverQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mechanics Lien Waiver',
      description:
        'Legal waiver releasing mechanics lien rights upon payment for construction work or materials.',
      aliases: ['lien waiver', 'lien release', 'waiver of lien rights'],
    },
    es: {
      name: 'Renuncia de Gravamen de Mecánicos',
      description:
        'Renuncia legal que libera los derechos de gravamen de mecánicos al recibir el pago por trabajo de construcción o materiales.',
      aliases: ['renuncia de gravamen', 'liberación de gravamen'],
    },
  },
};
