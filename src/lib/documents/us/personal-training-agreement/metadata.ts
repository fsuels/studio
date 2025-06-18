// src/lib/documents/us/personal-training-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PersonalTrainingAgreementSchema } from './schema';
import { personalTrainingAgreementQuestions } from './questions';

export const personalTrainingAgreementMeta: LegalDocument = {
  id: 'personal-training-agreement',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/personal-training-agreement.md',
    es: '/templates/es/personal-training-agreement.md',
  },
  schema: PersonalTrainingAgreementSchema,
  questions: personalTrainingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Personal Training Agreement',
      description: 'Agreement between personal trainer and client for fitness training services.',
      aliases: ['fitness training contract', 'personal trainer agreement', 'training services contract'],
    },
    es: {
      name: 'Acuerdo de Entrenamiento Personal',
      description: 'Acuerdo entre entrenador personal y cliente para servicios de entrenamiento físico.',
      aliases: ['contrato de entrenamiento físico', 'acuerdo de entrenador personal'],
    },
  },
};