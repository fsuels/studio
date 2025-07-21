// src/lib/documents/us/maritime-charter-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MaritimeCharterAgreementSchema } from './schema';
import { maritimeCharterAgreementQuestions } from './questions';

export const maritimeCharterAgreementMeta: LegalDocument = {
  id: 'maritime-charter-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/maritime-charter-agreement.md',
    es: '/templates/es/maritime-charter-agreement.md',
  },
  schema: MaritimeCharterAgreementSchema,
  questions: maritimeCharterAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Maritime Charter Agreement',
      description:
        'Agreement for chartering vessels for maritime transportation and services.',
      aliases: [
        'ship charter agreement',
        'vessel charter contract',
        'marine charter',
      ],
    },
    es: {
      name: 'Acuerdo de Flete Marítimo',
      description:
        'Acuerdo para fletar embarcaciones para transporte marítimo.',
      aliases: ['contrato de fletamento', 'acuerdo naval'],
    },
  },
};
