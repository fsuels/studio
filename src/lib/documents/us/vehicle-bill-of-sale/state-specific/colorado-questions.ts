import type { Question } from '@/types/documents';

// Colorado-specific questions for DR-2116 Motor Vehicle Bill of Sale
// Based on Colorado DMV Form DR-2116 field structure
export const coloradoVehicleBillOfSaleQuestions: Question[] = [
  // Vehicle Information Section
  {
    id: 'vehicle_year',
    label: 'Vehicle Year',
    type: 'number',
    required: true,
    placeholder: 'e.g., 2020',
    tooltip: 'Year the vehicle was manufactured'
  },
  {
    id: 'vehicle_make',
    label: 'Vehicle Make',
    type: 'text',
    required: true,
    placeholder: 'e.g., Toyota, Ford',
    tooltip: 'Manufacturer of the vehicle'
  },
  {
    id: 'vehicle_model',
    label: 'Vehicle Model',
    type: 'text',
    required: true,
    placeholder: 'e.g., Camry, F-150',
    tooltip: 'Specific model of the vehicle'
  },
  {
    id: 'vehicle_body_style',
    label: 'Body Style',
    type: 'select',
    required: true,
    options: [
      { value: 'Sedan', label: 'Sedan' },
      { value: 'SUV', label: 'SUV' },
      { value: 'Truck', label: 'Truck' },
      { value: 'Coupe', label: 'Coupe' },
      { value: 'Convertible', label: 'Convertible' },
      { value: 'Wagon', label: 'Wagon' },
      { value: 'Van', label: 'Van' },
      { value: 'Motorcycle', label: 'Motorcycle' },
      { value: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'vehicle_vin',
    label: 'Vehicle Identification Number (VIN)',
    type: 'text',
    required: true,
    placeholder: '17-character VIN',
    tooltip: 'Complete 17-character VIN'
  },
  {
    id: 'vehicle_color',
    label: 'Vehicle Color',
    type: 'text',
    required: true,
    placeholder: 'e.g., Blue, White'
  },

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
    label: 'Seller Address',
    type: 'address',
    required: true,
    tooltip: 'Complete address including street, city, state, and ZIP'
  },
  {
    id: 'seller_phone',
    label: 'Seller Phone Number',
    type: 'text',
    required: false,
    placeholder: '(XXX) XXX-XXXX'
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
    label: 'Buyer Address',
    type: 'address',
    required: true,
    tooltip: 'Complete address including street, city, state, and ZIP'
  },
  {
    id: 'buyer_phone',
    label: 'Buyer Phone Number',
    type: 'text',
    required: false,
    placeholder: '(XXX) XXX-XXXX'
  },

  // Sale Information
  {
    id: 'sale_price',
    label: 'Sale Price',
    type: 'number',
    required: true,
    tooltip: 'Total purchase price in dollars'
  },
  {
    id: 'sale_date',
    label: 'Date of Sale',
    type: 'date',
    required: true,
    tooltip: 'Date when the sale was completed'
  },

  // Odometer Information (Required in Colorado)
  {
    id: 'odometer_reading',
    label: 'Odometer Reading',
    type: 'number',
    required: true,
    tooltip: 'Current mileage shown on odometer'
  },
  {
    id: 'odometer_brand',
    label: 'Odometer Brand',
    type: 'select',
    required: true,
    options: [
      { value: 'NOT_ACTUAL', label: 'Not Actual Mileage' },
      { value: 'EXCEEDS', label: 'Exceeds Mechanical Limits' },
      { value: 'ACTUAL', label: 'Actual Mileage' }
    ],
    tooltip: 'Certification of odometer accuracy'
  },

  // Lienholder Information (if applicable)
  {
    id: 'has_lienholder',
    label: 'Is there a lienholder on this vehicle?',
    type: 'boolean',
    required: false,
    tooltip: 'Check if there is an outstanding loan on the vehicle'
  },
  {
    id: 'lienholder_name',
    label: 'Lienholder Name',
    type: 'text',
    required: false,
    conditional: {
      field: 'has_lienholder',
      value: true
    },
    tooltip: 'Name of the bank or financial institution holding the lien'
  },
  {
    id: 'lienholder_address',
    label: 'Lienholder Address',
    type: 'address',
    required: false,
    conditional: {
      field: 'has_lienholder',
      value: true
    },
    tooltip: 'Complete address of the lienholder'
  },

  // Additional Colorado-specific fields
  {
    id: 'title_number',
    label: 'Title Number',
    type: 'text',
    required: false,
    tooltip: 'Current title number (if available)'
  },
  {
    id: 'purged_record',
    label: 'Purged Colorado Record',
    type: 'boolean',
    required: false,
    tooltip: 'Check if this relates to a purged Colorado record'
  },

  // Notarization Information (Required in Colorado)
  {
    id: 'notary_county',
    label: 'County where notarized',
    type: 'text',
    required: true,
    tooltip: 'County in Colorado where document will be notarized'
  },
  {
    id: 'notary_date',
    label: 'Notarization Date',
    type: 'date',
    required: false,
    tooltip: 'Date when document was notarized'
  }
];

// Field mapping for Colorado DR-2116 PDF form
// Colorado uses numbered fields (1, 2, 3, etc.) so we need to map them correctly
export const coloradoFieldMapping = {
  // Based on typical Colorado DR-2116 form structure
  '1': 'vehicle_year',
  '2': 'vehicle_make',
  '3': 'vehicle_model',
  '4': 'vehicle_body_style',
  '5': 'vehicle_vin',
  '6': 'vehicle_color',
  '7': 'seller_name',
  '8': 'seller_address',
  '9': 'seller_phone',
  '10': 'buyer_name',
  '11': 'buyer_address',
  '12': 'buyer_phone',
  '13': 'sale_price',
  '14': 'sale_date',
  '15': 'odometer_reading',
  '16': 'odometer_brand',
  '17': 'lienholder_name',
  '18': 'lienholder_address',
  '19': 'title_number',
  '20': 'notary_county',
  '21': 'notary_date',
  'Purged Colorado Record': 'purged_record'
};

// Colorado-specific validation schema additions
export const coloradoSpecificValidation = {
  notary_county: {
    required: true,
    message: 'County is required for notarization in Colorado'
  },
  odometer_reading: {
    required: true,
    min: 0,
    message: 'Valid odometer reading is required in Colorado'
  },
  odometer_brand: {
    required: true,
    message: 'Odometer certification is required in Colorado'
  }
};