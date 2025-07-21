// src/lib/documents/us/demand-letter-payment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DemandLetterPaymentSchema } from './schema';
import { demandLetterPaymentQuestions } from './questions';

export const demandLetterPaymentMeta: LegalDocument = {
  id: 'demand-letter-payment',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/demand-letter-payment.md',
    es: '/templates/es/us/demand-letter-payment.md',
  },
  schema: DemandLetterPaymentSchema,
  questions: demandLetterPaymentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Demand Letter (Payment)',
      description: 'Formally request payment that is overdue.',
      aliases: ['request payment', 'owe money', 'legal demand'],
    },
    es: {
      name: 'Carta de Reclamación (Pago)',
      description: 'Exige pago por facturas vencidas o deudas. Aviso final claro antes de buscar cobro o acción legal.',
      aliases: ['solicitar pago', 'deber dinero', 'demanda legal'],
    },
  },
};
