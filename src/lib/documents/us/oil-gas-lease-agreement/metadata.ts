// src/lib/documents/us/oil-gas-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { OilGasLeaseAgreementSchema } from './schema';
import { oilGasLeaseAgreementQuestions } from './questions';

export const oilGasLeaseAgreementMeta: LegalDocument = {
  id: 'oil-gas-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 54.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/oil-gas-lease-agreement.md',
    es: '/templates/es/oil-gas-lease-agreement.md',
  },
  schema: OilGasLeaseAgreementSchema,
  questions: oilGasLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Oil and Gas Lease Agreement',
      description:
        'Agreement for leasing mineral rights for oil and gas exploration and production.',
      aliases: [
        'petroleum lease',
        'drilling rights agreement',
        'hydrocarbon lease',
      ],
    },
    es: {
      name: 'Acuerdo de Arrendamiento de Petróleo y Gas',
      description:
        'Acuerdo para arrendar derechos minerales para exploración y producción de petróleo y gas.',
      aliases: ['arrendamiento petrolero', 'acuerdo de perforación'],
    },
  },
};
