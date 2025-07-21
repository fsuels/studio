import { usStates } from '@/lib/usStates';
import type { Question } from '@/types/documents';

export const vehicleBillOfSaleQuestions: Question[] = [
  {
    id: 'state',
    label: 'State of Sale (Governing Law & Notary)',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
    tooltip:
      'The U.S. state whose laws will govern this agreement and where notarization may occur.',
  },
  {
    id: 'seller_name',
    label: "Seller's Full Name",
    type: 'text',
    required: true,
    tooltip:
      'Enter the full legal name of the person or entity selling the vehicle.',
  },
  {
    id: 'seller_phone',
    label: "Seller's Phone Number",
    type: 'text',
    required: false,
    placeholder: '(XXX) XXX-XXXX',
    tooltip: 'A valid phone number for the seller.',
  },
  {
    id: 'seller2_name',
    label: "Second Seller's Full Name",
    type: 'text',
    required: false,
    conditional: {
      field: 'show_seller2',
      value: true
    },
    tooltip:
      'Optional second seller name if more than one person is selling the vehicle.',
  },
  {
    id: 'seller2_phone',
    label: "Second Seller's Phone Number",
    type: 'text',
    required: false,
    placeholder: '(XXX) XXX-XXXX',
    conditional: {
      field: 'show_seller2',
      value: true
    },
    tooltip: 'Phone number for the second seller, if applicable.',
  },
  {
    id: 'seller_address',
    label: "Seller's Full Address",
    type: 'address',
    required: true,
    tooltip: 'Include street, city, state, and ZIP code.',
  },
  {
    id: 'add_seller2_button',
    label: '+ Add Second Seller',
    type: 'button',
    required: false,
    buttonAction: 'toggle_show_seller2',
    conditional: {
      field: 'show_seller2',
      value: false
    },
    tooltip: 'Click to add a second seller if multiple people are selling the vehicle.',
  },
  {
    id: 'buyer_name',
    label: "Buyer's Full Name",
    type: 'text',
    required: true,
    tooltip:
      'Enter the full legal name of the person or entity buying the vehicle.',
  },
  {
    id: 'buyer_address',
    label: "Buyer's Full Address",
    type: 'address',
    required: true,
    tooltip: 'Include street, city, state, and ZIP code for the buyer.',
  },
  {
    id: 'add_buyer2_button',
    label: '+ Add Second Buyer',
    type: 'button',
    required: false,
    buttonAction: 'toggle_show_buyer2',
    conditional: {
      field: 'show_buyer2',
      value: false
    },
    tooltip: 'Click to add a second buyer if multiple people are purchasing the vehicle.',
  },
  {
    id: 'buyer_phone',
    label: "Buyer's Phone Number",
    type: 'text',
    required: false,
    placeholder: '(XXX) XXX-XXXX',
    tooltip: 'A valid phone number for the buyer.',
  },
  {
    id: 'buyer2_name',
    label: "Second Buyer's Full Name",
    type: 'text',
    required: false,
    conditional: {
      field: 'show_buyer2',
      value: true
    },
    tooltip:
      'Optional second buyer name if more than one person is purchasing the vehicle.',
  },
  {
    id: 'buyer2_phone',
    label: "Second Buyer's Phone Number",
    type: 'text',
    required: false,
    placeholder: '(XXX) XXX-XXXX',
    conditional: {
      field: 'show_buyer2',
      value: true
    },
    tooltip: 'Phone number for the second buyer, if applicable.',
  },
  {
    id: 'year',
    label: 'Vehicle Year',
    type: 'number',
    placeholder: 'e.g., 2020',
    required: true,
    tooltip: 'The manufacturing year of the vehicle (e.g., 2022).',
  },
  {
    id: 'make',
    label: 'Vehicle Make',
    type: 'text',
    placeholder: 'e.g., Toyota',
    required: true,
    tooltip: 'The manufacturer of the vehicle (e.g., Honda, Ford).',
  },
  {
    id: 'model',
    label: 'Vehicle Model',
    type: 'text',
    placeholder: 'e.g., Camry',
    required: true,
    tooltip: 'The specific model of the vehicle (e.g., Civic, F-150).',
  },
  {
    id: 'body_type',
    label: 'Vehicle Body Type',
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
    ],
    tooltip: 'The body style/type of the vehicle being sold.',
  },
  {
    id: 'color',
    label: 'Vehicle Color',
    type: 'text',
    placeholder: 'e.g., Blue',
    required: true,
    tooltip: 'The primary color of the vehicle.',
  },
  {
    id: 'vin',
    label: 'Vehicle Identification Number (VIN)',
    type: 'text',
    required: true,
    tooltip: 'The 17-character unique identifier for the vehicle.',
  },
  {
    id: 'odometer',
    label: 'Odometer Reading (miles)',
    type: 'number',
    required: true,
    tooltip: "Current mileage shown on the vehicle's odometer.",
  },
  {
    id: 'odo_status',
    label: 'Odometer Status',
    type: 'select',
    required: true,
    options: [
      { value: 'ACTUAL', label: 'Actual Mileage' },
      { value: 'EXCEEDS', label: 'Exceeds Mechanical Limits' },
      { value: 'NOT_ACTUAL', label: 'Not Actual Mileage (Warning)' },
    ],
    tooltip:
      'Indicate if the odometer reading is accurate, has rolled over, or is known to be incorrect.',
  },
  {
    id: 'price',
    label: 'Sale Price ($)',
    type: 'number',
    required: true,
    tooltip: 'The total agreed-upon price for the vehicle in USD.',
  },
  {
    id: 'payment_method',
    label: 'Payment Method',
    type: 'select',
    required: false,
    options: [
      { value: 'cash', label: 'Cash' },
      { value: 'check', label: 'Check' },
      { value: 'wire', label: 'Wire Transfer' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'credit_card', label: 'Credit / Debit Card' },
    ],
    tooltip: 'How the buyer will pay or has paid for the vehicle.',
  },
  {
    id: 'sale_date',
    label: 'Date of Sale',
    type: 'date',
    required: true,
    tooltip: 'The date the sale is finalized.',
  },
  {
    id: 'title_number',
    label: 'Certificate of Title Number',
    type: 'text',
    required: false,
    placeholder: 'e.g., 123456789',
    tooltip: 'The certificate/title number from the current title document.',
  },
  {
    id: 'current_title_date',
    label: 'Current Title Issue Date',
    type: 'date',
    required: false,
    tooltip: 'The date when the current title was issued (if known).',
  },
  {
    id: 'existing_liens',
    label: 'Existing Liens (if any, otherwise leave blank or "None")',
    type: 'text',
    placeholder: 'e.g., None, or Loan with XYZ Bank',
    tooltip: 'Disclose any outstanding loans or claims against the vehicle.',
  },
  {
    id: 'as_is',
    label: 'Is the vehicle sold "as-is"?',
    type: 'boolean',
    required: true,
    tooltip:
      "Select 'Yes' if sold without warranties, 'No' if warranties are provided.",
  },
  {
    id: 'warranty_text',
    label: 'Warranty Details (if not "as-is")',
    type: 'textarea',
    placeholder: 'e.g., 30-day warranty on drivetrain (if applicable)',
    tooltip:
      "If warranties are offered, describe them here. This field is only active if 'Sold As-Is' is 'No'.",
  },
  {
    id: 'county',
    label: 'County (for Notary Acknowledgment)',
    type: 'text',
    required: false,
    tooltip:
      'The county within the state where the document is signed, typically for notarization purposes.',
  },
];
