// src/lib/documents/us/insurance-claim-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InsuranceClaimFormSchema } from './schema';
import { insuranceClaimFormQuestions } from './questions';

export const insuranceClaimFormMeta: LegalDocument = {
  id: 'insurance-claim-form',
  jurisdiction: 'US',
  category: 'Risk & Liability',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/insurance-claim-form.md',
    es: '/templates/es/insurance-claim-form.md',
  },
  schema: InsuranceClaimFormSchema,
  questions: insuranceClaimFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Insurance Claim Form',
      description:
        'Form for filing insurance claims for various types of coverage.',
      aliases: ['claim form', 'insurance claim', 'claim application'],
    },
    es: {
      name: 'Formulario de Reclamo de Seguro',
      description:
        'Formulario para presentar reclamos de seguro para varios tipos de cobertura.',
      aliases: ['formulario de reclamo', 'solicitud de seguro'],
    },
  },
};
