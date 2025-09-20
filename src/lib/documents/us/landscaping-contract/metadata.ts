// src/lib/documents/us/landscaping-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LandscapingContractSchema } from './schema';
import { landscapingContractQuestions } from './questions';

export const landscapingContractMeta: LegalDocument = {
  id: 'landscaping-contract',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 17.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/landscaping-contract.md',
    es: '/templates/es/landscaping-contract.md',
  },
  schema: LandscapingContractSchema,
  questions: landscapingContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Landscaping Contract',
      description:
        'Professional contract for landscaping services including design, installation, and maintenance work.',
      aliases: [
        'landscape design contract',
        'yard work agreement',
        'garden services contract',
      ],
    },
    es: {
      name: 'Contrato de Paisajismo',
      description:
        'Contrato profesional para servicios de paisajismo incluyendo diseño, instalación y trabajo de mantenimiento.',
      aliases: [
        'contrato de diseño de paisaje',
        'acuerdo de trabajo de jardín',
        'contrato de servicios de jardín',
      ],
    },
  },
};
