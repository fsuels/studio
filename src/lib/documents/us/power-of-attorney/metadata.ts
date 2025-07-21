// src/lib/documents/us/power-of-attorney/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { powerOfAttorneySchema } from './schema';
import { powerOfAttorneyQuestions } from './questions';

export const powerOfAttorneyMeta: LegalDocument = {
  id: 'power-of-attorney',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/powerOfAttorney.md',
    es: '/templates/es/powerOfAttorney.md',
  },
  schema: powerOfAttorneySchema,
  questions: powerOfAttorneyQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Power of Attorney',
      description:
        'Maintain control over your affairs even when unavailable. Ensure trusted agents can act on your behalf in emergencies.',
      aliases: [
        'represent me',
        'act on my behalf',
        'authorize someone',
        'financial poa',
      ],
    },
    es: {
      name: 'Poder Notarial General',
      description:
        'Asegura que alguien de confianza pueda manejar tus finanzas y asuntos legales si te enfermas o viajas. Evita complicaciones familiares en emergencias.',
      aliases: [
        'representarme',
        'actuar en mi nombre',
        'autorizar a alguien',
        'poder financiero',
      ],
    },
  },
};
