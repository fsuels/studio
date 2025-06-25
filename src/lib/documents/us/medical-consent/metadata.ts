// src/lib/documents/us/medical-consent/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { medicalConsentSchema } from './schema';
import { medicalConsentQuestions } from './questions';

export const medicalConsentMeta: LegalDocument = {
  id: 'medical-consent',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/child-medical-consent.md',
    es: '/templates/es/child-medical-consent.md',
  },
  schema: medicalConsentSchema,
  questions: medicalConsentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Medical Consent Form',
      description:
        'Create a legally binding Child Medical Consent Form with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'medical consent',
        'child medical form',
        'medical authorization',
      ],
    },
    es: {
      name: 'Formulario de Consentimiento Médico General',
      description:
        'Autoriza a alguien más a tomar decisiones médicas importantes por ti o tu familia en emergencias cuando no puedas decidir.',
      aliases: [
        'consentimiento médico',
        'formulario médico infantil',
        'autorización médica',
      ],
    },
  },
};
