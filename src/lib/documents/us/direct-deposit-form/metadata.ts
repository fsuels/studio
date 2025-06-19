// src/lib/documents/us/direct-deposit-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const directDepositFormMeta: LegalDocument = {
  id: 'direct-deposit-form',
  jurisdiction: 'US',
  category: 'HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/direct-deposit-form.md',
    es: '/templates/es/direct-deposit-form.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Direct Deposit Authorization Form',
      description: 'Authorization form for employee direct deposit of payroll',
      aliases: [],
    },
    es: {
      name: 'Direct Deposit Authorization Form',
      description: 'Authorization form for employee direct deposit of payroll',
      aliases: [],
    },
  },
};
