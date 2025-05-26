import { BillOfSaleSchema } from '@/lib/documents/us/vehicle-bill-of-sale/schema';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const billOfSaleVehicle: LegalDocument = {
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
  // Add these:
  name: "Vehicle Bill of Sale",
  name_es: "Contrato de Compraventa de Vehículo",
  description: "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
  description_es: "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
  aliases: ["sell car", "used item sale", "vehicle transfer", "car sale contract"],
  aliases_es: ["venta de coche", "venta de artículo usado", "transferencia de vehículo", "contrato de venta de auto"],
  templatePaths: {
    // Relative to /src/templates/
    en: "en/us/bill-of-sale-vehicle.md",
    es: "es/us/bill-of-sale-vehicle.md"
  },
  schema: BillOfSaleSchema,
  questions: [
    { id: 'seller_name', label: 'documents.us.bill-of-sale-vehicle.seller_name.label', type: 'text', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.seller_name.tooltip' },
    { id: 'seller_phone', label: 'documents.us.bill-of-sale-vehicle.seller_phone.label', type: 'text', required: false, placeholder: '(XXX) XXX-XXXX', tooltip: 'documents.us.bill-of-sale-vehicle.seller_phone.tooltip' },
    { id: 'seller2_name', label: 'documents.us.bill-of-sale-vehicle.seller2_name.label', type: 'text', required: false, tooltip: 'documents.us.bill-of-sale-vehicle.seller2_name.tooltip' },
    { id: 'seller2_phone', label: 'documents.us.bill-of-sale-vehicle.seller2_phone.label', type: 'text', required: false, placeholder: '(XXX) XXX-XXXX', tooltip: 'documents.us.bill-of-sale-vehicle.seller2_phone.tooltip' },
    { id: 'seller_address', label: 'documents.us.bill-of-sale-vehicle.seller_address.label', type: 'address', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.seller_address.tooltip' },
    { id: 'buyer_name', label: 'documents.us.bill-of-sale-vehicle.buyer_name.label', type: 'text', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.buyer_name.tooltip' },
    { id: 'buyer_address', label: 'documents.us.bill-of-sale-vehicle.buyer_address.label', type: 'address', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.buyer_address.tooltip' },
    { id: 'buyer_phone', label: 'documents.us.bill-of-sale-vehicle.buyer_phone.label', type: 'text', required: false, placeholder: '(XXX) XXX-XXXX', tooltip: 'documents.us.bill-of-sale-vehicle.buyer_phone.tooltip' },
    { id: 'buyer2_name', label: 'documents.us.bill-of-sale-vehicle.buyer2_name.label', type: 'text', required: false, tooltip: 'documents.us.bill-of-sale-vehicle.buyer2_name.tooltip' },
    { id: 'buyer2_phone', label: 'documents.us.bill-of-sale-vehicle.buyer2_phone.label', type: 'text', required: false, placeholder: '(XXX) XXX-XXXX', tooltip: 'documents.us.bill-of-sale-vehicle.buyer2_phone.tooltip' },
    { id: 'year', label: 'documents.us.bill-of-sale-vehicle.year.label', type: 'number', placeholder: 'e.g., 2020', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.year.tooltip' },
    { id: 'make', label: 'documents.us.bill-of-sale-vehicle.make.label', type: 'text', placeholder: 'e.g., Toyota', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.make.tooltip' },
    { id: 'model', label: 'documents.us.bill-of-sale-vehicle.model.label', type: 'text', placeholder: 'e.g., Camry', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.model.tooltip' },
    { id: 'color', label: 'documents.us.bill-of-sale-vehicle.color.label', type: 'text', placeholder: 'e.g., Blue', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.color.tooltip' },
    { id: 'vin', label: 'documents.us.bill-of-sale-vehicle.vin.label', type: 'text', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.vin.tooltip' },
    { id: 'odometer', label: 'documents.us.bill-of-sale-vehicle.odometer.label', type: 'number', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.odometer.tooltip' },
    {
      id: 'odo_status', label: 'documents.us.bill-of-sale-vehicle.odo_status.label', type: 'select', required: true, options: [
        { value: 'ACTUAL', label: 'Actual Mileage' }, 
        { value: 'EXCEEDS', label: 'Exceeds Mechanical Limits' },
        { value: 'NOT_ACTUAL', label: 'Not Actual Mileage (Warning)' }
      ], tooltip: 'documents.us.bill-of-sale-vehicle.odo_status.tooltip'
    },
    { id: 'price', label: 'documents.us.bill-of-sale-vehicle.price.label', type: 'number', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.price.tooltip' },
    {
      id: 'payment_method', label: 'documents.us.bill-of-sale-vehicle.payment_method.label', type: 'select', required: false, options: [
        { value: 'cash', label: 'Cash' }, { value: 'check', label: 'Check' }, { value: 'wire', label: 'Wire Transfer' },
        { value: 'paypal', label: 'PayPal' }, { value: 'credit_card', label: 'Credit / Debit Card' }
      ], tooltip: 'documents.us.bill-of-sale-vehicle.payment_method.tooltip'
    },
    { id: 'sale_date', label: 'documents.us.bill-of-sale-vehicle.sale_date.label', type: 'date', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.sale_date.tooltip' },
    { id: 'existing_liens', label: 'documents.us.bill-of-sale-vehicle.existing_liens.label', type: 'text', placeholder: 'e.g., None, or Loan with XYZ Bank', tooltip: 'documents.us.bill-of-sale-vehicle.existing_liens.tooltip' },
    { id: 'as_is', label: 'documents.us.bill-of-sale-vehicle.as_is.label', type: 'boolean', required: true, tooltip: 'documents.us.bill-of-sale-vehicle.as_is.tooltip' },
    { id: 'warranty_text', label: 'documents.us.bill-of-sale-vehicle.warranty_text.label', type: 'textarea', placeholder: 'e.g., 30-day warranty on drivetrain (if applicable)', tooltip: 'documents.us.bill-of-sale-vehicle.warranty_text.tooltip' },
    { id: 'state', label: 'documents.us.bill-of-sale-vehicle.state.label', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })), tooltip: 'documents.us.bill-of-sale-vehicle.state.tooltip' }, 
    { id: 'county', label: 'documents.us.bill-of-sale-vehicle.county.label', type: 'text', required: false, tooltip: 'documents.us.bill-of-sale-vehicle.county.tooltip' }
  ],
  upsellClauses: []
};