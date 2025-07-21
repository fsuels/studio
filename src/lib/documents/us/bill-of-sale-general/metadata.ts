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
        'Protect your valuable sales and prevent future disputes when selling personal property. Provide legal proof of ownership transfer.',
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
        'Protege tu venta y evita disputas futuras al vender objetos valiosos. Proporciona prueba legal de ownership y términos de la transacción.',
      aliases: [
        'factura de venta',
        'recibo de venta',
        'transferencia de propiedad',
        'factura general',
      ],
    },
  },
};
