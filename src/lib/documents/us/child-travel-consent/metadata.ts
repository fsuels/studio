// src/lib/documents/us/child-travel-consent/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChildTravelConsentSchema } from './schema';
import { childTravelConsentQuestions } from './questions';

export const childTravelConsentMeta: LegalDocument = {
  id: 'child-travel-consent',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/child-travel-consent.md',
    es: '/templates/es/child-travel-consent.md',
  },
  schema: ChildTravelConsentSchema,
  questions: childTravelConsentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Child Travel Consent',
      description:
        'Consent form for minor children traveling without both parents.',
      aliases: [
        'minor travel consent',
        'child travel authorization',
        'travel permission letter',
      ],
    },
    es: {
      name: 'Consentimiento de Viaje de Menor',
      description:
        'Formulario de consentimiento para menores que viajan sin ambos padres.',
      aliases: [
        'consentimiento de viaje menor',
        'autorización de viaje infantil',
      ],
    },
  },
};
