// src/lib/documents/us/purchase-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { purchaseAgreementSchema } from './schema';
import { purchaseAgreementQuestions } from './questions';

export const purchaseAgreementMeta: LegalDocument = {
  id: 'purchase-agreement',
  jurisdiction: 'US',
  category: 'Sales',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/purchase-agreement.md',
    es: '/templates/es/us/purchase-agreement.md',
  },
  schema: purchaseAgreementSchema,
  questions: purchaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Purchase Agreement',
      description:
        'Create a legally binding General Purchase Agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'general purchase contract',
        'purchase contract',
        'buying agreement',
      ],
    },
    es: {
      name: 'Acuerdo General de Compra',
      description:
        'Compra o vende cualquier propiedad con términos claros. Protege tanto al comprador como al vendedor definiendo precio, condiciones y detalles de cierre.',
      aliases: [
        'contrato general de compra',
        'contrato de compra',
        'acuerdo de compra',
      ],
    },
  },
};
