// src/lib/documents/us/equity-incentive-plan/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const equityIncentivePlanMeta: LegalDocument = {
  id: 'equity-incentive-plan',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 35,
  states: 'all',
  templatePaths: {
    en: '/templates/en/equity-incentive-plan.md',
    es: '/templates/es/equity-incentive-plan.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Equity Incentive Plan',
      description: 'Comprehensive stock option and equity compensation plan',
      aliases: [],
    },
    es: {
      name: 'Equity Incentive Plan',
      description: 'Comprehensive stock option and equity compensation plan',
      aliases: [],
    },
  },
};
