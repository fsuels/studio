import type { LegalDocument } from '@/types/documents';

export const marketingAgreementMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'marketing-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/marketing-agreement.md',
    es: '/templates/es/marketing-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Marketing Agreement',
      description:
        'Agreement for marketing and promotional services between parties.',
      aliases: [
        'Marketing contract',
        'Promotional agreement',
        'Advertising agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Marketing',
      description:
        'Acuerdo para servicios de marketing y promoción entre las partes.',
      aliases: [
        'Contrato marketing',
        'Acuerdo promocional',
        'Contrato publicitario',
      ],
    },
  },
};
