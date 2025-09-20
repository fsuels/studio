// src/lib/documents/us/film-production-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FilmProductionAgreementSchema } from './schema';
import { filmProductionAgreementQuestions } from './questions';

export const filmProductionAgreementMeta: LegalDocument = {
  id: 'film-production-agreement',
  jurisdiction: 'US',
  category: 'Entertainment & Media',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/film-production-agreement.md',
    es: '/templates/es/film-production-agreement.md',
  },
  schema: FilmProductionAgreementSchema,
  questions: filmProductionAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Film Production Agreement',
      description:
        'Agreement for film and video production services and rights.',
      aliases: [
        'movie production contract',
        'video production agreement',
        'film contract',
      ],
    },
    es: {
      name: 'Acuerdo de Producción Cinematográfica',
      description:
        'Acuerdo para servicios de producción de películas y videos.',
      aliases: [
        'contrato de producción',
        'acuerdo cinematográfico',
        'contrato cinematográfico',
      ],
    },
  },
};
