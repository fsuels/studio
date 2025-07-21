// src/lib/documents/us/agricultural-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AgriculturalAgreementSchema } from './schema';
import { agriculturalAgreementQuestions } from './questions';

export const agriculturalAgreementMeta: LegalDocument = {
  id: 'agricultural-agreement',
  jurisdiction: 'US',
  category: 'Agriculture & Farming',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/agricultural-agreement.md',
    es: '/templates/es/agricultural-agreement.md',
  },
  schema: AgriculturalAgreementSchema,
  questions: agriculturalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Agricultural Agreement',
      description:
        'Agreement for farming, agricultural services, and crop sharing arrangements.',
      aliases: [
        'farming agreement',
        'crop share agreement',
        'agricultural services contract',
      ],
    },
    es: {
      name: 'Acuerdo Agrícola',
      description:
        'Maximiza la rentabilidad de tu tierra agrícola y reduce riesgos operativos. Establece asociaciones que beneficien a todos los participantes.',
      aliases: ['acuerdo de agricultura', 'contrato de servicios agrícolas'],
    },
  },
};
