import { usStates } from '@/lib/usStates';
import type { Question } from '@/types/documents';

// Florida-specific questions for HSMV-82050 form
export const floridaVehicleBillOfSaleQuestions: Question[] = [
  {
    id: 'document_type',
    label: 'Document Type',
    type: 'select',
    required: true,
    options: [
      { value: 'notice_of_sale', label: 'Notice of Sale (Seller only - sections 1 & 3)' },
      { value: 'bill_of_sale', label: 'Bill of Sale (Seller & Purchaser - sections 1, 2 & 3)' }
    ],
    tooltip: 'Choose whether this is a Notice of Sale or full Bill of Sale according to Florida requirements.'
  },

  // Section 1: Vehicle Information (Florida HSMV-82050 specific)
  {
    id: 'vehicle_year',
    label: 'Vehicle Year',
    type: 'number',
    required: true,
    placeholder: 'e.g., 2020'
  },
  {
    id: 'vehicle_make_manufacturer',
    label: 'Make/Manufacturer',
    type: 'text',
    required: true,
    placeholder: 'e.g., Toyota, Ford'
  },
  {
    id: 'vehicle_body_type',
    label: 'Body Type',
    type: 'text',
    required: true,
    placeholder: 'e.g., Sedan, SUV, Truck'
  },
  {
    id: 'vehicle_model',
    label: 'Model',
    type: 'text',
    required: true,
    placeholder: 'e.g., Camry, F-150'
  },
  {
    id: 'vehicle_color',
    label: 'Color',
    type: 'text',
    required: true,
    placeholder: 'e.g., Blue, White'
  },
  {
    id: 'vehicle_vin',
    label: 'Vehicle/Vessel Identification Number (VIN)',
    type: 'text',
    required: true,
    placeholder: '17-character VIN'
  },
  {
    id: 'current_title_issue_date',
    label: 'Current Title Issue Date',
    type: 'date',
    required: false,
    tooltip: 'Date when current title was issued (if known)'
  },

  // Section 2: Purchaser Information (Florida-specific terminology)
  {
    id: 'purchaser_names',
    label: 'Print Names of Purchaser(s)',
    type: 'text',
    required: true,
    tooltip: 'Full legal name(s) of the person(s) purchasing the vehicle'
  },
  {
    id: 'purchaser_address',
    label: 'Purchaser Address (City, State, Zip Code)',
    type: 'address',
    required: true,
    tooltip: 'Complete address of the purchaser'
  },
  {
    id: 'sale_price',
    label: 'Sale Price ($)',
    type: 'number',
    required: true,
    tooltip: 'Total purchase price of the vehicle'
  },

  // Section 3: Odometer Disclosure (Required for Motor Vehicles in Florida)
  {
    id: 'odometer_type',
    label: 'Odometer Type',
    type: 'select',
    required: true,
    options: [
      { value: '5_digit', label: '5-Digit Odometer' },
      { value: '6_digit', label: '6-Digit Odometer' }
    ]
  },
  {
    id: 'odometer_reading',
    label: 'Odometer Reading (miles)',
    type: 'number',
    required: true
  },
  {
    id: 'odometer_status',
    label: 'Odometer Status Certification',
    type: 'select',
    required: true,
    options: [
      { value: 'actual_mileage', label: 'Reflects the actual mileage' },
      { value: 'exceeds_limits', label: 'Is in excess of its mechanical limits' },
      { value: 'not_actual', label: 'Is not the actual mileage' }
    ]
  },

  // Seller Information (Florida-specific)
  {
    id: 'seller_printed_name',
    label: 'Seller\'s Printed Name',
    type: 'text',
    required: true
  },
  {
    id: 'seller_address_florida',
    label: 'Seller\'s Address (City, State, Zip Code)',
    type: 'address',
    required: true
  },
  {
    id: 'sale_date',
    label: 'Date of Sale',
    type: 'date',
    required: true
  },

  // Co-Seller (if applicable)
  {
    id: 'has_coseller',
    label: 'Is there a Co-Seller?',
    type: 'boolean',
    required: false
  },
  {
    id: 'coseller_printed_name',
    label: 'Co-Seller\'s Printed Name (when applicable)',
    type: 'text',
    required: false,
    conditional: {
      field: 'has_coseller',
      value: true
    }
  },
  {
    id: 'coseller_address',
    label: 'Co-Seller\'s Address (when applicable)',
    type: 'address',
    required: false,
    conditional: {
      field: 'has_coseller',
      value: true
    }
  },

  // Purchaser Signatures Section
  {
    id: 'purchaser_printed_name',
    label: 'Purchaser\'s Printed Name',
    type: 'text',
    required: true
  },
  {
    id: 'has_copurchaser',
    label: 'Is there a Co-Purchaser?',
    type: 'boolean',
    required: false
  },
  {
    id: 'copurchaser_printed_name',
    label: 'Co-Purchaser\'s Printed Name (when applicable)',
    type: 'text',
    required: false,
    conditional: {
      field: 'has_copurchaser',
      value: true
    }
  },

  // Optional Affidavit Section
  {
    id: 'affidavit_needed',
    label: 'Affidavit Required?',
    type: 'boolean',
    required: false,
    tooltip: 'Check if an affidavit is needed for special circumstances'
  },
  {
    id: 'affidavit_text_row1',
    label: 'Affidavit Text (Line 1)',
    type: 'text',
    required: false,
    conditional: {
      field: 'affidavit_needed',
      value: true
    }
  },
  {
    id: 'affidavit_text_row2',
    label: 'Affidavit Text (Line 2)',
    type: 'text',
    required: false,
    conditional: {
      field: 'affidavit_needed',
      value: true
    }
  }
];

