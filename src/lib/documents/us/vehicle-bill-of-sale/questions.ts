import { usStates } from '@/lib/document-library/utils';

export const vehicleBillOfSaleQuestions = [
  {
    id: 'sellers',
    label: 'Seller(s)',
    type: 'group-array',
    itemLabel: 'Seller',
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'address', label: 'Address', type: 'text', required: true },
      { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: '(XXX) XXX-XXXX' }
    ],
    minItems: 1,
    maxItems: 3
  },
  {
    id: 'buyers',
    label: 'Buyer(s)',
    type: 'group-array',
    itemLabel: 'Buyer',
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'address', label: 'Address', type: 'text', required: true },
      { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: '(XXX) XXX-XXXX' }
    ],
    minItems: 1,
    maxItems: 3
  },
  {
    id: "year",
    label: "Vehicle Year",
    type: "number",
    placeholder: "e.g., 2020",
    required: true,
    tooltip: "The manufacturing year of the vehicle (e.g., 2022)."
  },
  {
    id: "make",
    label: "Vehicle Make",
    type: "text",
    placeholder: "e.g., Toyota",
    required: true,
    tooltip: "The manufacturer of the vehicle (e.g., Honda, Ford)."
  },
  {
    id: "model",
    label: "Vehicle Model",
    type: "text",
    placeholder: "e.g., Camry",
    required: true,
    tooltip: "The specific model of the vehicle (e.g., Civic, F-150)."
  },
  {
    id: "color",
    label: "Vehicle Color",
    type: "text",
    placeholder: "e.g., Blue",
    required: true,
    tooltip: "The primary color of the vehicle."
  },
  {
    id: "vin",
    label: "Vehicle Identification Number (VIN)",
    type: "text",
    required: true,
    tooltip: "The 17-character unique identifier for the vehicle."
  },
  {
    id: "odometer",
    label: "Odometer Reading (miles)",
    type: "number",
    required: true,
    tooltip: "Current mileage shown on the vehicle's odometer."
  },
  {
    id: "odo_status",
    label: "Odometer Status",
    type: "select",
    required: true,
    options: [
      { value: "ACTUAL", label: "Actual Mileage" },
      { value: "EXCEEDS", label: "Exceeds Mechanical Limits" },
      { value: "NOT_ACTUAL", label: "Not Actual Mileage (Warning)" }
    ],
    tooltip: "Indicate if the odometer reading is accurate, has rolled over, or is known to be incorrect."
  },
  {
    id: "price",
    label: "Sale Price ($)",
    type: "number",
    required: true,
    tooltip: "The total agreed-upon price for the vehicle in USD."
  },
  {
    id: "payment_method",
    label: "Payment Method",
    type: "select",
    required: false,
    options: [
      { value: "cash", label: "Cash" },
      { value: "check", label: "Check" },
      { value: "wire", label: "Wire Transfer" },
      { value: "paypal", label: "PayPal" },
      { value: "credit_card", label: "Credit / Debit Card" }
    ],
    tooltip: "How the buyer will pay or has paid for the vehicle."
  },
  {
    id: "sale_date",
    label: "Date of Sale",
    type: "date",
    required: true,
    tooltip: "The date the sale is finalized."
  },
  {
    id: "existing_liens",
    label: 'Existing Liens (if any, otherwise leave blank or "None")',
    type: "text",
    placeholder: "e.g., None, or Loan with XYZ Bank",
    tooltip: "Disclose any outstanding loans or claims against the vehicle."
  },
  {
    id: "as_is",
    label: 'Is the vehicle sold "as-is"?',
    type: "boolean",
    required: true,
    tooltip: "Select 'Yes' if sold without warranties, 'No' if warranties are provided."
  },
  {
    id: "warranty_text",
    label: 'Warranty Details (if not "as-is")',
    type: "textarea",
    placeholder: "e.g., 30-day warranty on drivetrain (if applicable)",
    tooltip: "If warranties are offered, describe them here. This field is only active if 'Sold As-Is' is 'No'."
  },
  {
    id: "state",
    label: "State of Sale (Governing Law & Notary)",
    type: "select",
    required: true,
    options: usStates.map(s => ({ value: s.value, label: s.label })),
    tooltip: "The U.S. state whose laws will govern this agreement and where notarization may occur."
  },
  {
    id: "requireNotary",
    label: "Will this document be notarized?",
    type: "select",
    required: false,
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" }
    ],
    tooltip: "Some states require notarization to make the Bill of Sale enforceable."
  },
  {
    id: "witnessCount",
    label: "Number of Witnesses",
    type: "select",
    required: false,
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" }
    ],
    tooltip: "Some states require witness signatures to make this sale legally binding."
  },
  {
    id: "county",
    label: "County (for Notary Acknowledgment)",
    type: "text",
    required: false,
    tooltip: "The county within the state where the document is signed, typically for notarization purposes."
  }
];
