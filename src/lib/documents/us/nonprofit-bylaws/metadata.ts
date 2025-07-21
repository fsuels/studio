// src/lib/documents/us/nonprofit-bylaws/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NonprofitBylawsSchema } from './schema';
import { nonprofitBylawsQuestions } from './questions';

export const nonprofitBylawsMeta: LegalDocument = {
  id: 'nonprofit-bylaws',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/nonprofit-bylaws.md',
    es: '/templates/es/nonprofit-bylaws.md',
  },
  schema: NonprofitBylawsSchema,
  questions: nonprofitBylawsQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Nonprofit Bylaws',
      description:
        'Establish strong governance for your nonprofit organization with bylaws that ensure proper operations and compliance.',
      aliases: ['501c3 bylaws', 'charity bylaws', 'nonprofit constitution'],
    },
    es: {
      name: 'Estatutos de Organización Sin Fines de Lucro',
      description:
        'Estatutos para organizaciones sin fines de lucro y entidades caritativas.',
      aliases: ['estatutos 501c3', 'reglamento de ONG'],
    },
  },
};
