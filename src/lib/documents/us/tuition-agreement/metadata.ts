// src/lib/documents/us/tuition-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TuitionAgreementSchema } from './schema';
import { tuitionAgreementQuestions } from './questions';

export const tuitionAgreementMeta: LegalDocument = {
  id: 'tuition-agreement',
  jurisdiction: 'US',
  category: 'Academic & Research',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/tuition-agreement.md',
    es: '/templates/es/tuition-agreement.md',
  },
  schema: TuitionAgreementSchema,
  questions: tuitionAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Tuition Agreement',
      description: 'Agreement for educational tuition and payment terms.',
      aliases: ['tuition contract', 'education payment agreement'],
    },
    es: {
      name: 'Acuerdo de Matrícula',
      description: 'Acuerdo para matrícula educativa y términos de pago.',
      aliases: ['contrato de matrícula', 'acuerdo de pago educativo'],
    },
  },
};