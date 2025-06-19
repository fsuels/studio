// src/lib/documents/us/corporate-bylaws/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { corporateBylawsSchema } from './schema';
import { corporateBylawsQuestions } from './questions';

export const corporateBylawsMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'corporate-bylaws',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 30,
  states: 'all',
  templatePaths: {
    en: '/templates/en/corporate-bylaws.md',
    es: '/templates/es/corporate-bylaws.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Corporate Bylaws',
      description:
        'Establish governance rules and procedures for your corporation.',
      aliases: ['company bylaws', 'corporate governance', 'bylaws', 'corporate rules'],
    },
    es: {
      name: 'Estatutos Corporativos',
      description:
        'Establecer reglas de gobierno y procedimientos para su corporación.',
      aliases: ['estatutos de la empresa', 'gobierno corporativo', 'estatutos', 'reglas corporativas'],
    },
  },
};