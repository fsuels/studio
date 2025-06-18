// src/lib/documents/us/settlement-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SettlementAgreementSchema } from './schema';
import { settlementAgreementQuestions } from './questions';

export const settlementAgreementMeta: LegalDocument = {
  id: 'settlement-agreement',
  jurisdiction: 'US',
  category: 'Dispute Resolution',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/settlement-agreement.md',
    es: '/templates/es/settlement-agreement.md',
  },
  schema: SettlementAgreementSchema,
  questions: settlementAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Settlement Agreement',
      description: 'Comprehensive agreement to resolve disputes and settle claims between parties.',
      aliases: ['dispute settlement agreement', 'claim settlement agreement', 'release and settlement'],
    },
    es: {
      name: 'Acuerdo de Liquidación',
      description: 'Acuerdo integral para resolver disputas y liquidar reclamos entre las partes.',
      aliases: ['acuerdo de resolución de disputas', 'acuerdo de liquidación de reclamos'],
    },
  },
};