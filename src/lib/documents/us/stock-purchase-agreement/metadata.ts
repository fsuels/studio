import type { LegalDocument } from '@/types/documents';

export const stockPurchaseAgreementMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'stock-purchase-agreement',
  jurisdiction: 'US',
  category: 'Corporate',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 35,
  states: 'all',
  templatePaths: {
    en: '/templates/en/stock-purchase-agreement.md',
    es: '/templates/es/stock-purchase-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Stock Purchase Agreement',
      description:
        'Agreement for the purchase and sale of company stock between parties.',
      aliases: [
        'Share purchase agreement',
        'Equity purchase agreement',
        'Stock sale agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Compra de Acciones',
      description:
        'Acuerdo para la compra y venta de acciones de la empresa entre las partes.',
      aliases: [
        'Acuerdo compra acciones',
        'Acuerdo venta acciones',
        'Compraventa acciones',
      ],
    },
  },
};
