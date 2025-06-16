import type { LegalDocumentMetadata } from '@/types/documents';

export const operatingAgreementMetadata: LegalDocumentMetadata = {
  category: 'Business',
  translations: {
    en: {
      name: 'Operating Agreement (LLC)',
      description:
        'Outline the ownership structure and operating procedures for an LLC.',
      aliases: ['LLC agreement', 'limited liability company'],
    },
    es: {
      name: 'Acuerdo Operativo (LLC)',
      description:
        'Esbozar la estructura de propiedad y los procedimientos operativos para una LLC.',
      aliases: ['acuerdo de LLC', 'sociedad de responsabilidad limitada'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7,
  states: 'all',
};