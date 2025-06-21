// src/lib/documents/us/talent-management-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TalentManagementAgreementSchema } from './schema';
import { talentManagementAgreementQuestions } from './questions';

export const talentManagementAgreementMeta: LegalDocument = {
  id: 'talent-management-agreement',
  jurisdiction: 'US',
  category: 'Entertainment & Media',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/talent-management-agreement.md',
    es: '/templates/es/talent-management-agreement.md',
  },
  schema: TalentManagementAgreementSchema,
  questions: talentManagementAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Talent Management Agreement',
      description:
        'Agreement between talent and management for career representation.',
      aliases: [
        'artist management contract',
        'celebrity management agreement',
        'performer management deal',
      ],
    },
    es: {
      name: 'Acuerdo de Representación de Talento',
      description:
        'Acuerdo entre talento y representación para gestión de carrera.',
      aliases: ['contrato de management', 'acuerdo de representación'],
    },
  },
};
