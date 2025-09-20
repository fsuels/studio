// src/lib/documents/us/franchise-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FranchiseAgreementSchema } from './schema';
import { franchiseAgreementQuestions } from './questions';

export const franchiseAgreementMeta: LegalDocument = {
  id: 'franchise-agreement',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/franchise-agreement.md',
    es: '/templates/es/franchise-agreement.md',
  },
  schema: FranchiseAgreementSchema,
  questions: franchiseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Franchise Agreement',
      description: 'Build your business empire by expanding through franchising with clear operational guidelines and brand protection.',
      aliases: [
        'franchise contract',
        'franchising agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Franquicia',
      description:
        'Acuerdo para operaciones comerciales y licencias de franquicia.',
      aliases: [
        'contrato de franquicia',
        'acuerdo de franquicia',
      ],
    },
  },
};
