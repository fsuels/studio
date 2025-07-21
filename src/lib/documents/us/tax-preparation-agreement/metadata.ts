// src/lib/documents/us/tax-preparation-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TaxPreparationAgreementSchema } from './schema';
import { taxPreparationAgreementQuestions } from './questions';

export const taxPreparationAgreementMeta: LegalDocument = {
  id: 'tax-preparation-agreement',
  jurisdiction: 'US',
  category: 'Professional Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/tax-preparation-agreement.md',
    es: '/templates/es/tax-preparation-agreement.md',
  },
  schema: TaxPreparationAgreementSchema,
  questions: taxPreparationAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Tax Preparation Agreement',
      description:
        'Professional agreement for tax preparation and filing services between preparer and client.',
      aliases: [
        'tax service agreement',
        'tax preparer contract',
        'tax filing agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Preparación de Impuestos',
      description:
        'Acuerdo profesional para servicios de preparación y presentación de impuestos entre preparador y cliente.',
      aliases: [
        'acuerdo de servicios fiscales',
        'contrato de preparador de impuestos',
      ],
    },
  },
};
