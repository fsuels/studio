import type { LegalDocumentMetadata } from '@/types/documents';

export const partnershipAgreementMetadata: LegalDocumentMetadata = {
  category: 'Business',
  translations: {
    en: {
      name: 'Partnership Agreement',
      description:
        'Define the terms, responsibilities, and profit sharing for business partners.',
      aliases: ['business partners', 'joint venture', 'partner terms'],
    },
    es: {
      name: 'Acuerdo de Sociedad',
      description:
        'Definir los términos, responsabilidades y reparto de beneficios para socios comerciales.',
      aliases: ['socios de negocios', 'empresa conjunta', 'términos de socios'],
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