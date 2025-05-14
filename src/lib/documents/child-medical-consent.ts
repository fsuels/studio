import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const childMedicalConsent: LegalDocument = {
  id: 'child-medical-consent',
  name: 'Child Medical Consent Form',
  name_es: 'Formulario de Consentimiento Médico para Menores',
  category: 'Family',
  description: 'Authorize a caregiver to make medical decisions for your child.',
  description_es: 'Autorizar a un cuidador a tomar decisiones médicas por su hijo.',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 3,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [] // Placeholder
};