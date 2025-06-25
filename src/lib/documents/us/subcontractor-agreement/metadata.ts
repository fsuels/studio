// src/lib/documents/us/subcontractor-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SubcontractorAgreementSchema } from './schema';
import { subcontractorAgreementQuestions } from './questions';

export const subcontractorAgreementMeta: LegalDocument = {
  id: 'subcontractor-agreement',
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
    en: '/templates/en/subcontractor-agreement.md',
    es: '/templates/es/subcontractor-agreement.md',
  },
  schema: SubcontractorAgreementSchema,
  questions: subcontractorAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Subcontractor Agreement',
      description:
        'Complete construction projects efficiently with specialized expertise. Control costs by defining specific work scope.',
      aliases: [
        'subcontract agreement',
        'trade contractor agreement',
        'specialty contractor agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Subcontratista',
      description:
        'Contrata especialistas (electricistas, plomeros, etc.) para partes de un proyecto de construcción. Define trabajo, cronograma y pagos.',
      aliases: [
        'acuerdo de subcontrato',
        'contrato de contratista especializado',
      ],
    },
  },
};
