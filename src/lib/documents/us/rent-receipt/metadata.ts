// src/lib/documents/us/rent-receipt/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RentReceiptSchema } from './schema';
import { rentReceiptQuestions } from './questions';

export const rentReceiptMeta: LegalDocument = {
  id: 'rent-receipt',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/rent-receipt.md',
    es: '/templates/es/rent-receipt.md',
  },
  schema: RentReceiptSchema,
  questions: rentReceiptQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Rent Receipt',
      description:
        'Generate official rent payment receipts for landlords and tenants',
      aliases: [],
    },
    es: {
      name: 'Recibo de Renta',
      description:
        'Comprobante oficial de pago de renta para propietarios e inquilinos. Documento importante para registros financieros y declaraciones de impuestos.',
      aliases: [],
    },
  },
};
