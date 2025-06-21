import type { LegalDocument } from '@/types/documents';

export const endorsementAgreementMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'endorsement-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 35,
  states: 'all',
  templatePaths: {
    en: '/templates/en/endorsement-agreement.md',
    es: '/templates/es/endorsement-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Endorsement Agreement',
      description:
        'Agreement for celebrity, influencer, or spokesperson endorsement services.',
      aliases: [
        'Influencer agreement',
        'Spokesperson agreement',
        'Celebrity endorsement contract',
      ],
    },
    es: {
      name: 'Acuerdo de Patrocinio',
      description:
        'Acuerdo para servicios de patrocinio de celebridades, influencers o portavoces.',
      aliases: [
        'Acuerdo influencer',
        'Contrato portavoz',
        'Contrato patrocinio celebridad',
      ],
    },
  },
};
