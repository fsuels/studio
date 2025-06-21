// src/lib/documents/us/commercial-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CommercialLeaseAgreementSchema } from './schema';
import { commercialLeaseAgreementQuestions } from './questions';

export const commercialLeaseAgreementMeta: LegalDocument = {
  id: 'commercial-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/commercial-lease-agreement.md',
    es: '/templates/es/us/commercial-lease-agreement.md',
  },
  schema: CommercialLeaseAgreementSchema,
  questions: commercialLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Commercial Lease Agreement',
      description: 'Lease agreement specifically for commercial properties.',
      aliases: [],
    },
    es: {
      name: 'Contrato de Arrendamiento Comercial',
      description:
        'Contrato de arrendamiento específico para propiedades comerciales.',
      aliases: [],
    },
  },
};
