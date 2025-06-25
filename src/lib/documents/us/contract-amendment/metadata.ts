// src/lib/documents/us/contract-amendment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ContractAmendmentSchema } from './schema';
import { contractAmendmentQuestions } from './questions';

export const contractAmendmentMeta: LegalDocument = {
  id: 'contract-amendment',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/contract-amendment.md',
    es: '/templates/es/contract-amendment.md',
  },
  schema: ContractAmendmentSchema,
  questions: contractAmendmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Contract Amendment',
      description:
        'Create a formal amendment to modify existing contract terms and conditions.',
      aliases: ['contract amendment', 'contract modification', 'addendum'],
    },
    es: {
      name: 'Enmienda de Contrato',
      description:
        'Cambia partes de un contrato existente sin tener que volver a escribir todo. Actualiza precios, fechas o condiciones.',
      aliases: ['enmienda de contrato', 'modificación de contrato', 'adenda'],
    },
  },
};
