// src/lib/documents/us/livestock-purchase-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LivestockPurchaseAgreementSchema } from './schema';
import { livestockPurchaseAgreementQuestions } from './questions';

export const livestockPurchaseAgreementMeta: LegalDocument = {
  id: 'livestock-purchase-agreement',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/livestock-purchase-agreement.md',
    es: '/templates/es/livestock-purchase-agreement.md',
  },
  schema: LivestockPurchaseAgreementSchema,
  questions: livestockPurchaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Livestock Purchase Agreement',
      description: 'Agreement for the purchase and sale of livestock animals.',
      aliases: [
        'cattle purchase agreement',
        'animal sale contract',
        'livestock bill of sale',
      ],
    },
    es: {
      name: 'Acuerdo de Compra de Ganado',
      description: 'Compra o vende ganado (vacas, caballos, cerdos, etc.) de manera segura. Incluye historial de salud, garantías y condiciones de entrega.',
      aliases: [
        'acuerdo de compra de ganado',
        'contrato de venta de animales',
        'bolsa de venta de ganado',
      ],
    },
  },
};
