// src/lib/documents/us/purchase-order/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { purchaseOrderSchema } from './schema';
import { purchaseOrderQuestions } from './questions';

export const purchaseOrderMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'purchase-order',
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
    en: '/templates/en/purchase-order.md',
    es: '/templates/es/purchase-order.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Purchase Order',
      description:
        'Formal document to request goods or services from a supplier.',
      aliases: ['PO', 'purchase request', 'procurement order'],
    },
    es: {
      name: 'Orden de Compra',
      description:
        'Documento formal para solicitar bienes o servicios de un proveedor.',
      aliases: ['OC', 'solicitud de compra', 'orden de adquisición'],
    },
  },
};