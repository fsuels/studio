// src/lib/documents/us/bill-of-sale-general/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { billOfSaleGeneralSchema } from './schema';
import { billOfSaleGeneralQuestions } from './questions';

export const billOfSaleGeneralMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'bill-of-sale-general',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/bill-of-sale-general.md',
    es: '/templates/es/bill-of-sale-general.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Bill of Sale',
      description:
        'Legal document transferring ownership of personal property from seller to buyer.',
      aliases: [
        'bill of sale',
        'sales receipt',
        'property transfer',
        'general bill of sale',
      ],
    },
    es: {
      name: 'Factura de Venta General',
      description:
        'Documento legal que transfiere la propiedad de bienes personales del vendedor al comprador.',
      aliases: [
        'factura de venta',
        'recibo de venta',
        'transferencia de propiedad',
        'factura general',
      ],
    },
  },
};
