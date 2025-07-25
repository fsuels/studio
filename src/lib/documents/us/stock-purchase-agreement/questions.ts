import type { FormQuestion } from '@/types/documents';

export const stockPurchaseAgreementQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    required: true,
    placeholder: 'Enter the full legal name of the company',
    validation: { min: 1 },
  },
  {
    id: 'stateOfIncorporation',
    type: 'select',
    label: 'State of Incorporation',
    required: true,
    options: [
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' },
    ],
  },
  {
    id: 'sellerName',
    type: 'text',
    label: 'Seller Name',
    required: true,
    placeholder: 'Enter the full name of the seller',
    validation: { min: 1 },
  },
  {
    id: 'sellerAddress',
    type: 'textarea',
    label: 'Seller Address',
    required: true,
    placeholder: 'Enter the complete address of the seller',
    validation: { min: 10, max: 300 },
  },
  {
    id: 'sellerType',
    type: 'radio',
    label: 'Seller Type',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'entity', label: 'Business Entity' },
    ],
  },
  {
    id: 'buyerName',
    type: 'text',
    label: 'Buyer Name',
    required: true,
    placeholder: 'Enter the full name of the buyer',
    validation: { min: 1 },
  },
  {
    id: 'buyerAddress',
    type: 'textarea',
    label: 'Buyer Address',
    required: true,
    placeholder: 'Enter the complete address of the buyer',
    validation: { min: 10, max: 300 },
  },
  {
    id: 'buyerType',
    type: 'radio',
    label: 'Buyer Type',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'entity', label: 'Business Entity' },
    ],
  },
  {
    id: 'stockDetails.shareClass',
    type: 'text',
    label: 'Share Class',
    required: true,
    placeholder: 'e.g., Common Stock, Preferred Stock',
    defaultValue: 'Common Stock',
  },
  {
    id: 'stockDetails.numberOfShares',
    type: 'number',
    label: 'Number of Shares',
    required: true,
    validation: { min: 1 },
    placeholder: 'Enter the number of shares being purchased',
  },
  {
    id: 'stockDetails.sharePrice',
    type: 'number',
    label: 'Price per Share',
    required: true,
    validation: { min: 0 },
    placeholder: 'Enter the price per share in dollars',
  },
  {
    id: 'stockDetails.totalPurchasePrice',
    type: 'number',
    label: 'Total Purchase Price',
    required: true,
    validation: { min: 0 },
    placeholder: 'Enter the total purchase price',
    helpText: 'This should equal number of shares × price per share',
  },
  {
    id: 'purchaseTerms.paymentMethod',
    type: 'select',
    label: 'Payment Method',
    required: true,
    options: [
      { value: 'cash', label: 'Cash' },
      { value: 'check', label: 'Check' },
      { value: 'wire-transfer', label: 'Wire Transfer' },
      { value: 'installments', label: 'Installment Payments' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'purchaseTerms.paymentSchedule',
    type: 'textarea',
    label: 'Payment Schedule',
    required: false,
    placeholder:
      'Describe the payment schedule (required for installment payments)',
    conditional: {
      field: 'purchaseTerms.paymentMethod',
      value: 'installments',
    },
  },
  {
    id: 'purchaseTerms.closingDate',
    type: 'date',
    label: 'Closing Date',
    required: true,
    helpText: 'Date when the transaction will be completed',
  },
  {
    id: 'purchaseTerms.closingLocation',
    type: 'text',
    label: 'Closing Location',
    required: true,
    placeholder: 'Where will the closing take place?',
  },
  {
    id: 'buyerRepresentations.accreditedInvestor',
    type: 'checkbox',
    label: 'Buyer is an Accredited Investor',
    required: false,
    defaultValue: false,
    helpText: 'Check if buyer meets accredited investor requirements',
  },
  {
    id: 'covenants.nonCompete',
    type: 'checkbox',
    label: 'Include Non-Compete Clause',
    required: false,
    defaultValue: false,
  },
  {
    id: 'covenants.nonCompetePeriod',
    type: 'text',
    label: 'Non-Compete Period',
    required: false,
    placeholder: 'e.g., 2 years',
    conditional: { field: 'covenants.nonCompete', value: true },
  },
  {
    id: 'covenants.confidentiality',
    type: 'checkbox',
    label: 'Include Confidentiality Clause',
    required: false,
    defaultValue: true,
  },
  {
    id: 'indemnification.indemnityPeriod',
    type: 'text',
    label: 'Indemnification Period',
    required: false,
    defaultValue: '2 years',
    placeholder: 'How long will indemnification last?',
  },
  {
    id: 'indemnification.escrowAmount',
    type: 'text',
    label: 'Escrow Amount',
    required: false,
    placeholder: 'Amount to be held in escrow (if any)',
  },
  {
    id: 'disputeResolution.method',
    type: 'select',
    label: 'Dispute Resolution Method',
    required: true,
    defaultValue: 'arbitration',
    options: [
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'mediation', label: 'Mediation' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
  },
  {
    id: 'disputeResolution.governingLaw',
    type: 'select',
    label: 'Governing Law',
    required: true,
    options: [
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' },
    ],
  },
  {
    id: 'additionalTerms',
    type: 'textarea',
    label: 'Additional Terms',
    required: false,
    placeholder: 'Enter any additional terms or provisions for this agreement',
    validation: { max: 1000 },
  },
  {
    id: 'agreementDate',
    type: 'date',
    label: 'Agreement Date',
    required: true,
    helpText: 'Date this stock purchase agreement is signed',
  },
  {
    id: 'notarization',
    type: 'checkbox',
    label: 'Require Notarization',
    required: false,
    defaultValue: true,
  },
];
