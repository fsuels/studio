// src/lib/documents/us/job-application-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { JobApplicationFormSchema } from './schema';
import { jobApplicationFormQuestions } from './questions';

export const jobApplicationFormMeta: LegalDocument = {
  id: 'job-application-form',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/job-application-form.md',
    es: '/templates/es/job-application-form.md',
  },
  schema: JobApplicationFormSchema,
  questions: jobApplicationFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Job Application Form',
      description: 'Professional job application form for collecting candidate information.',
      aliases: ['employment application', 'hiring form', 'candidate application'],
    },
    es: {
      name: 'Formulario de Solicitud de Empleo',
      description: 'Formulario profesional de solicitud de empleo para recopilar información de candidatos.',
      aliases: ['solicitud de trabajo', 'formulario de contratación'],
    },
  },
};