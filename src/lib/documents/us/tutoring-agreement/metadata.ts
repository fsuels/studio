// src/lib/documents/us/tutoring-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TutoringAgreementSchema } from './schema';
import { tutoringAgreementQuestions } from './questions';

export const tutoringAgreementMeta: LegalDocument = {
  id: 'tutoring-agreement',
  jurisdiction: 'US',
  category: 'Academic & Research',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 13.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/tutoring-agreement.md',
    es: '/templates/es/tutoring-agreement.md',
  },
  schema: TutoringAgreementSchema,
  questions: tutoringAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Tutoring Agreement',
      description: 'Agreement for private tutoring and educational services.',
      aliases: ['private tutoring', 'academic tutoring', 'tutor contract'],
    },
    es: {
      name: 'Acuerdo de Tutoría',
      description: 'Acuerdo para tutoría privada y servicios educativos.',
      aliases: ['tutoría privada', 'tutoría académica'],
    },
  },
};