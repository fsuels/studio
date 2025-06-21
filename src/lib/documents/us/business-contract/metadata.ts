// src/lib/documents/us/business-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BusinessContractSchema } from './schema';
import { businessContractQuestions } from './questions';

export const businessContractMeta: LegalDocument = {
  id: 'business-contract',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/business-contract.md',
    es: '/templates/es/business-contract.md',
  },
  schema: BusinessContractSchema,
  questions: businessContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Business Contract',
      description:
        'Create a comprehensive business contract for goods, services, or partnerships.',
      aliases: [
        'commercial contract',
        'business agreement',
        'commercial agreement',
      ],
    },
    es: {
      name: 'Contrato Comercial',
      description:
        'Crea un contrato comercial integral para bienes, servicios o asociaciones.',
      aliases: ['contrato de negocios', 'acuerdo comercial'],
    },
  },
};
