// src/lib/documents/us/pet-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PetAgreementSchema } from './schema';
import { petAgreementQuestions } from './questions';

export const petAgreementMeta: LegalDocument = {
  id: 'pet-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/pet-agreement.md',
    es: '/templates/es/pet-agreement.md',
  },
  schema: PetAgreementSchema,
  questions: petAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Pet Agreement',
      description:
        'Establish rules and responsibilities for pets in rental properties.',
      aliases: ['pet addendum', 'pet policy', 'pet lease addendum'],
    },
    es: {
      name: 'Acuerdo de Mascotas',
      description:
        'Establece reglas y responsabilidades para mascotas en propiedades de alquiler.',
      aliases: ['adenda de mascotas', 'política de mascotas'],
    },
  },
};
