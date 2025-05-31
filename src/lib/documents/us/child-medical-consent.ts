import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const childMedicalConsent: LegalDocument = {
  id: 'child-medical-consent',
  category: 'Family',
  translations: {
    en: {
      name: 'Child Medical Consent Form',
      description:
        'Authorize a caregiver to make medical decisions for your child.',
    },
    es: {
      name: 'Formulario de Consentimiento Médico para Menores',
      description:
        'Autorizar a un cuidador a tomar decisiones médicas por su hijo.',
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 3,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [], // Placeholder
};
