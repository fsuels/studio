// src/lib/documents/us/debt-settlement-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DebtSettlementAgreementSchema } from './schema';
import { debtSettlementAgreementQuestions } from './questions';

export const debtSettlementAgreementMeta: LegalDocument = {
  id: 'debt-settlement-agreement',
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
    en: '/templates/en/debt-settlement-agreement.md',
    es: '/templates/es/debt-settlement-agreement.md',
  },
  schema: DebtSettlementAgreementSchema,
  questions: debtSettlementAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Debt Settlement Agreement',
      description:
        'Settle outstanding debt for less than the full amount owed with structured payment terms.',
      aliases: [
        'debt compromise',
        'settlement deal',
        'debt resolution',
        'payment settlement',
      ],
    },
    es: {
      name: 'Acuerdo de Liquidación de Deuda',
      description:
        'Negocia pagar menos de lo que debes. Acuerdo legal que reduce tu deuda total a cambio de pagos inmediatos o un plan de pagos.',
      aliases: [
        'compromiso de deuda',
        'acuerdo de liquidación',
        'resolución de deuda',
        'liquidación de pago',
      ],
    },
  },
};
