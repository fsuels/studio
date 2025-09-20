// src/lib/documents/us/home-improvement-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { HomeImprovementContractSchema } from './schema';
import { homeImprovementContractQuestions } from './questions';

export const homeImprovementContractMeta: LegalDocument = {
  id: 'home-improvement-contract',
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
    en: '/templates/en/home-improvement-contract.md',
    es: '/templates/es/home-improvement-contract.md',
  },
  schema: HomeImprovementContractSchema,
  questions: homeImprovementContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Home Improvement Contract',
      description:
        'Comprehensive contract for home renovation, remodeling, and improvement projects.',
      aliases: [
        'renovation contract',
        'remodeling agreement',
        'contractor agreement',
      ],
    },
    es: {
      name: 'Contrato de Mejoras del Hogar',
      description:
        'Contrato integral para proyectos de renovación, remodelación y mejoras del hogar.',
      aliases: [
        'contrato de renovación',
        'acuerdo de remodelación',
        'acuerdo de contratista',
      ],
    },
  },
};
