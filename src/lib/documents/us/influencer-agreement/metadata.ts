// src/lib/documents/us/influencer-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InfluencerAgreementSchema } from './schema';
import { influencerAgreementQuestions } from './questions';

export const influencerAgreementMeta: LegalDocument = {
  id: 'influencer-agreement',
  jurisdiction: 'US',
  category: 'Marketing & Advertising',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/influencer-agreement.md',
    es: '/templates/es/influencer-agreement.md',
  },
  schema: InfluencerAgreementSchema,
  questions: influencerAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Influencer Agreement',
      description:
        'Professional agreement for influencer marketing partnerships and brand collaborations.',
      aliases: [
        'brand partnership agreement',
        'influencer contract',
        'social media collaboration agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Influencer',
      description:
        'Acuerdo profesional para asociaciones de marketing de influencers y colaboraciones de marca.',
      aliases: ['acuerdo de colaboración de marca', 'contrato de influencer'],
    },
  },
};
