// src/lib/documents/us/sale-of-goods/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { saleOfGoodsSchema } from './schema';
import { saleOfGoodsQuestions } from './questions';

export const saleOfGoodsMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'sale-of-goods',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/sale-of-goods.md',
    es: '/templates/es/sale-of-goods.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Sale of Goods Agreement',
      description:
        'Comprehensive agreement for the sale and purchase of physical goods.',
      aliases: ['goods purchase agreement', 'sales contract', 'product sale agreement'],
    },
    es: {
      name: 'Acuerdo de Venta de Bienes',
      description:
        'Acuerdo integral para la venta y compra de bienes físicos.',
      aliases: ['acuerdo de compra de bienes', 'contrato de ventas', 'acuerdo de venta de productos'],
    },
  },
};