// src/lib/documents/us/roofing-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RoofingContractSchema } from './schema';
import { roofingContractQuestions } from './questions';

export const roofingContractMeta: LegalDocument = {
  id: 'roofing-contract',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/roofing-contract.md',
    es: '/templates/es/roofing-contract.md',
  },
  schema: RoofingContractSchema,
  questions: roofingContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Roofing Contract',
      description:
        'Professional contract for roofing projects including repairs, replacements, and new installations.',
      aliases: [
        'roof repair contract',
        'roof replacement agreement',
        'roofing service contract',
      ],
    },
    es: {
      name: 'Contrato de Techado',
      description:
        'Contrato profesional para proyectos de techado incluyendo reparaciones, reemplazos e instalaciones nuevas.',
      aliases: [
        'contrato de reparación de techo',
        'acuerdo de reemplazo de techo',
      ],
    },
  },
};
