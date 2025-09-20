// src/lib/documents/us/research-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ResearchAgreementSchema } from './schema';
import { researchAgreementQuestions } from './questions';

export const researchAgreementMeta: LegalDocument = {
  id: 'research-agreement',
  jurisdiction: 'US',
  category: 'Academic & Research',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/research-agreement.md',
    es: '/templates/es/research-agreement.md',
  },
  schema: ResearchAgreementSchema,
  questions: researchAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Research Agreement',
      description:
        'Agreement for research collaboration and academic research projects.',
      aliases: [
        'research collaboration agreement',
        'academic research contract',
        'study agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Investigación',
      description:
        'Acuerdo para colaboración de investigación y proyectos de investigación académica.',
      aliases: [
        'acuerdo de colaboración de investigación',
        'contrato de investigación académica',
        'acuerdo de estudio',
      ],
    },
  },
};
