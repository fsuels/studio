// src/lib/documents/us/social-media-management-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SocialMediaManagementAgreementSchema } from './schema';
import { socialMediaManagementAgreementQuestions } from './questions';

export const socialMediaManagementAgreementMeta: LegalDocument = {
  id: 'social-media-management-agreement',
  jurisdiction: 'US',
  category: 'Marketing & Advertising',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/social-media-management-agreement.md',
    es: '/templates/es/social-media-management-agreement.md',
  },
  schema: SocialMediaManagementAgreementSchema,
  questions: socialMediaManagementAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Social Media Management Agreement',
      description:
        'Professional agreement for social media marketing and management services between agency and client.',
      aliases: [
        'social media contract',
        'digital marketing agreement',
        'social media services contract',
      ],
    },
    es: {
      name: 'Acuerdo de Gestión de Redes Sociales',
      description:
        'Acuerdo profesional para servicios de marketing y gestión de redes sociales entre agencia y cliente.',
      aliases: ['contrato de redes sociales', 'acuerdo de marketing digital'],
    },
  },
};
