// src/lib/documents/us/partnership-dissolution-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { partnershipDissolutionAgreementSchema } from './schema';
import { partnershipDissolutionAgreementQuestions } from './questions';

export const partnershipDissolutionAgreementMeta: LegalDocument = {
  id: 'partnership-dissolution-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 30,
  states: 'all',
  templatePaths: {
    en: '/templates/en/partnership-dissolution-agreement.md',
    es: '/templates/es/partnership-dissolution-agreement.md',
  },
  schema: partnershipDissolutionAgreementSchema,
  questions: partnershipDissolutionAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Partnership Dissolution Agreement',
      description:
        'End your business partnership fairly by properly dividing assets and closing operations without disputes.',
      aliases: [
        'partnership termination',
        'business dissolution',
        'wind-up agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Disolución de Sociedad',
      description:
        'Acuerdo para disolver formalmente una sociedad y distribuir activos.',
      aliases: [
        'terminación de sociedad',
        'disolución de negocio',
        'acuerdo de liquidación',
      ],
    },
  },
};
