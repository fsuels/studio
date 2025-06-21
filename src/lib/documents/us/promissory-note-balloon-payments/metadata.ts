// src/lib/documents/us/promissory-note-balloon-payments/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PromissoryNoteBalloonPaymentsSchema } from './schema';
import { promissoryNoteBalloonPaymentsQuestions } from './questions';

export const promissoryNoteBalloonPaymentsMeta: LegalDocument = {
  id: 'promissory-note-balloon-payments',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 8,
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/promissory-note-balloon-payments.md',
    es: '/templates/es/promissory-note-balloon-payments.md',
  },
  schema: PromissoryNoteBalloonPaymentsSchema,
  questions: promissoryNoteBalloonPaymentsQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Promissory Note - Balloon Payments',
      description:
        'Create a promissory note with balloon payment structure, including regular payments and final balloon payment.',
      aliases: [
        'balloon loan',
        'balloon note',
        'balloon payment loan',
        'balloon promissory note',
      ],
    },
    es: {
      name: 'Pagaré - Pagos Globo',
      description:
        'Crear un pagaré con estructura de pago globo, incluyendo pagos regulares y pago final globo.',
      aliases: [
        'préstamo globo',
        'nota globo',
        'préstamo con pago globo',
        'pagaré globo',
      ],
    },
  },
};
