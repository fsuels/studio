// src/lib/documents/us/power-of-attorney/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PowerOfAttorneySchema } from './schema';
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
  schema: PowerOfAttorneySchema,
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
        'Autorizar a alguien para actuar en su nombre en asuntos financieros o generales.',
      aliases: [
        'representarme',
        'actuar en mi nombre',
        'autorizar a alguien',
        'poder financiero',
      ],
    },
  },
};