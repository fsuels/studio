// src/lib/documents/us/lease-amendment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LeaseAmendmentSchema } from './schema';
import { leaseAmendmentQuestions } from './questions';

export const leaseAmendmentMeta: LegalDocument = {
  id: 'lease-amendment',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/lease-amendment.md',
    es: '/templates/es/lease-amendment.md',
  },
  schema: LeaseAmendmentSchema,
  questions: leaseAmendmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Lease Amendment',
      description:
        'Modify existing lease terms with a legally binding lease amendment document.',
      aliases: [
        'lease modification',
        'rental amendment',
        'lease change',
        'lease alteration',
      ],
    },
    es: {
      name: 'Enmienda de Arrendamiento',
      description:
        'Modifica los términos de arrendamiento existentes con una enmienda legalmente válida.',
      aliases: [
        'modificación de arrendamiento',
        'cambio de alquiler',
        'alteración de contrato',
        'alteración del arrendamiento',
      ],
    },
  },
};
