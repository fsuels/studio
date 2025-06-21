// src/lib/documents/us/environmental-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EnvironmentalAgreementSchema } from './schema';
import { environmentalAgreementQuestions } from './questions';

export const environmentalAgreementMeta: LegalDocument = {
  id: 'environmental-agreement',
  jurisdiction: 'US',
  category: 'Environmental & Energy',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/environmental-agreement.md',
    es: '/templates/es/environmental-agreement.md',
  },
  schema: EnvironmentalAgreementSchema,
  questions: environmentalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Environmental Agreement',
      description:
        'Agreement for environmental compliance, conservation, and sustainability projects.',
      aliases: [
        'environmental compliance agreement',
        'conservation agreement',
        'sustainability contract',
      ],
    },
    es: {
      name: 'Acuerdo Ambiental',
      description:
        'Acuerdo para cumplimiento ambiental, conservación y proyectos de sostenibilidad.',
      aliases: ['acuerdo de cumplimiento ambiental', 'acuerdo de conservación'],
    },
  },
};
