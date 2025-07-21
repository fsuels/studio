// src/lib/documents/us/invoice/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InvoiceSchema } from './schema';
import { invoiceQuestions } from './questions';

export const invoiceMeta: LegalDocument = {
  id: 'invoice',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 3,
  states: 'all',
  templatePaths: {
    en: '/templates/en/invoice.md',
    es: '/templates/es/invoice.md',
  },
  schema: InvoiceSchema,
  questions: invoiceQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Invoice',
      description: 'Get paid faster with professional invoices that customers take seriously. Improve cash flow with clear payment terms.',
    },
    es: {
      name: 'Factura',
      description: 'Cobra a clientes por bienes o servicios que has proporcionado. Formato profesional de factura para recibir pago más rápido.',
    },
  },
};
