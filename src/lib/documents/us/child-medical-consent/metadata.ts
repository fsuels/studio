// src/lib/documents/us/child-medical-consent/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChildMedicalConsentSchema } from './schema';
import { childMedicalConsentQuestions } from './questions';

export const childMedicalConsentMeta: LegalDocument = {
  id: 'child-medical-consent',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 3,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/child-medical-consent.md',
    es: '/templates/es/us/child-medical-consent.md',
  },
  schema: ChildMedicalConsentSchema,
  questions: childMedicalConsentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Child Medical Consent Form',
      description:
        'Authorize a caregiver to make medical decisions for your child.',
      aliases: [],
    },
    es: {
      name: 'Formulario de Consentimiento Médico para Menores',
      description:
        'Autoriza a abuela, niñera o familiar a llevar tu hijo al doctor y tomar decisiones médicas de emergencia.',
      aliases: [],
    },
  },
};
