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
        'Authorize someone to act on your behalf for financial or general matters.',
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
        'Da a alguien autoridad para manejar tus asuntos legales y financieros cuando no puedas. Esencial para emergencias y viajes.',
      aliases: [
        'representarme',
        'actuar en mi nombre',
        'autorizar a alguien',
        'poder financiero',
      ],
    },
  },
};
