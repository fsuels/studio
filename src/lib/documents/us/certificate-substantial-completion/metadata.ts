// src/lib/documents/us/certificate-substantial-completion/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { certificatesubstantialcompletionSchema } from './schema';
import { certificatesubstantialcompletionQuestions } from './questions';

export const certificatesubstantialcompletionMeta: LegalDocument = {
  id: 'certificate-substantial-completion',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/certificate-substantial-completion.md',
    es: '/templates/es/certificate-substantial-completion.md',
  },
  schema: certificatesubstantialcompletionSchema,
  questions: certificatesubstantialcompletionQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Certificate of Substantial Completion',
      description: 'Official certificate documenting substantial completion of construction work for project milestone.',
      aliases: ['substantial completion certificate', 'completion certificate', 'project completion document'],
    },
    es: {
      name: 'Certificado de Finalización Sustancial',
      description: 'Certificado oficial que documenta la finalización sustancial del trabajo de construcción para el hito del proyecto.',
      aliases: ['certificado de finalización sustancial', 'certificado de finalización'],
    },
  },
};