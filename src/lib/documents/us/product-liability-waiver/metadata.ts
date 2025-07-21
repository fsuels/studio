// src/lib/documents/us/product-liability-waiver/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ProductLiabilityWaiverSchema } from './schema';
import { productLiabilityWaiverQuestions } from './questions';

export const productLiabilityWaiverMeta: LegalDocument = {
  id: 'product-liability-waiver',
  jurisdiction: 'US',
  category: 'Risk Management',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/product-liability-waiver.md',
    es: '/templates/es/product-liability-waiver.md',
  },
  schema: ProductLiabilityWaiverSchema,
  questions: productLiabilityWaiverQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Product Liability Waiver',
      description:
        'Release form protecting manufacturers and retailers from product-related claims and injuries.',
      aliases: [
        'product waiver',
        'manufacturing liability waiver',
        'product release',
      ],
    },
    es: {
      name: 'Exención de Responsabilidad de Producto',
      description:
        'Formulario de liberación que protege a fabricantes y vendedores de reclamos relacionados con productos.',
      aliases: ['exención de producto', 'liberación de fabricante'],
    },
  },
};
