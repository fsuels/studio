// src/lib/documents/us/consignment-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { consignmentAgreementSchema } from './schema';
import { consignmentAgreementQuestions } from './questions';

export const consignmentAgreementMeta: LegalDocument = {
  id: 'consignment-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/consignment-agreement.md',
    es: '/templates/es/us/consignment-agreement.md',
  },
  schema: consignmentAgreementSchema,
  questions: consignmentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Consignment Agreement',
      description:
        'Expand your sales reach without upfront costs. Sell products through other retailers while maintaining control over pricing and returns.',
      aliases: ['consignment contract', 'consignment deal', 'sales agreement'],
    },
    es: {
      name: 'Acuerdo de Consignación',
      description:
        'Vende productos a través de otra tienda o vendedor. Define quién recibe qué porcentaje de las ventas y qué pasa con productos no vendidos.',
      aliases: ['contrato de consignación', 'acuerdo de ventas'],
    },
  },
};
