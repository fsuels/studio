// src/lib/documents/us/payment-bond/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { paymentbondSchema } from './schema';
import { paymentbondQuestions } from './questions';

export const paymentbondMeta: LegalDocument = {
  id: 'payment-bond',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/payment-bond.md',
    es: '/templates/es/payment-bond.md',
  },
  schema: paymentbondSchema,
  questions: paymentbondQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Payment Bond',
      description: 'Surety bond guaranteeing payment to subcontractors and material suppliers on construction projects.',
      aliases: ['labor and material bond', 'subcontractor payment bond', 'supplier bond'],
    },
    es: {
      name: 'Fianza de Pago',
      description: 'Fianza de garantía que garantiza el pago a subcontratistas y proveedores de materiales en proyectos de construcción.',
      aliases: ['fianza de trabajo y materiales', 'fianza de pago de subcontratistas'],
    },
  },
};