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
      description: 'Secure the perfect space for your business with favorable terms. Protect your commercial investment and avoid surprises in operating costs.',
      aliases: [],
    },
    es: {
      name: 'Contrato de Arrendamiento Comercial',
      description:
        'Asegura el espacio perfecto para tu negocio con términos favorables. Protege tu inversión comercial y evita sorpresas en costos operativos.',
      aliases: [],
    },
  },
};
