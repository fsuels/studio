import type { LegalDocumentMetadata } from '@/types/documents';

export const powerOfAttorneyMetadata: LegalDocumentMetadata = {
  jurisdiction: 'US',
  category: 'Personal',
  templatePaths: {
    en: '/templates/en/power-of-attorney.md',
    es: '/templates/es/power-of-attorney.md'
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Power of Attorney',
      description:
        'Authorize someone to act on your behalf for financial or general matters.',
      aliases: [
        'represent me',
        'act on my behalf',
        'authorize someone',
        'financial poa',
      ],
    },
    es: {
      name: 'Poder Notarial General',
      description:
        'Autorizar a alguien para actuar en su nombre en asuntos financieros o generales.',
      aliases: [
        'representarme',
        'actuar en mi nombre',
        'autorizar a alguien',
        'poder financiero',
      ],
    },
  },
};