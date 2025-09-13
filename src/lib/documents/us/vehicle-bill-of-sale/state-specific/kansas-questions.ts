import type { Question } from '@/types/documents';

// Kansas-specific questions for TR-312 Bill of Sale
export const kansasVehicleBillOfSaleQuestions: Question[] = [
  // Seller Information
  {
    id: 'seller_name',
    label: 'Seller Name (Print)',
    type: 'text',
    required: true,
    tooltip: 'Full legal name of the seller'
  },
  {
    id: 'seller_address',
    label: 'Seller Street Address',
    type: 'text',
    required: true
  },
  {
    id: 'seller_city',
    label: 'Seller City',
    type: 'text',
    required: true
  },
  {
    id: 'seller_state',
    label: 'Seller State',
    type: 'text',
    required: true,
    placeholder: 'KS'
  },
  {
    id: 'seller_zip',
    label: 'Seller ZIP Code',
    type: 'text',
    required: true
  },

  // Buyer Information
  {
    id: 'buyer_name',
    label: 'Buyer Name (Print)',
    type: 'text',
    required: true,
    tooltip: 'Full legal name of the buyer'
  },
  {
    id: 'buyer_address',
    label: 'Buyer Street Address',
    type: 'text',
    required: true
  },
  {
    id: 'buyer_city',
    label: 'Buyer City',
    type: 'text',
    required: true
  },
  {
    id: 'buyer_state',
    label: 'Buyer State',
    type: 'text',
    required: true,
    placeholder: 'KS'
  },
  {
    id: 'buyer_zip',
    label: 'Buyer ZIP Code',
    type: 'text',
    required: true
  },

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

  // Notarization (Required in Kansas)
  {
    id: 'notary_acknowledgment',
    label: 'Notarization Required in Kansas',
    type: 'boolean',
    required: true
  }
];

export const kansasFieldMapping = {
  'PrintedNameSeller': 'seller_name',
  'Seller Street Address': 'seller_address',
  'Seller City': 'seller_city',
  'Seller State': 'seller_state',
  'Seller ZIP': 'seller_zip',
  'PrintedNameBuyer': 'buyer_name',
  'Buyer Street Address': 'buyer_address',
  'Buyer City': 'buyer_city',
  'Buyer State': 'buyer_state',
  'Buyer ZIP': 'buyer_zip',
  'Vehicle Year': 'vehicle_year',
  'Vehicle Make': 'vehicle_make',
  'Vehicle Model': 'vehicle_model',
  'Vehicle VIN': 'vehicle_vin',
  'Vehicle Color': 'vehicle_color',
  'Sale Price': 'sale_price',
  'Sale Date': 'sale_date',
  'Odometer': 'odometer_reading'
};