// src/lib/documents/us/coaching-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CoachingAgreementSchema } from './schema';
import { coachingAgreementQuestions } from './questions';

export const coachingAgreementMeta: LegalDocument = {
  id: 'coaching-agreement',
  jurisdiction: 'US',
  category: 'Professional Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/coaching-agreement.md',
    es: '/templates/es/coaching-agreement.md',
  },
  schema: CoachingAgreementSchema,
  questions: coachingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Coaching Agreement',
      description: 'Agreement for professional coaching and mentoring services.',
      aliases: ['life coaching', 'business coaching', 'mentor agreement'],
    },
    es: {
      name: 'Acuerdo de Coaching',
      description: 'Acuerdo para servicios profesionales de coaching y mentoría.',
      aliases: ['coaching de vida', 'coaching empresarial'],
    },
  },
};