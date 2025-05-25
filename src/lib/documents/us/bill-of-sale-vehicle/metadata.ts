// src/lib/documents/us/bill-of-sale-vehicle/metadata.ts
import { z } from 'zod';
import { BillOfSaleSchema } from '@/schemas/billOfSale';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';
import { vehicleBillOfSaleQuestions } from './questions'; // Import questions
import { rules as stateRules } from '@/lib/compliance';

export const vehicleBillOfSaleMeta: LegalDocument = {
  id: "bill-of-sale-vehicle",
  jurisdiction: 'US',
  category: "Finance",
  languageSupport: ["en", "es"],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  // Explicit top-level name for ensureBasicTranslations
  name: "Vehicle Bill of Sale",
  name_es: "Contrato de Compraventa de Vehículo",
  description: "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
  description_es: "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
  aliases: ["sell car", "used item sale", "vehicle transfer", "car sale contract"],
  aliases_es: ["venta de coche", "venta de artículo usado", "transferencia de vehículo", "contrato de venta de auto"],
  translations: {
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
  },
  templatePath: '/templates/en/bill-of-sale-vehicle.md',
  templatePath_es: '/templates/es/bill-of-sale-vehicle.md',
  requiresNotarizationStates: ['AZ','KY','LA','MT','NV','OH','OK','PA','WV','WY'],
  compliance: stateRules,
  schema: BillOfSaleSchema,
  questions: vehicleBillOfSaleQuestions, // Assign imported questions
  upsellClauses: []
};

// Provide the canonical export name used throughout the app
export const billOfSaleVehicle = vehicleBillOfSaleMeta;

