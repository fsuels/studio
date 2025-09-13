import type { Question } from '@/types/documents';

// Idaho-specific questions for ITD-3738 Bill of Sale
// Idaho requires notarization and has specific disclosure requirements
export const idahoVehicleBillOfSaleQuestions: Question[] = [
  // Vehicle Information Section
  {
    id: 'title_number',
    label: 'Title Number',
    type: 'text',
    required: false,
    tooltip: 'Current title number (if available)'
  },
  {
    id: 'vehicle_weight',
    label: 'Vehicle Weight (lbs)',
    type: 'number',
    required: false,
    tooltip: 'Gross vehicle weight in pounds'
  },
  {
    id: 'vehicle_dimensions',
    label: 'Full Length and Width',
    type: 'text',
    required: false,
    placeholder: 'e.g., 15ft x 6ft',
    tooltip: 'Overall dimensions for mobile homes/RVs'
  },
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
    id: 'vehicle_description',
    label: 'Vehicle Description',
    type: 'textarea',
    required: false,
    placeholder: 'Additional details about the vehicle',
    tooltip: 'Any additional description or special features'
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
    id: 'has_second_vin',
    label: 'Does this vehicle have a second VIN?',
    type: 'boolean',
    required: false,
    tooltip: 'Required for most motor homes and doublewide mobile/manufactured homes'
  },
  {
    id: 'second_vin',
    label: 'Second VIN',
    type: 'text',
    required: false,
    conditional: {
      field: 'has_second_vin',
      value: true
    },
    tooltip: 'Second VIN for motor homes and mobile/manufactured homes'
  },

  // Vehicle Condition/Brand Information
  {
    id: 'vehicle_brand_status',
    label: 'Vehicle Brand Status',
    type: 'select',
    required: false,
    options: [
      { value: 'none', label: 'No Special Brand' },
      { value: 'rebuilt_salvage', label: 'Rebuilt Salvage' },
      { value: 'previous_brand', label: 'Previous Brand' },
      { value: 'reconstruct', label: 'Reconstruct' },
      { value: 'repaired', label: 'Repaired' },
      { value: 'other', label: 'Other' }
    ],
    tooltip: 'Select any applicable brand status for the vehicle'
  },
  {
    id: 'other_brand_description',
    label: 'Other Brand Description',
    type: 'text',
    required: false,
    conditional: {
      field: 'vehicle_brand_status',
      value: 'other'
    },
    tooltip: 'Describe the other brand status'
  },

  // Odometer Information
  {
    id: 'odometer_reading',
    label: 'Odometer Reading',
    type: 'number',
    required: false,
    tooltip: 'Current mileage (if applicable)'
  },
  {
    id: 'odometer_status',
    label: 'Odometer Status',
    type: 'select',
    required: true,
    options: [
      { value: 'actual', label: 'Actual Miles' },
      { value: 'not_actual', label: 'Not Actual' },
      { value: 'exceeds', label: 'Exceeds Mechanical Limits' },
      { value: 'exempt', label: 'Exempt' },
      { value: 'no_odometer', label: 'No Odometer' }
    ],
    tooltip: 'Select the appropriate odometer status'
  },

  // Seller Information
  {
    id: 'seller_name',
    label: 'Seller\'s Full Legal Printed Name',
    type: 'text',
    required: true,
    tooltip: 'Complete legal name of the seller'
  },
  {
    id: 'seller_address',
    label: 'Seller Physical Address',
    type: 'address',
    required: true,
    tooltip: 'Physical address (not P.O. Box)'
  },
  {
    id: 'seller_id_number',
    label: 'Seller ID Number',
    type: 'text',
    required: true,
    placeholder: 'Driver\'s License # or SSN/EIN if business',
    tooltip: 'Idaho Driver\'s License Number or SSN/EIN if business'
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
    placeholder: 'ID'
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
    label: 'Buyer\'s Full Legal Printed Name',
    type: 'text',
    required: true,
    tooltip: 'Complete legal name of the buyer'
  },
  {
    id: 'buyer_address',
    label: 'Buyer Physical Address',
    type: 'address',
    required: true,
    tooltip: 'Physical address (not P.O. Box)'
  },
  {
    id: 'buyer_id_number',
    label: 'Buyer ID Number',
    type: 'text',
    required: true,
    placeholder: 'Driver\'s License # or SSN/EIN if business',
    tooltip: 'Idaho Driver\'s License Number or SSN/EIN if business'
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
    placeholder: 'ID'
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
    tooltip: 'Name of the bank or financial institution'
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

  // Notarization Information (Required in Idaho)
  {
    id: 'notary_acknowledgment',
    label: 'Notarization Requirement Acknowledgment',
    type: 'boolean',
    required: true,
    tooltip: 'I understand this document must be notarized in Idaho'
  },
  {
    id: 'notary_county',
    label: 'County where notarized',
    type: 'text',
    required: true,
    tooltip: 'County in Idaho where document will be notarized'
  },
  {
    id: 'notary_date',
    label: 'Notarization Date',
    type: 'date',
    required: false,
    tooltip: 'Date when document was notarized (leave blank until notarized)'
  }
];

// Field mapping for Idaho ITD-3738 PDF form
export const idahoFieldMapping = {
  'Title Number': 'title_number',
  'Weight': 'vehicle_weight',
  'Full Length and Width': 'vehicle_dimensions',
  'Vehicle Year': 'vehicle_year',
  'Vehicle Make': 'vehicle_make',
  'Vehicle Model': 'vehicle_model',
  'Description': 'vehicle_description',
  'Note Second VIN should be provided for most motor homes and must be entered for doublewide mobile and manufactured homes': 'second_vin',

  // Brand status checkboxes
  'Rebuilt Salvage': 'rebuilt_salvage_checkbox',
  'Previous Brand': 'previous_brand_checkbox',
  'Reconstruct': 'reconstruct_checkbox',
  'Repaired': 'repaired_checkbox',
  'Other': 'other_brand_description',

  // Odometer checkboxes
  'Actual Miles': 'odometer_actual_checkbox',
  'Not Actual': 'odometer_not_actual_checkbox',
  'Exceeds Mechanical Limits': 'odometer_exceeds_checkbox',
  'Exempt': 'odometer_exempt_checkbox',
  'No Odometer': 'odometer_no_checkbox',

  // Seller information
  'Sellers Full Legal Printed Name': 'seller_name',
  'Physical Address': 'seller_address',
  'Idaho Drivers License Number or SSN  EIN if Business': 'seller_id_number',
  'City': 'seller_city',
  'State': 'seller_state',

  // Buyer information
  'Buyers Full Legal Printed Name': 'buyer_name',
  // Note: Physical Address and City, State will be mapped for buyer section
  // Additional fields would need to be mapped based on the complete form structure
};

// Idaho-specific validation requirements
export const idahoSpecificValidation = {
  notary_acknowledgment: {
    required: true,
    message: 'You must acknowledge the notarization requirement in Idaho'
  },
  notary_county: {
    required: true,
    message: 'County is required for notarization in Idaho'
  },
  seller_id_number: {
    required: true,
    message: 'Seller ID number (Driver\'s License or SSN/EIN) is required'
  },
  buyer_id_number: {
    required: true,
    message: 'Buyer ID number (Driver\'s License or SSN/EIN) is required'
  },
  vehicle_year: {
    required: true,
    min: 1900,
    message: 'Valid vehicle year is required'
  }
};