// src/lib/documents/us/timber-sale-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TimberSaleAgreementSchema } from './schema';
import { timberSaleAgreementQuestions } from './questions';

export const timberSaleAgreementMeta: LegalDocument = {
  id: 'timber-sale-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/timber-sale-agreement.md',
    es: '/templates/es/timber-sale-agreement.md',
  },
  schema: TimberSaleAgreementSchema,
  questions: timberSaleAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Timber Sale Agreement',
      description:
        'Agreement for the sale and harvesting of timber from forestland.',
      aliases: [
        'logging agreement',
        'forest harvesting contract',
        'tree cutting agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Venta de Madera',
      description:
        'Acuerdo para la venta y cosecha de madera de tierras forestales.',
      aliases: [
        'acuerdo de tala',
        'contrato de cosecha forestal',
        'acuerdo de corte de árboles',
      ],
    },
  },
};
