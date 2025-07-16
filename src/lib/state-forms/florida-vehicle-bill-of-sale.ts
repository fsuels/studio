import { FormField } from '@/components/document/DirectFormFillingInterface';

/**
 * FLORIDA VEHICLE BILL OF SALE (HSMV-82050)
 * 
 * This configuration defines the fields for the Florida official form.
 * Fields are ordered as they appear on the actual form for intuitive filling.
 */

export const floridaVehicleBillOfSaleFields: FormField[] = [
  // Vehicle Information Section (Top of Form)
  {
    id: 'vehicle_year',
    label: 'Vehicle Year',
    type: 'number',
    required: true,
    placeholder: 'e.g., 2020',
    validation: {
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    coordinates: {
      x: 100,
      y: 150,
      width: 80,
      height: 25,
      page: 1
    }
  },
  {
    id: 'vehicle_make',
    label: 'Vehicle Make',
    type: 'text',
    required: true,
    placeholder: 'e.g., Toyota, Ford, Honda',
    coordinates: {
      x: 200,
      y: 150,
      width: 120,
      height: 25,
      page: 1
    }
  },
  {
    id: 'vehicle_model',
    label: 'Vehicle Model',
    type: 'text',
    required: true,
    placeholder: 'e.g., Camry, F-150, Accord',
    coordinates: {
      x: 340,
      y: 150,
      width: 120,
      height: 25,
      page: 1
    }
  },
  {
    id: 'vehicle_body_type',
    label: 'Body Type',
    type: 'select',
    required: true,
    options: [
      'Sedan',
      'Coupe',
      'SUV',
      'Truck',
      'Convertible',
      'Hatchback',
      'Wagon',
      'Van',
      'Motorcycle',
      'Other'
    ],
    coordinates: {
      x: 480,
      y: 150,
      width: 100,
      height: 25,
      page: 1
    }
  },
  {
    id: 'vehicle_vin',
    label: 'Vehicle Identification Number (VIN)',
    type: 'text',
    required: true,
    placeholder: '17-character VIN',
    validation: {
      pattern: '^[A-HJ-NPR-Z0-9]{17}$'
    },
    coordinates: {
      x: 100,
      y: 180,
      width: 300,
      height: 25,
      page: 1
    }
  },
  {
    id: 'vehicle_color',
    label: 'Vehicle Color',
    type: 'text',
    required: true,
    placeholder: 'e.g., Blue, Red, Silver',
    coordinates: {
      x: 420,
      y: 180,
      width: 100,
      height: 25,
      page: 1
    }
  },

  // Seller Information Section
  {
    id: 'seller_name',
    label: 'Seller Full Legal Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full legal name as it appears on your ID',
    coordinates: {
      x: 100,
      y: 250,
      width: 250,
      height: 25,
      page: 1
    }
  },
  {
    id: 'seller_address',
    label: 'Seller Address',
    type: 'text',
    required: true,
    placeholder: 'Street address, city, state, ZIP',
    coordinates: {
      x: 100,
      y: 280,
      width: 400,
      height: 25,
      page: 1
    }
  },
  {
    id: 'seller_phone',
    label: 'Seller Phone Number',
    type: 'text',
    required: false,
    placeholder: '(555) 123-4567',
    coordinates: {
      x: 100,
      y: 310,
      width: 150,
      height: 25,
      page: 1
    }
  },

  // Buyer Information Section
  {
    id: 'buyer_name',
    label: 'Buyer Full Legal Name',
    type: 'text',
    required: true,
    placeholder: 'Enter buyer\'s full legal name',
    coordinates: {
      x: 100,
      y: 380,
      width: 250,
      height: 25,
      page: 1
    }
  },
  {
    id: 'buyer_address',
    label: 'Buyer Address',
    type: 'text',
    required: true,
    placeholder: 'Street address, city, state, ZIP',
    coordinates: {
      x: 100,
      y: 410,
      width: 400,
      height: 25,
      page: 1
    }
  },
  {
    id: 'buyer_phone',
    label: 'Buyer Phone Number',
    type: 'text',
    required: false,
    placeholder: '(555) 123-4567',
    coordinates: {
      x: 100,
      y: 440,
      width: 150,
      height: 25,
      page: 1
    }
  },

  // Transaction Details Section
  {
    id: 'sale_price',
    label: 'Sale Price',
    type: 'number',
    required: true,
    placeholder: 'Enter sale price in dollars',
    validation: {
      min: 0
    },
    coordinates: {
      x: 100,
      y: 500,
      width: 120,
      height: 25,
      page: 1
    }
  },
  {
    id: 'sale_date',
    label: 'Date of Sale',
    type: 'date',
    required: true,
    coordinates: {
      x: 240,
      y: 500,
      width: 120,
      height: 25,
      page: 1
    }
  },
  {
    id: 'payment_method',
    label: 'Payment Method',
    type: 'select',
    required: true,
    options: [
      'Cash',
      'Check',
      'Money Order',
      'Bank Transfer',
      'Credit Card',
      'Financing',
      'Trade-in',
      'Other'
    ],
    coordinates: {
      x: 380,
      y: 500,
      width: 120,
      height: 25,
      page: 1
    }
  },

  // Odometer Disclosure Section (Required by Federal Law)
  {
    id: 'odometer_reading',
    label: 'Odometer Reading (Miles)',
    type: 'number',
    required: true,
    placeholder: 'Current mileage',
    validation: {
      min: 0
    },
    coordinates: {
      x: 100,
      y: 570,
      width: 120,
      height: 25,
      page: 1
    }
  },
  {
    id: 'odometer_status',
    label: 'Odometer Status',
    type: 'select',
    required: true,
    options: [
      'Actual mileage',
      'NOT actual mileage - WARNING: Odometer discrepancy',
      'Exceeds mechanical limits'
    ],
    coordinates: {
      x: 240,
      y: 570,
      width: 260,
      height: 25,
      page: 1
    }
  },

  // Lien Information (if applicable)
  {
    id: 'lien_holder_name',
    label: 'Lien Holder Name (if applicable)',
    type: 'text',
    required: false,
    placeholder: 'Bank or finance company name',
    coordinates: {
      x: 100,
      y: 620,
      width: 200,
      height: 25,
      page: 1
    }
  },
  {
    id: 'lien_holder_address',
    label: 'Lien Holder Address (if applicable)',
    type: 'text',
    required: false,
    placeholder: 'Lien holder address',
    coordinates: {
      x: 320,
      y: 620,
      width: 200,
      height: 25,
      page: 1
    }
  },

  // Additional Information
  {
    id: 'additional_terms',
    label: 'Additional Terms or Conditions',
    type: 'text',
    required: false,
    placeholder: 'Any additional terms (optional)',
    coordinates: {
      x: 100,
      y: 670,
      width: 400,
      height: 25,
      page: 1
    }
  },

  // Notary Section (Required in Florida)
  {
    id: 'notary_acknowledgment',
    label: 'I understand this document must be notarized',
    type: 'select',
    required: true,
    options: [
      'Yes, I understand notarization is required',
      'No, I need more information about notarization'
    ],
    coordinates: {
      x: 100,
      y: 720,
      width: 300,
      height: 25,
      page: 1
    }
  }
];

export const floridaFormConfig = {
  state: 'FL',
  formName: 'Motor Vehicle Bill of Sale (HSMV-82050)',
  pdfUrl: '/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf',
  fields: floridaVehicleBillOfSaleFields,
  requiresNotary: true,
  basePrice: 19.95,
  description: 'Official Florida Department of Highway Safety and Motor Vehicles form for vehicle sales',
  legalRequirements: [
    'Must be notarized to be legally valid',
    'Required for vehicle registration in Florida',
    'Both buyer and seller must sign',
    'Odometer disclosure is federally required'
  ]
};