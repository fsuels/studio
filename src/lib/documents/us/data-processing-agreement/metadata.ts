// src/lib/documents/us/data-processing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DataProcessingAgreementSchema } from './schema';
import { dataProcessingAgreementQuestions } from './questions';

export const dataProcessingAgreementMeta: LegalDocument = {
  id: 'data-processing-agreement',
  jurisdiction: 'US',
  category: 'Technology & IT',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/data-processing-agreement.md',
    es: '/templates/es/data-processing-agreement.md',
  },
  schema: DataProcessingAgreementSchema,
  questions: dataProcessingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Data Processing Agreement',
      description: 'Agreement governing the processing and handling of personal data and information.',
      aliases: ['DPA', 'data handling agreement', 'privacy agreement'],
    },
    es: {
      name: 'Acuerdo de Procesamiento de Datos',
      description: 'Acuerdo que rige el procesamiento y manejo de datos personales e información.',
      aliases: ['DPA', 'acuerdo de manejo de datos'],
    },
  },
};