// src/lib/documents/us/hipaa-authorization-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { HipaaAuthorizationFormSchema } from './schema';
import { hipaaAuthorizationFormQuestions } from './questions';

export const hipaaAuthorizationFormMeta: LegalDocument = {
  id: 'hipaa-authorization-form',
  jurisdiction: 'US',
  category: 'Healthcare & Medical',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/hipaa-authorization-form.md',
    es: '/templates/es/hipaa-authorization-form.md',
  },
  schema: HipaaAuthorizationFormSchema,
  questions: hipaaAuthorizationFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'HIPAA Authorization Form',
      description:
        'Form authorizing disclosure of protected health information under HIPAA.',
      aliases: [
        'medical records release',
        'health information authorization',
        'HIPAA release form',
      ],
    },
    es: {
      name: 'Formulario de Autorización HIPAA',
      description:
        'Formulario que autoriza la divulgación de información de salud protegida bajo HIPAA.',
      aliases: [
        'liberación de registros médicos',
        'autorización de información de salud',
      ],
    },
  },
};
