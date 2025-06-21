// src/lib/documents/us/limited-partnership-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { limitedPartnershipAgreementSchema } from './schema';
import { limitedPartnershipAgreementQuestions } from './questions';

export const limitedPartnershipAgreementMeta: LegalDocument = {
  id: 'limited-partnership-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 35,
  states: 'all',
  templatePaths: {
    en: '/templates/en/limited-partnership-agreement.md',
    es: '/templates/es/limited-partnership-agreement.md',
  },
  schema: limitedPartnershipAgreementSchema,
  questions: limitedPartnershipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Limited Partnership Agreement',
      description:
        'Agreement establishing a limited partnership with general and limited partners.',
      aliases: ['LP agreement', 'limited partnership', 'partnership formation'],
    },
    es: {
      name: 'Acuerdo de Sociedad Limitada',
      description:
        'Acuerdo que establece una sociedad limitada con socios generales y limitados.',
      aliases: ['acuerdo LP', 'sociedad limitada', 'formación de sociedad'],
    },
  },
};
