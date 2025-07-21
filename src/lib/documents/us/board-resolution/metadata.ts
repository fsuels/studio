import type { LegalDocument } from '@/types/documents';

export const boardResolutionMeta: Omit<LegalDocument, 'schema' | 'questions'> =
  {
    id: 'board-resolution',
    jurisdiction: 'US',
    category: 'Corporate',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 30,
    states: 'all',
    templatePaths: {
      en: '/templates/en/board-resolution.md',
      es: '/templates/es/board-resolution.md',
    },
    upsellClauses: [],
    translations: {
      en: {
        name: 'Corporate Board Resolution',
        description:
          "Formal document recording decisions made by a corporation's board of directors at a meeting.",
        aliases: [
          'Board resolution',
          'Directors resolution',
          'Corporate resolution',
        ],
      },
      es: {
        name: 'Resolución de Junta Directiva',
        description:
          'Formaliza decisiones corporativas importantes y cumple con requisitos legales. Protege a directores de responsabilidad personal por decisiones empresariales.',
        aliases: [
          'Resolución de junta',
          'Resolución de directores',
          'Resolución corporativa',
        ],
      },
    },
  };
