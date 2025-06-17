// src/lib/documents/us/partnership-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PartnershipAgreementSchema } from './schema';
import { partnershipAgreementQuestions } from './questions';

export const partnershipAgreementMeta: LegalDocument = {
  id: 'partnership-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/partnership-agreement.md',
    es: '/templates/es/partnership-agreement.md',
  },
  schema: PartnershipAgreementSchema,
  questions: partnershipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Partnership Agreement',
      description:
        'Define the terms, responsibilities, and profit sharing for business partners.',
      aliases: ['business partners', 'joint venture', 'partner terms'],
    },
    es: {
      name: 'Acuerdo de Sociedad',
      description:
        'Definir los términos, responsabilidades y reparto de beneficios para socios comerciales.',
      aliases: ['socios de negocios', 'empresa conjunta', 'términos de socios'],
    },
  },
};