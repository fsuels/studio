// src/lib/documents/us/child-care-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChildCareContractSchema } from './schema';
import { childCareContractQuestions } from './questions';

export const childCareContractMeta: LegalDocument = {
  id: 'child-care-contract',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/child-care-contract.md',
    es: '/templates/es/child-care-contract.md',
  },
  schema: ChildCareContractSchema,
  questions: childCareContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Child Care Contract',
      description:
        'Agreement between parents and childcare provider for babysitting services.',
      aliases: [
        'babysitting contract',
        'nanny agreement',
        'childcare agreement',
      ],
    },
    es: {
      name: 'Contrato de Cuidado Infantil',
      description:
        'Contrata niñera o cuidadora para tus hijos. Cubre tarifas, horarios, reglas de la casa y qué hacer en emergencias.',
      aliases: ['contrato de niñera', 'acuerdo de cuidado de niños'],
    },
  },
};
