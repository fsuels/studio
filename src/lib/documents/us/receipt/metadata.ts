// src/lib/documents/us/receipt/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ReceiptSchema } from './schema';
import { receiptQuestions } from './questions';

export const receiptMeta: LegalDocument = {
  id: 'receipt',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  basePrice: 2,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/receipt.md',
    es: '/templates/es/receipt.md',
  },
  schema: ReceiptSchema,
  questions: receiptQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Receipt',
      description:
        'Create a professional receipt for payments, services, or transactions with detailed records.',
      aliases: [
        'payment receipt',
        'invoice receipt',
        'transaction receipt',
        'proof of payment',
      ],
    },
    es: {
      name: 'Recibo',
      description:
        'Crear un recibo profesional para pagos, servicios o transacciones con registros detallados.',
      aliases: [
        'recibo de pago',
        'recibo de factura',
        'recibo de transacción',
        'comprobante de pago',
      ],
    },
  },
};
