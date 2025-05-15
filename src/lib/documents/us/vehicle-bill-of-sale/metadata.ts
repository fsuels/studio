// src/lib/documents/us/vehicle-bill-of-sale/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BillOfSaleSchema } from '@/schemas/billOfSale'; // Assuming schema is in a central location or adjust path
import { vehicleBillOfSaleQuestions } from './questions'; 

export const vehicleBillOfSaleMeta: LegalDocument = {
  id: 'bill-of-sale-vehicle',
  jurisdiction: 'US', // Ensure jurisdiction is set
  category: "Finance", // Or "Transactions"
  languageSupport: ["en", "es"],
  requiresNotarization: true, // Can be dynamic based on state in logic
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all', // Indicates available in all US states unless overridden
  // Standardized template paths
  templatePath: '/templates/en/bill-of-sale-vehicle.md',
  templatePath_es: '/templates/es/bill-of-sale-vehicle.md',
  requiresNotarizationStates: ['AZ','KY','LA','MT','NV','OH','OK','PA','WV','WY'], // States where notarization is mandatory
  schema: BillOfSaleSchema,
  questions: vehicleBillOfSaleQuestions,
  upsellClauses: [
    { 
      id: 'includeNotaryLanguage', 
      description: 'Include formal Notary Acknowledgment block', 
      description_es: 'Incluir bloque formal de Reconocimiento Notarial', 
      price: 2 
    }
  ],
  // Direct name/description for fallbacks or non-i18n contexts
  name: "Vehicle Bill of Sale",
  name_es: "Contrato de Compraventa de Vehículo",
  description: "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
  description_es: "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
  aliases: ["sell car", "used item sale", "vehicle transfer", "car sale contract"],
  aliases_es: ["venta de coche", "venta de artículo usado", "transferencia de vehículo", "contrato de venta de auto"],
  translations: { // For i18n-heavy components or future use
    en: {
      name: "Vehicle Bill of Sale",
      description: "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
      aliases: ["sell car", "used item sale", "vehicle transfer", "car sale contract"]
    },
    es: {
      name: "Contrato de Compraventa de Vehículo",
      description: "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
      aliases: ["venta de coche", "venta de artículo usado", "transferencia de vehículo", "contrato de venta de auto"]
    }
  }
};
