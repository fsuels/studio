// src/lib/documents/us/promissory-note-installment-payments/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PromissoryNoteInstallmentPaymentsSchema } from './schema';
import { promissoryNoteInstallmentPaymentsQuestions } from './questions';

export const promissoryNoteInstallmentPaymentsMeta: LegalDocument = {
  id: 'promissory-note-installment-payments',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 7,
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/promissory-note-installment-payments.md',
    es: '/templates/es/promissory-note-installment-payments.md',
  },
  schema: PromissoryNoteInstallmentPaymentsSchema,
  questions: promissoryNoteInstallmentPaymentsQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Promissory Note - Installment Payments',
      description:
        'Create a promissory note with structured installment payments, including payment schedule and terms.',
      aliases: [
        'installment loan',
        'payment plan note',
        'structured loan',
        'installment promissory note',
      ],
    },
    es: {
      name: 'Pagaré - Pagos a Plazos',
      description:
        'Crear un pagaré con pagos estructurados a plazos, incluyendo cronograma de pagos y términos.',
      aliases: [
        'préstamo a plazos',
        'nota de plan de pagos',
        'préstamo estructurado',
        'pagaré a plazos',
      ],
    },
  },
};
