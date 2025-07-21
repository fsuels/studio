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
  // Comprehensive search keywords for intelligent discovery
  keywords: [
    // Primary vehicle terms
    'car', 'cars', 'vehicle', 'vehicles', 'auto', 'autos', 'automobile', 'automobiles', 'motor vehicle',
    // Vehicle types
    'sedan', 'coupe', 'suv', 'truck', 'pickup', 'van', 'minivan', 'hatchback', 'convertible', 'crossover',
    // Actions/intentions
    'buy', 'buying', 'purchase', 'purchasing', 'sell', 'selling', 'sale', 'transfer', 'ownership', 'title',
    // Conditions
    'used', 'new', 'pre-owned', 'certified', 'rebuilt', 'salvage', 'lemon',
    // Use cases
    'buying a car', 'selling a car', 'buying a used car', 'selling my car', 'car sale', 'auto sale',
    'vehicle purchase', 'vehicle transfer', 'car ownership', 'auto ownership', 'title transfer',
    // Legal terms
    'bill of sale', 'sales contract', 'purchase agreement', 'transfer document', 'proof of sale',
    'as-is sale', 'warranty', 'lien', 'lienholder', 'financing', 'trade-in',
    // Documentation
    'dmv', 'registration', 'pink slip', 'certificate of title', 'odometer', 'mileage', 'vin',
    // Transaction types
    'private party', 'dealer', 'trade', 'gift', 'inheritance', 'family transfer'
  ],
  keywords_es: [
    // Términos primarios de vehículos
    'carro', 'carros', 'coche', 'coches', 'vehículo', 'vehículos', 'automóvil', 'automóviles', 'auto', 'autos',
    // Tipos de vehículos
    'sedán', 'cupé', 'suv', 'camioneta', 'furgoneta', 'hatchback', 'convertible', 'crossover',
    // Acciones/intenciones
    'comprar', 'comprando', 'compra', 'vender', 'vendiendo', 'venta', 'transferir', 'propiedad', 'título',
    // Condiciones
    'usado', 'nueva', 'nuevo', 'seminuevo', 'certificado', 'reconstruido', 'siniestrado',
    // Casos de uso
    'comprando un carro', 'vendiendo un carro', 'comprando un auto usado', 'vendiendo mi carro', 'venta de carro',
    'venta de auto', 'compra de vehículo', 'transferencia de vehículo', 'propiedad de carro', 'transferencia de título',
    // Términos legales
    'contrato de compraventa', 'contrato de venta', 'acuerdo de compra', 'documento de transferencia', 'prueba de venta',
    'venta como está', 'garantía', 'gravamen', 'financiamiento', 'intercambio',
    // Documentación
    'registro', 'certificado de título', 'odómetro', 'millaje', 'vin', 'número de serie',
    // Tipos de transacción
    'particular', 'concesionario', 'comercio', 'regalo', 'herencia', 'transferencia familiar'
  ],
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
