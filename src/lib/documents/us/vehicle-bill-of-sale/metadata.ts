// src/lib/documents/us/vehicle-bill-of-sale/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BillOfSaleSchema } from '@/lib/documents/us/vehicle-bill-of-sale/schema';
import { vehicleBillOfSaleQuestions } from './questions';

export const vehicleBillOfSaleMeta: LegalDocument = {
  id: 'vehicle-bill-of-sale',
  jurisdiction: 'US', // Ensure jurisdiction is set
  category: 'Finance', // Or "Transactions"
  languageSupport: ['en', 'es'],
  requiresNotarization: true, // Can be dynamic based on state in logic
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all', // Indicates available in all US states unless overridden
  // Standardized template paths
  templatePaths: {
    en: '/templates/en/vehicle-bill-of-sale.md',
    es: '/templates/es/vehicle-bill-of-sale.md',
  },
  requiresNotarizationStates: [
    'AZ',
    'KY',
    'LA',
    'MT',
    'NV',
    'OH',
    'OK',
    'PA',
    'WV',
    'WY',
  ], // States where notarization is mandatory
  schema: BillOfSaleSchema,
  questions: vehicleBillOfSaleQuestions,
  upsellClauses: [],
  // Direct name/description for fallbacks or non-i18n contexts
  translations: {
    // For i18n-heavy components or future use
    en: {
      name: 'Vehicle Bill of Sale',
      description:
        'Document the sale and transfer of ownership for a vehicle, compliant with state requirements.',
      aliases: [
        'sell car',
        'used item sale',
        'vehicle transfer',
        'car sale contract',
      ],
    },
    es: {
      name: 'Contrato de Compraventa de Vehículo',
      description:
        'Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.',
      aliases: [
        'venta de coche',
        'venta de artículo usado',
        'transferencia de vehículo',
        'contrato de venta de auto',
      ],
    },
  },
};
