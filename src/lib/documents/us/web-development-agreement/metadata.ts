import type { LegalDocument } from '@/types/documents';

export const webDevelopmentAgreementMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'web-development-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 30,
  states: 'all',
  templatePaths: {
    en: '/templates/en/web-development-agreement.md',
    es: '/templates/es/web-development-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Web Development Agreement',
      description:
        'Professional agreement for web development services between developer and client.',
      aliases: ['Website development contract', 'Web design agreement', 'Software development agreement'],
    },
    es: {
      name: 'Acuerdo de Desarrollo Web',
      description:
        'Acuerdo profesional para servicios de desarrollo web entre desarrollador y cliente.',
      aliases: ['Contrato desarrollo web', 'Acuerdo diseño web', 'Contrato desarrollo software'],
    },
  },
};