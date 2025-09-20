// src/lib/documents/us/oil-gas-lease/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { OilGasLeaseSchema } from './schema';
import { oilGasLeaseQuestions } from './questions';

export const oilGasLeaseMeta: LegalDocument = {
  id: 'oil-gas-lease',
  jurisdiction: 'US',
  category: 'Environmental & Energy',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/oil-gas-lease-agreement.md',
    es: '/templates/es/oil-gas-lease-agreement.md',
  },
  schema: OilGasLeaseSchema,
  questions: oilGasLeaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Oil & Gas Lease',
      description:
        'Lease agreement for oil and gas exploration and extraction.',
      aliases: [
        'mineral lease',
        'drilling rights',
        'energy lease',
      ],
    },
    es: {
      name: 'Arrendamiento de Petróleo y Gas',
      description:
        'Acuerdo de arrendamiento para exploración y extracción de petróleo y gas.',
      aliases: [
        'arrendamiento mineral',
        'derechos de perforación',
        'arrendamiento de energía',
      ],
    },
  },
};
