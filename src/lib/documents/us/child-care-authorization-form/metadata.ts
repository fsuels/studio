// src/lib/documents/us/child-care-authorization-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ChildCareAuthorizationFormSchema } from './schema';
import { childCareAuthorizationFormQuestions } from './questions';

export const childCareAuthorizationFormMeta: LegalDocument = {
  id: 'child-care-authorization-form',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/child-care-authorization-form.md',
    es: '/templates/es/child-care-authorization-form.md',
  },
  schema: ChildCareAuthorizationFormSchema,
  questions: childCareAuthorizationFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Child Care Authorization Form',
      description: 'Authorization form for temporary child care and emergency decisions.',
      aliases: ['childcare authorization', 'temporary custody form'],
    },
    es: {
      name: 'Formulario de Autorización de Cuidado Infantil',
      description: 'Formulario de autorización para cuidado temporal y decisiones de emergencia.',
      aliases: ['autorización de cuidado infantil', 'formulario de custodia temporal'],
    },
  },
};