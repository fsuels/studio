// src/lib/documents/us/payment-plan/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { paymentPlanSchema } from './schema';
import { paymentPlanQuestions } from './questions';

export const paymentPlanMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'payment-plan',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16,
  states: 'all',
  templatePaths: {
    en: '/templates/en/payment-plan.md',
    es: '/templates/es/payment-plan.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Payment Plan Agreement',
      description:
        'Structure installment payments for debts, purchases, or services.',
      aliases: ['installment plan', 'payment schedule', 'payment arrangement'],
    },
    es: {
      name: 'Acuerdo de Plan de Pagos',
      description:
        'Estructurar pagos a plazos para deudas, compras o servicios.',
      aliases: ['plan de cuotas', 'cronograma de pagos', 'arreglo de pagos'],
    },
  },
};
