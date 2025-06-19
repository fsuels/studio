// src/lib/documents/us/private-placement-memorandum/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { privatePlacementMemorandumSchema } from './schema';
import { privatePlacementMemorandumQuestions } from './questions';

export const privatePlacementMemorandumMeta: LegalDocument = {
  id: 'private-placement-memorandum',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 75,
  states: 'all',
  templatePaths: {
    en: '/templates/en/private-placement-memorandum.md',
    es: '/templates/es/private-placement-memorandum.md',
  },
  schema: privatePlacementMemorandumSchema,
  questions: privatePlacementMemorandumQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Private Placement Memorandum',
      description:
        'Comprehensive document for private securities offerings to accredited investors.',
      aliases: ['PPM', 'private offering document', 'securities memorandum'],
    },
    es: {
      name: 'Memorando de Colocación Privada',
      description:
        'Documento integral para ofertas privadas de valores a inversores acreditados.',
      aliases: ['PPM', 'documento de oferta privada', 'memorando de valores'],
    },
  },
};