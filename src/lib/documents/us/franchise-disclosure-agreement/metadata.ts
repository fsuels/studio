// src/lib/documents/us/franchise-disclosure-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { FranchiseDisclosureAgreementSchema } from './schema';
import { franchiseDisclosureAgreementQuestions } from './questions';

export const franchiseDisclosureAgreementMeta: LegalDocument = {
  id: 'franchise-disclosure-agreement',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 49.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/franchise-disclosure-agreement.md',
    es: '/templates/es/franchise-disclosure-agreement.md',
  },
  schema: FranchiseDisclosureAgreementSchema,
  questions: franchiseDisclosureAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Franchise Disclosure Agreement',
      description: 'Comprehensive franchise disclosure document and agreement for franchisors and franchisees.',
      aliases: ['fdd', 'franchise agreement', 'franchising contract'],
    },
    es: {
      name: 'Acuerdo de Divulgación de Franquicia',
      description: 'Documento completo de divulgación y acuerdo de franquicia.',
      aliases: ['contrato de franquicia', 'acuerdo de franquiciamiento'],
    },
  },
};