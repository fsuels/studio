// src/lib/documents/us/statement-of-account/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { StatementOfAccountSchema } from './schema';
import { statementOfAccountQuestions } from './questions';

export const statementOfAccountMeta: LegalDocument = {
  id: 'statement-of-account',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  basePrice: 4,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/statement-of-account.md',
    es: '/templates/es/statement-of-account.md',
  },
  schema: StatementOfAccountSchema,
  questions: statementOfAccountQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Statement of Account',
      description:
        'Generate detailed account statements showing transactions, balances, and payment information.',
      aliases: ['account statement', 'billing statement', 'financial statement', 'account summary'],
    },
    es: {
      name: 'Estado de Cuenta',
      description:
        'Generar estados de cuenta detallados mostrando transacciones, saldos e información de pagos.',
      aliases: ['estado de cuenta', 'estado de facturación', 'estado financiero', 'resumen de cuenta'],
    },
  },
};
