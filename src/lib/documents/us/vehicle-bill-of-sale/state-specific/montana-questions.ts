import type { Question } from '@/types/documents';

// Montana-specific questions for MV-24 Bill of Sale
export const montanaVehicleBillOfSaleQuestions: Question[] = [
  // Vehicle Information
  {
    id: 'vehicle_year',
    label: 'Vehicle Year',
    type: 'number',
    required: true
  },
  {
    id: 'vehicle_make',
    label: 'Vehicle Make',
    type: 'text',
    required: true
  },
  {
    id: 'vehicle_model',
    label: 'Vehicle Model',
    type: 'text',
    required: true
  },
  {
    id: 'vehicle_vin',
    label: 'Vehicle VIN',
    type: 'text',
    required: true
  },
  {
    id: 'vehicle_color',
    label: 'Vehicle Color',
    type: 'text',
    required: true
  },

  // Seller Information
  {
    id: 'seller_name',
    label: 'Seller Name',
    type: 'text',
    required: true
  },
  {
    id: 'seller_address',
    label: 'Seller Address',
    type: 'address',
    required: true
  },

  // Buyer Information
  {
    id: 'buyer_name',
    label: 'Buyer Name',
    type: 'text',
    required: true
  },
  {
    id: 'buyer_address',
    label: 'Buyer Address',
    type: 'address',
    required: true
  },

  // Sale Information
  {
    id: 'sale_price',
    label: 'Sale Price',
    type: 'number',
    required: true
  },
  {
    id: 'sale_date',
    label: 'Date of Sale',
    type: 'date',
    required: true
  },

  // Odometer
  {
    id: 'odometer_reading',
    label: 'Odometer Reading',
    type: 'number',
    required: true
  },
  {
    id: 'odometer_status',
    label: 'Odometer Status',
    type: 'select',
    required: true,
    options: [
      { value: 'actual', label: 'Actual Mileage' },
      { value: 'exceeds', label: 'Exceeds Mechanical Limits' },
      { value: 'not_actual', label: 'Not Actual Mileage' }
    ]
  },

  // Notarization (Required in Montana)
  {
    id: 'notary_acknowledgment',
    label: 'Notarization Required in Montana',
    type: 'boolean',
    required: true
  }
];

export const montanaFieldMapping = {
  // These would need to be mapped based on actual MV-24 form fields
  'Year': 'vehicle_year',
  'Make': 'vehicle_make',
  'Model': 'vehicle_model',
  'VIN': 'vehicle_vin',
  'Color': 'vehicle_color',
  'Seller Name': 'seller_name',
  'Seller Address': 'seller_address',
  'Buyer Name': 'buyer_name',
  'Buyer Address': 'buyer_address',
  'Sale Price': 'sale_price',
  'Date': 'sale_date',
  'Odometer': 'odometer_reading'
};