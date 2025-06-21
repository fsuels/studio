// src/lib/documents/us/revolving-credit-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RevolvingCreditAgreementSchema } from './schema';
import { revolvingCreditAgreementQuestions } from './questions';

export const revolvingCreditAgreementMeta: LegalDocument = {
  id: 'revolving-credit-agreement',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 10,
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/revolving-credit-agreement.md',
    es: '/templates/es/revolving-credit-agreement.md',
  },
  schema: RevolvingCreditAgreementSchema,
  questions: revolvingCreditAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Revolving Credit Agreement',
      description:
        'Establish a revolving credit line with terms, limits, and payment requirements.',
      aliases: [
        'credit line agreement',
        'revolving loan',
        'line of credit',
        'credit facility',
      ],
    },
    es: {
      name: 'Acuerdo de Crédito Rotativo',
      description:
        'Establecer una línea de crédito rotativo con términos, límites y requisitos de pago.',
      aliases: [
        'acuerdo de línea de crédito',
        'préstamo rotativo',
        'línea de crédito',
        'facilidad de crédito',
      ],
    },
  },
};
