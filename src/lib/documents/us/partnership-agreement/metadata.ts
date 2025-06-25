// src/lib/documents/us/partnership-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { partnershipAgreementSchema } from './schema';
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
  schema: partnershipAgreementSchema,
  questions: partnershipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Partnership Agreement',
      description:
        'Start a business with partners and avoid future conflicts. Define ownership, responsibilities, and what happens if someone leaves.',
      aliases: ['business partners', 'joint venture', 'partner terms'],
    },
    es: {
      name: 'Acuerdo de Sociedad',
      description:
        'Evita conflictos y protege tu inversión al iniciar un negocio con socios. Define claramente responsabilidades, aportaciones y reparto de ganancias.',
      aliases: ['socios de negocios', 'empresa conjunta', 'términos de socios'],
    },
  },
};
