// src/lib/documents/us/prenuptial-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { prenuptialAgreementSchema } from './schema';
import { prenuptialAgreementQuestions } from './questions';

export const prenuptialAgreementMeta: LegalDocument = {
  id: 'prenuptial-agreement',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 22,
  states: 'all',
  templatePaths: {
    en: '/templates/en/prenuptial-agreement.md',
    es: '/templates/es/prenuptial-agreement.md',
  },
  schema: prenuptialAgreementSchema,
  questions: prenuptialAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Prenuptial Agreement',
      description:
        'Agreement made before marriage regarding asset division if divorced.',
      aliases: ['prenup', 'marriage contract', 'before marriage agreement'],
    },
    es: {
      name: 'Acuerdo Prenupcial',
      description:
        'Acuerdo hecho antes del matrimonio sobre la división de bienes en caso de divorcio.',
      aliases: ['prenup', 'contrato matrimonial', 'acuerdo prematrimonial'],
    },
  },
};