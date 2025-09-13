import type { Question } from '@/types/documents';

// Alabama-specific questions for MVT 32-13B Motor Vehicle Bill of Sale
// Alabama requires notarization and has specific disclosure requirements
export const alabamaVehicleBillOfSaleQuestions: Question[] = [
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
    placeholder: 'AL'
  },
  {
    id: 'seller_zip',
    label: 'Seller ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
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
    placeholder: 'AL'
  },
  {
    id: 'buyer_zip',
    label: 'Buyer ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
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

  // Odometer Information (Required in Alabama)
  {
    id: 'odometer_reading',
    label: 'Odometer Reading',
    type: 'number',
    required: true,
    tooltip: 'Current mileage shown on odometer'
  },
  {
    id: 'odometer_status',
    label: 'Odometer Disclosure',
    type: 'select',
    required: true,
    options: [
      { value: 'actual', label: 'Actual Mileage' },
      { value: 'exceeds', label: 'Exceeds Mechanical Limits' },
      { value: 'not_actual', label: 'Not Actual Mileage' }
    ],
    tooltip: 'Federal law requires odometer disclosure'
  },

  // Title Information
  {
    id: 'title_number',
    label: 'Certificate of Title Number',
    type: 'text',
    required: false,
    tooltip: 'Current title number (if available)'
  },
  {
    id: 'title_date',
    label: 'Title Date',
    type: 'date',
    required: false,
    tooltip: 'Date title was issued'
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

  // Warranty Information
  {
    id: 'sold_as_is',
    label: 'Vehicle sold "as is"?',
    type: 'boolean',
    required: true,
    tooltip: 'Check if vehicle is sold without warranties'
  },
  {
    id: 'warranty_details',
    label: 'Warranty Details (if not sold as-is)',
    type: 'textarea',
    required: false,
    conditional: {
      field: 'sold_as_is',
      value: false
    },
    tooltip: 'Describe any warranties or guarantees provided'
  },

  // Notarization Information (Required in Alabama)
  {
    id: 'notary_acknowledgment',
    label: 'Notarization Requirement Acknowledgment',
    type: 'boolean',
    required: true,
    tooltip: 'I understand this document must be notarized in Alabama'
  },
  {
    id: 'notary_county',
    label: 'County where notarized',
    type: 'text',
    required: true,
    tooltip: 'County in Alabama where document will be notarized'
  },
  {
    id: 'notary_date',
    label: 'Notarization Date',
    type: 'date',
    required: false,
    tooltip: 'Date when document was notarized (leave blank until notarized)'
  }
];

// Field mapping for Alabama MVT 32-13B PDF form
// Based on typical Alabama form structure - fields are named Text1, Text2, etc.
export const alabamaFieldMapping = {
  // These would need to be confirmed by examining the actual form layout
  'Text1': 'vehicle_year',
  'Text2': 'vehicle_make',
  'Text3': 'vehicle_model',
  'Text4': 'vehicle_vin',
  'Text5': 'vehicle_color',
  'Text6': 'vehicle_body_style',
  'Text7': 'seller_name',
  'Text8': 'seller_address',
  'Text9': 'seller_city',
  'Text10': 'seller_state',
  'Text11': 'seller_zip',
  'Text12': 'buyer_name',
  'Text13': 'buyer_address',
  'Text14': 'buyer_city',
  'Text15': 'buyer_state',
  'Text16': 'buyer_zip',
  'Text17': 'sale_price',
  'Text18': 'sale_date',
  'Text19': 'odometer_reading',
  'Text20': 'title_number',
  'Text21': 'title_date',
  'Text22': 'lienholder_name',
  'Text23': 'lienholder_address',
  'Text24': 'warranty_details',
  'Text25': 'notary_county',
  'Text26': 'notary_date',
  // Additional fields for second page
  'Text27': 'seller_signature_date',
  'Text28': 'buyer_signature_date',
  'Text29': 'notary_commission_expires',
  'Text30': 'notary_name',
  'Text31': 'additional_notes',
  'Text32': 'additional_info',
  'Text33': 'witness_name',
  'Text34': 'witness_address',
  'Text35': 'witness_signature_date',
  'Text36': 'additional_seller_info',
  'Text37': 'additional_buyer_info',
  'Text38': 'special_conditions',
  'Text39': 'form_completion_date',
  'Text40': 'dmv_use_only',
  'Text41': 'reference_number',
  'Text42': 'additional_documentation',
  // Checkboxes for odometer status
  'Check Box27': 'odometer_actual_checkbox',
  'Check Box28': 'odometer_exceeds_checkbox'
};

// Alabama-specific validation requirements
export const alabamaSpecificValidation = {
  notary_acknowledgment: {
    required: true,
    message: 'You must acknowledge the notarization requirement in Alabama'
  },
  notary_county: {
    required: true,
    message: 'County is required for notarization in Alabama'
  },
  odometer_reading: {
    required: true,
    min: 0,
    message: 'Valid odometer reading is required'
  },
  sale_price: {
    required: true,
    min: 0,
    message: 'Sale price must be specified'
  }
};