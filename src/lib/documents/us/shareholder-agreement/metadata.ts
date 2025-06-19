import type { LegalDocument } from '@/types/documents';

export const shareholderAgreementMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'shareholder-agreement',
  jurisdiction: 'US',
  category: 'Corporate',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 40,
  states: 'all',
  templatePaths: {
    en: '/templates/en/shareholder-agreement.md',
    es: '/templates/es/shareholder-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Shareholder Agreement',
      description:
        'Agreement between company shareholders governing rights, responsibilities, and transfer of shares.',
      aliases: ['Shareholders agreement', 'Stock agreement', 'Equity agreement'],
    },
    es: {
      name: 'Acuerdo de Accionistas',
      description:
        'Acuerdo entre accionistas de la empresa que rige los derechos, responsabilidades y transferencia de acciones.',
      aliases: ['Acuerdo accionistas', 'Acuerdo de acciones', 'Acuerdo de capital'],
    },
  },
};