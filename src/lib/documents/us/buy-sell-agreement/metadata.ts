// src/lib/documents/us/buy-sell-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { buySellAgreementSchema } from './schema';
import { buySellAgreementQuestions } from './questions';

export const buySellAgreementMeta: LegalDocument = {
  id: 'buy-sell-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 45,
  states: 'all',
  templatePaths: {
    en: '/templates/en/buy-sell-agreement.md',
    es: '/templates/es/buy-sell-agreement.md',
  },
  schema: buySellAgreementSchema,
  questions: buySellAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Buy-Sell Agreement',
      description:
        'Plan for your business future by establishing how ownership transfers when partners retire, die, or leave the company.',
      aliases: [
        'buyout agreement',
        'business succession',
        'ownership transfer',
      ],
    },
    es: {
      name: 'Acuerdo de Compra-Venta',
      description:
        'Acuerdo que rige la transferencia de participaciones comerciales ante eventos desencadenantes.',
      aliases: [
        'acuerdo de compra',
        'sucesión empresarial',
        'transferencia de propiedad',
      ],
    },
  },
};
