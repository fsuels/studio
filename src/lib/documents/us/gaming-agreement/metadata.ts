// src/lib/documents/us/gaming-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { GamingAgreementSchema } from './schema';
import { gamingAgreementQuestions } from './questions';

export const gamingAgreementMeta: LegalDocument = {
  id: 'gaming-agreement',
  jurisdiction: 'US',
  category: 'Gaming & Esports',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/gaming-agreement.md',
    es: '/templates/es/gaming-agreement.md',
  },
  schema: GamingAgreementSchema,
  questions: gamingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Gaming Agreement',
      description:
        'Agreement for esports, gaming tournaments, and professional gaming contracts.',
      aliases: ['esports contract', 'gaming contract', 'tournament agreement'],
    },
    es: {
      name: 'Acuerdo de Gaming',
      description:
        'Acuerdo para esports, torneos de juegos y contratos de gaming profesional.',
      aliases: ['contrato de esports', 'acuerdo de torneo'],
    },
  },
};
