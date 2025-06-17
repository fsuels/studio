// src/lib/documents/us/employment-termination-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const employmentTerminationLetterMeta: LegalDocument = {
  id: 'employment-termination-letter',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employment-termination-letter.md',
    es: '/templates/es/employment-termination-letter.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employment Termination Letter',
      description: 'Formally notify an employee of their termination.',
      aliases: ['fire employee', 'layoff letter', 'termination notice'],
    },
    es: {
      name: 'Carta de Terminación de Empleo',
      description: 'Notificar formalmente a un empleado de su despido.',
      aliases: ['despedir empleado', 'carta de despido', 'aviso de terminación'],
    },
  },
};