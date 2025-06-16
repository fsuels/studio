import type { LegalDocumentMetadata } from '@/types/documents';

export const serviceAgreementMetadata: LegalDocumentMetadata = {
  category: 'Business',
  translations: {
    en: {
      name: 'Service Agreement',
      description: 'Outline terms for providing or receiving ongoing services.',
      aliases: ['hire services', 'service provider', 'payment terms'],
    },
    es: {
      name: 'Acuerdo de Servicios',
      description:
        'Esbozar términos para proporcionar o recibir servicios continuos.',
      aliases: [
        'contratar servicios',
        'proveedor de servicios',
        'términos de pago',
      ],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
};