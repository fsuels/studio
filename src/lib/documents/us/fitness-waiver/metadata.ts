// src/lib/documents/us/fitness-waiver/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FitnessWaiverSchema } from './schema';
import { fitnessWaiverQuestions } from './questions';

export const fitnessWaiverMeta: LegalDocument = {
  id: 'fitness-waiver',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/fitness-waiver.md',
    es: '/templates/es/fitness-waiver.md',
  },
  schema: FitnessWaiverSchema,
  questions: fitnessWaiverQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Fitness Waiver',
      description:
        'Liability waiver for fitness activities, gyms, and personal training.',
      aliases: [
        'gym waiver',
        'fitness liability waiver',
        'exercise waiver',
      ],
    },
    es: {
      name: 'Exención de Fitness',
      description:
        'Protege tu gimnasio o estudio de fitness de demandas si alguien se lastima durante ejercicios o entrenamiento.',
      aliases: [
        'exención de gimnasio',
        'renuncia de responsabilidad de ejercicio',
        'renuncia de ejercicio',
      ],
    },
  },
};
