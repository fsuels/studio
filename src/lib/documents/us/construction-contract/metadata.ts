// src/lib/documents/us/construction-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ConstructionContractSchema } from './schema';
import { constructionContractQuestions } from './questions';

export const constructionContractMeta: LegalDocument = {
  id: 'construction-contract',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/construction-contract.md',
    es: '/templates/es/construction-contract.md',
  },
  schema: ConstructionContractSchema,
  questions: constructionContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Construction Contract',
      description:
        'Complete your construction project on time and budget. Protect against shoddy work with performance guarantees and clear expectations.',
      aliases: [
        'building contract',
        'general contractor agreement',
        'construction agreement',
      ],
    },
    es: {
      name: 'Contrato de Construcción',
      description:
        'Protege tu inversión en construcción y evita sobrecostos inesperados. Asegura trabajo de calidad con cronogramas claros y responsabilidades definidas.',
      aliases: [
        'contrato de construcción',
        'acuerdo de contratista general',
        'acuerdo de construcción',
      ],
    },
  },
};
