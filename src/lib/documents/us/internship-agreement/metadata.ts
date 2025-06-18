// src/lib/documents/us/internship-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InternshipAgreementSchema } from './schema';
import { internshipAgreementQuestions } from './questions';

export const internshipAgreementMeta: LegalDocument = {
  id: 'internship-agreement',
  jurisdiction: 'US',
  category: 'Employment & HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/internship-agreement.md',
    es: '/templates/es/internship-agreement.md',
  },
  schema: InternshipAgreementSchema,
  questions: internshipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Internship Agreement',
      description: 'Agreement between company and intern for internship programs and work experience.',
      aliases: ['intern agreement', 'work experience agreement', 'student internship contract'],
    },
    es: {
      name: 'Acuerdo de Pasantía',
      description: 'Acuerdo entre empresa y pasante para programas de pasantía y experiencia laboral.',
      aliases: ['acuerdo de intern', 'contrato de experiencia laboral'],
    },
  },
};