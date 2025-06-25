// src/lib/documents/us/corporate-bylaws/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { corporateBylawsSchema } from './schema';
import { corporateBylawsQuestions } from './questions';

export const corporateBylawsMeta: Omit<LegalDocument, 'schema' | 'questions'> =
  {
    id: 'corporate-bylaws',
    jurisdiction: 'US',
    category: 'Business',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 30,
    states: 'all',
    templatePaths: {
      en: '/templates/en/corporate-bylaws.md',
      es: '/templates/es/corporate-bylaws.md',
    },
    upsellClauses: [],
    translations: {
      en: {
        name: 'Corporate Bylaws',
        description:
          'Establish professional governance that attracts investors and ensures compliance. Run your corporation smoothly with clear operational rules.',
        aliases: [
          'company bylaws',
          'corporate governance',
          'bylaws',
          'corporate rules',
        ],
      },
      es: {
        name: 'Estatutos Corporativos',
        description:
          'Define las reglas internas de tu empresa corporativa. Cubre juntas directivas, votaciones, roles de ejecutivos y procedimientos operativos.',
        aliases: [
          'estatutos de la empresa',
          'gobierno corporativo',
          'estatutos',
          'reglas corporativas',
        ],
      },
    },
  };
