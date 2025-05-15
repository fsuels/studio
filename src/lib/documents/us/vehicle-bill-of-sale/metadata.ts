// src/lib/documents/us/vehicle-bill-of-sale/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BillOfSaleSchema } from '@/schemas/billOfSale';
import { vehicleBillOfSaleQuestions } from './questions'; // Import questions

export const vehicleBillOfSaleMeta: LegalDocument = {
  id: 'bill-of-sale-vehicle',
  name: 'Vehicle Bill of Sale',
  name_es: 'Contrato de Compraventa de Vehículo',
  category: 'Finance',
  description: 'Document the sale and transfer of ownership for a vehicle, compliant with state requirements.',
  description_es: 'Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.',
  aliases: ['sell car', 'used item sale', 'vehicle transfer', 'car sale contract'],
  aliases_es: ['venta de coche', 'venta de artículo usado', 'transferencia de vehículo', 'contrato de venta de auto'],
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePath: '/templates/en/us/bill-of-sale-vehicle.md',
  templatePath_es: '/templates/es/us/bill-of-sale-vehicle.md',
  requiresNotarizationStates: ['AZ','KY','LA','MT','NV','OH','OK','PA','WV','WY'],
  schema: BillOfSaleSchema,
  questions: vehicleBillOfSaleQuestions, // Add questions here
  upsellClauses: [
    { id: 'includeNotaryLanguage', description: 'Include formal Notary Acknowledgment block', description_es: 'Incluir bloque formal de Reconocimiento Notarial', price: 2 }
  ]
};
