// src/lib/documents/us/general-contractor-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { GeneralContractorAgreementSchema } from './schema';
import { generalContractorAgreementQuestions } from './questions';

export const generalContractorAgreementMeta: LegalDocument = {
  id: 'general-contractor-agreement',
  jurisdiction: 'US',
  category: 'Construction & Home Improvement',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/general-contractor-agreement.md',
    es: '/templates/es/general-contractor-agreement.md',
  },
  schema: GeneralContractorAgreementSchema,
  questions: generalContractorAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Contractor Agreement',
      description:
        'Comprehensive agreement for general contracting and construction management services.',
      aliases: [
        'gc agreement',
        'construction management contract',
        'prime contractor agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Contratista General',
      description:
        'Acuerdo integral para servicios de contratación general y gestión de construcción.',
      aliases: [
        'contrato de construcción general',
        'acuerdo de gestión de obra',
      ],
    },
  },
};
