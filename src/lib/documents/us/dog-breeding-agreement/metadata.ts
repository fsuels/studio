// src/lib/documents/us/dog-breeding-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DogBreedingAgreementSchema } from './schema';
import { dogBreedingAgreementQuestions } from './questions';

export const dogBreedingAgreementMeta: LegalDocument = {
  id: 'dog-breeding-agreement',
  jurisdiction: 'US',
  category: 'Agriculture & Farming',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/dog-breeding-agreement.md',
    es: '/templates/es/dog-breeding-agreement.md',
  },
  schema: DogBreedingAgreementSchema,
  questions: dogBreedingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Dog Breeding Agreement',
      description: 'Agreement for dog breeding and stud services.',
      aliases: ['stud service agreement', 'breeding contract'],
    },
    es: {
      name: 'Acuerdo de Cría de Perros',
      description: 'Acuerdo para cría de perros y servicios de semental.',
      aliases: ['contrato de cría', 'acuerdo de semental'],
    },
  },
};