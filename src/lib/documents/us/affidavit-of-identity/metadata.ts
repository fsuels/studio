// src/lib/documents/us/affidavit-of-identity/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AffidavitOfIdentitySchema } from './schema';
import { affidavitOfIdentityQuestions } from './questions';

export const affidavitOfIdentityMeta: LegalDocument = {
  id: 'affidavit-of-identity',
  jurisdiction: 'US',
  category: 'Government & Legal Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/affidavit-of-identity.md',
    es: '/templates/es/affidavit-of-identity.md',
  },
  schema: AffidavitOfIdentitySchema,
  questions: affidavitOfIdentityQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Affidavit of Identity',
      description:
        'Sworn statement verifying identity for legal or administrative purposes.',
      aliases: ['identity affidavit', 'sworn identity statement'],
    },
    es: {
      name: 'Declaración Jurada de Identidad',
      description:
        'Declaración jurada que verifica la identidad para propósitos legales o administrativos.',
      aliases: ['declaración de identidad', 'declaración jurada de identidad'],
    },
  },
};
