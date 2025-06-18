// src/lib/documents/us/mortgage-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MortgageAgreementSchema } from './schema';
import { mortgageAgreementQuestions } from './questions';

export const mortgageAgreementMeta: LegalDocument = {
  id: 'mortgage-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/mortgage-agreement.md',
    es: '/templates/es/mortgage-agreement.md',
  },
  schema: MortgageAgreementSchema,
  questions: mortgageAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mortgage Agreement',
      description: 'Legal agreement for home mortgage loan terms and conditions.',
      aliases: ['mortgage contract', 'home loan agreement', 'mortgage note'],
    },
    es: {
      name: 'Acuerdo de Hipoteca',
      description: 'Acuerdo legal para términos y condiciones de préstamo hipotecario.',
      aliases: ['contrato de hipoteca', 'acuerdo de préstamo'],
    },
  },
};