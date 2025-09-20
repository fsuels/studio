// src/lib/documents/us/transportation-service-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TransportationServiceAgreementSchema } from './schema';
import { transportationServiceAgreementQuestions } from './questions';

export const transportationServiceAgreementMeta: LegalDocument = {
  id: 'transportation-service-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/transportation-service-agreement.md',
    es: '/templates/es/transportation-service-agreement.md',
  },
  schema: TransportationServiceAgreementSchema,
  questions: transportationServiceAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Transportation Service Agreement',
      description:
        'Agreement for transportation and delivery services between provider and client.',
      aliases: [
        'delivery service agreement',
        'transport contract',
        'logistics service agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Servicio de Transporte',
      description:
        'Acuerdo para servicios de transporte y entrega entre proveedor y cliente.',
      aliases: [
        'acuerdo de servicio de entrega',
        'contrato de transporte',
        'acuerdo de servicio logístico',
      ],
    },
  },
};
