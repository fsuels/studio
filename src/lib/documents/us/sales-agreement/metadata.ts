// src/lib/documents/us/sales-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SalesAgreementSchema } from './schema';
import { salesAgreementQuestions } from './questions';

export const salesAgreementMeta: LegalDocument = {
  id: 'sales-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/sales-agreement.md',
    es: '/templates/es/sales-agreement.md',
  },
  schema: SalesAgreementSchema,
  questions: salesAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Sales Agreement',
      description:
        'Create a comprehensive sales agreement for goods or products.',
      aliases: [
        'purchase and sale agreement',
        'sale contract',
        'goods agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Venta',
      description: 'Crea un acuerdo de venta integral para bienes o productos.',
      aliases: ['contrato de venta', 'acuerdo de compraventa'],
    },
  },
};
