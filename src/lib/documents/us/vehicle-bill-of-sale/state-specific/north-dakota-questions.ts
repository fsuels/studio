import type { Question } from '@/types/documents';

// North Dakota-specific questions for SFN-2888 Bill of Sale
export const northDakotaVehicleBillOfSaleQuestions: Question[] = [
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
    id: 'vehicle_style',
    label: 'Vehicle Style',
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

  // Notarization (Required in North Dakota)
  {
    id: 'notary_acknowledgment',
    label: 'Notarization Required in North Dakota',
    type: 'boolean',
    required: true
  }
];

export const northDakotaFieldMapping = {
  // These would need to be mapped based on actual SFN-2888 form fields
  'Year': 'vehicle_year',
  'Make': 'vehicle_make',
  'Model': 'vehicle_model',
  'VIN': 'vehicle_vin',
  'Style': 'vehicle_style',
  'Seller Name': 'seller_name',
  'Seller Address': 'seller_address',
  'Buyer Name': 'buyer_name',
  'Buyer Address': 'buyer_address',
  'Sale Price': 'sale_price',
  'Date': 'sale_date',
  'Odometer': 'odometer_reading'
};