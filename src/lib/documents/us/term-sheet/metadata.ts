import type { LegalDocument } from '@/types/documents';

export const termSheetMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'term-sheet',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 50,
  states: 'all',
  templatePaths: {
    en: '/templates/en/term-sheet.md',
    es: '/templates/es/term-sheet.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Investment Term Sheet',
      description:
        'Non-binding agreement outlining key terms and conditions for investment funding rounds.',
      aliases: ['Term sheet', 'Investment term sheet', 'Funding term sheet'],
    },
    es: {
      name: 'Hoja de Términos de Inversión',
      description:
        'Acuerdo no vinculante que describe los términos y condiciones clave para rondas de financiación de inversión.',
      aliases: [
        'Hoja de términos',
        'Términos de inversión',
        'Términos de financiación',
      ],
    },
  },
};
