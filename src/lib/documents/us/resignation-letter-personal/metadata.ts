// src/lib/documents/us/resignation-letter-personal/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ResignationLetterPersonalSchema } from './schema';
import { resignationLetterPersonalQuestions } from './questions';

export const resignationLetterPersonalMeta: LegalDocument = {
  id: 'resignation-letter-personal',
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
    en: '/templates/en/resignation-letter-personal.md',
    es: '/templates/es/resignation-letter-personal.md',
  },
  schema: ResignationLetterPersonalSchema,
  questions: resignationLetterPersonalQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Resignation Letter (Personal)',
      description:
        'Professional letter to formally resign from employment for personal reasons.',
      aliases: ['personal resignation letter', 'job resignation letter'],
    },
    es: {
      name: 'Carta de Renuncia (Personal)',
      description:
        'Carta profesional para renunciar formalmente al empleo por razones personales.',
      aliases: ['carta de renuncia personal', 'carta de renuncia laboral'],
    },
  },
};