// Field mapping for Florida HSMV-82050 PDF form
export const floridaFieldMapping = {
  // Document type checkboxes
  'Notice of Sale Seller must complete sections 1  3 The purchasers signature in section 3 is optional': 'document_type_notice',
  'Bill of Sale Seller and purchaser must complete sections 1 2 when applicable  3': 'document_type_bill',

  // Vehicle Information
  'Year': 'vehicle_year',
  'MakeManufacturer': 'vehicle_make_manufacturer',
  'Body Type': 'vehicle_body_type',
  'Model': 'vehicle_model',
  'Color': 'vehicle_color',
  'VehicleVessel Identification Number': 'vehicle_vin',
  'Current Title Issue Date': 'current_title_issue_date',

  // Purchaser Information
  'Print Names of Purchasers': 'purchaser_names',
  'Address City State Zip Code': 'purchaser_address',
  '2': 'sale_price', // Field index 2 is for sale price

  // Odometer
  '5 DIGIT OR': 'odometer_5digit_checkbox',
  '6 DIGIT ODOMETER NOW READS': 'odometer_6digit_checkbox',
  'undefined_2': 'odometer_reading', // The actual odometer reading field

  // Odometer Status
  '1 REFLECTS THE ACTUAL MILEAGE': 'odometer_actual_checkbox',
  '2 IS IN EXCESS OF ITS MECHANICAL LIMITS': 'odometer_exceeds_checkbox',
  '3 IS NOT THE ACTUAL MILEAGE': 'odometer_not_actual_checkbox',

  // Seller Information
  'Sellers Printed Name': 'seller_printed_name',
  'Sellers Address City State Zip Code': 'seller_address_florida',
  'Date': 'sale_date',

  // Co-Seller
  'CoSellers Printed Name when applicable': 'coseller_printed_name',
  'CoSellers Address when applicable City State Zip Code': 'coseller_address',
  'Date_2': 'coseller_date',

  // Purchaser Signatures
  'Purchasers Printed Name': 'purchaser_printed_name',
  'Date_3': 'purchaser_date',
  'CoPurchasers Printed name when applicable': 'copurchaser_printed_name',
  'Date_4': 'copurchaser_date',

  // Affidavit
  'Affidavit When applicableRow1': 'affidavit_text_row1',
  'Affidavit When applicableRow2': 'affidavit_text_row2'
};