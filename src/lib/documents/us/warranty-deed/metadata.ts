// src/lib/documents/us/warranty-deed/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { WarrantyDeedSchema } from './schema';
import { warrantyDeedQuestions } from './questions';

export const warrantyDeedMeta: LegalDocument = {
  id: 'warranty-deed',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/warranty-deed.md',
    es: '/templates/es/warranty-deed.md',
  },
  schema: WarrantyDeedSchema,
  questions: warrantyDeedQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Warranty Deed',
      description: 'Property transfer deed with full warranties and guarantees',
      aliases: [],
    },
    es: {
      name: 'Escritura con garantía general',
      description: 'Escritura de transferencia de propiedad con garantías y avales completos.',
      aliases: [],
    },
  },
};
