import type { LegalDocument } from '@/types/documents';
import { boatBillOfSaleSchema } from './schema';
import { boatBillOfSaleQuestions } from './questions';

export const boatBillOfSaleMeta: LegalDocument = {
  id: 'boat-bill-of-sale',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/boat-bill-of-sale.md',
    es: '/templates/es/boat-bill-of-sale.md',
  },
  schema: boatBillOfSaleSchema,
  questions: boatBillOfSaleQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Boat Bill of Sale',
      description:
        'Create a legally binding boat bill of sale with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'vessel bill of sale',
        'watercraft sale',
        'boat purchase agreement',
        'marine bill of sale',
      ],
    },
    es: {
      name: 'Contrato de Compraventa de Embarcación',
      description:
        'Compra o vende barcos, yates o lanchas legalmente. Transfiere ownership y protege tanto vendedor como comprador en la transacción.',
      aliases: [
        'venta de barco',
        'compraventa de embarcación',
        'contrato de venta marina',
      ],
    },
  },
};
