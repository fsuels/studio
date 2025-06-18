// src/lib/documents/us/mining-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MiningAgreementSchema } from './schema';
import { miningAgreementQuestions } from './questions';

export const miningAgreementMeta: LegalDocument = {
  id: 'mining-agreement',
  jurisdiction: 'US',
  category: 'Environmental & Energy',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/mining-agreement.md',
    es: '/templates/es/mining-agreement.md',
  },
  schema: MiningAgreementSchema,
  questions: miningAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mining Agreement',
      description: 'Agreement for mineral extraction and mining rights.',
      aliases: ['mineral rights', 'extraction agreement', 'mining lease'],
    },
    es: {
      name: 'Acuerdo Minero',
      description: 'Acuerdo para extracción de minerales y derechos mineros.',
      aliases: ['derechos minerales', 'arrendamiento minero'],
    },
  },
};