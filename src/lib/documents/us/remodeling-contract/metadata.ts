// src/lib/documents/us/remodeling-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RemodelingContractSchema } from './schema';
import { remodelingContractQuestions } from './questions';

export const remodelingContractMeta: LegalDocument = {
  id: 'remodeling-contract',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/remodeling-contract.md',
    es: '/templates/es/remodeling-contract.md',
  },
  schema: RemodelingContractSchema,
  questions: remodelingContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Home Remodeling Contract',
      description:
        'Contract for residential remodeling and renovation projects including kitchens, bathrooms, and room additions.',
      aliases: [
        'renovation contract',
        'home improvement contract',
        'remodel agreement',
      ],
    },
    es: {
      name: 'Contrato de Remodelación',
      description:
        'Contrato para proyectos de remodelación y renovación residencial incluyendo cocinas, baños y adiciones de habitaciones.',
      aliases: ['contrato de renovación', 'contrato de mejoras para el hogar'],
    },
  },
};
