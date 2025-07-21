// src/lib/documents/us/medical-consent-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MedicalConsentFormSchema } from './schema';
import { medicalConsentFormQuestions } from './questions';

export const medicalConsentFormMeta: LegalDocument = {
  id: 'medical-consent-form',
  jurisdiction: 'US',
  category: 'Healthcare & Medical',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/medical-consent-form.md',
    es: '/templates/es/medical-consent-form.md',
  },
  schema: MedicalConsentFormSchema,
  questions: medicalConsentFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Medical Consent Form',
      description:
        'Form granting permission for medical treatment or procedures.',
      aliases: [
        'medical authorization form',
        'treatment consent form',
        'healthcare consent',
      ],
    },
    es: {
      name: 'Formulario de Consentimiento Médico',
      description:
        'Da permiso para que doctores realicen tratamientos, operaciones o procedimientos médicos. Usado en hospitales y clínicas.',
      aliases: [
        'formulario de autorización médica',
        'consentimiento de tratamiento',
      ],
    },
  },
};
