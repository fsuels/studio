import type { FormQuestion } from '@/types/documents';

export const termSheetQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    required: true,
    placeholder: 'Enter the full legal name of the company',
    validation: { min: 1 }
  },
  {
    id: 'companyAddress',
    type: 'textarea',
    label: 'Company Address',
    required: true,
    placeholder: 'Enter the complete address of the company',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'businessDescription',
    type: 'textarea',
    label: 'Business Description',
    required: true,
    placeholder: 'Provide a brief description of the company\'s business',
    validation: { min: 20, max: 500 }
  },
  {
    id: 'investmentAmount',
    type: 'number',
    label: 'Investment Amount',
    required: true,
    validation: { min: 1 },
    placeholder: 'Enter the total investment amount in dollars'
  },
  {
    id: 'investmentType',
    type: 'select',
    label: 'Investment Type',
    required: true,
    options: [
      { value: 'equity', label: 'Equity Investment' },
      { value: 'convertible-debt', label: 'Convertible Debt' },
      { value: 'safe', label: 'SAFE (Simple Agreement for Future Equity)' },
      { value: 'debt', label: 'Debt Investment' }
    ]
  },
  {
    id: 'securityType',
    type: 'text',
    label: 'Security Type',
    required: true,
    placeholder: 'e.g., Series A Preferred Stock, Convertible Note',
    defaultValue: 'Preferred Stock'
  },
  {
    id: 'preMoneyValuation',
    type: 'number',
    label: 'Pre-Money Valuation',
    required: true,
    validation: { min: 0 },
    placeholder: 'Enter the pre-money valuation in dollars'
  },
  {
    id: 'postMoneyValuation',
    type: 'number',
    label: 'Post-Money Valuation',
    required: true,
    validation: { min: 0 },
    placeholder: 'Enter the post-money valuation in dollars'
  },
  {
    id: 'leadInvestor',
    type: 'text',
    label: 'Lead Investor',
    required: true,
    placeholder: 'Enter the name of the lead investor'
  },
  {
    id: 'investorType',
    type: 'select',
    label: 'Investor Type',
    required: true,
    options: [
      { value: 'individual', label: 'Individual Investor' },
      { value: 'venture-capital', label: 'Venture Capital' },
      { value: 'private-equity', label: 'Private Equity' },
      { value: 'angel', label: 'Angel Investor' },
      { value: 'strategic', label: 'Strategic Investor' }
    ]
  },
  {
    id: 'totalInvestors',
    type: 'number',
    label: 'Total Number of Investors',
    required: true,
    validation: { min: 1 }
  },
  {
    id: 'liquidationPreference',
    type: 'text',
    label: 'Liquidation Preference',
    required: false,
    defaultValue: '1x non-participating',
    placeholder: 'e.g., 1x non-participating, 2x participating'
  },
  {
    id: 'antiDilutionProvision',
    type: 'select',
    label: 'Anti-Dilution Provision',
    required: true,
    defaultValue: 'weighted-average',
    options: [
      { value: 'weighted-average', label: 'Weighted Average' },
      { value: 'full-ratchet', label: 'Full Ratchet' },
      { value: 'none', label: 'None' }
    ]
  },
  {
    id: 'boardComposition.totalSeats',
    type: 'number',
    label: 'Total Board Seats',
    required: true,
    validation: { min: 1 },
    defaultValue: 5
  },
  {
    id: 'boardComposition.investorSeats',
    type: 'number',
    label: 'Investor Board Seats',
    required: true,
    validation: { min: 0 },
    defaultValue: 2
  },
  {
    id: 'boardComposition.founderSeats',
    type: 'number',
    label: 'Founder Board Seats',
    required: true,
    validation: { min: 0 },
    defaultValue: 2
  },
  {
    id: 'boardComposition.independentSeats',
    type: 'number',
    label: 'Independent Board Seats',
    required: true,
    validation: { min: 0 },
    defaultValue: 1
  },
  {
    id: 'employeeStockPool',
    type: 'number',
    label: 'Employee Stock Option Pool (%)',
    required: false,
    validation: { min: 0, max: 100 },
    defaultValue: 10,
    placeholder: 'Enter percentage for employee stock options'
  },
  {
    id: 'stockPoolTiming',
    type: 'radio',
    label: 'Stock Pool Timing',
    required: true,
    defaultValue: 'post-money',
    options: [
      { value: 'pre-money', label: 'Pre-Money (pool created before investment)' },
      { value: 'post-money', label: 'Post-Money (pool created after investment)' }
    ]
  },
  {
    id: 'useOfFunds',
    type: 'array',
    label: 'Use of Funds',
    required: true,
    arrayConfig: {
      addButtonText: 'Add Use Category',
      minItems: 1,
      fields: [
        {
          id: 'category',
          type: 'text',
          label: 'Category',
          required: true,
          placeholder: 'e.g., Product Development, Marketing, Operations'
        },
        {
          id: 'amount',
          type: 'number',
          label: 'Amount ($)',
          required: true,
          validation: { min: 0 }
        },
        {
          id: 'percentage',
          type: 'number',
          label: 'Percentage (%)',
          required: true,
          validation: { min: 0, max: 100 }
        }
      ]
    }
  },
  {
    id: 'exclusivityPeriod',
    type: 'text',
    label: 'Exclusivity Period',
    required: false,
    defaultValue: '30 days',
    placeholder: 'e.g., 30 days, 45 days'
  },
  {
    id: 'closingTimeline',
    type: 'text',
    label: 'Closing Timeline',
    required: false,
    defaultValue: '60 days',
    placeholder: 'e.g., 60 days, 90 days'
  },
  {
    id: 'additionalTerms',
    type: 'textarea',
    label: 'Additional Terms',
    required: false,
    placeholder: 'Enter any additional terms or conditions',
    validation: { max: 1000 }
  },
  {
    id: 'termSheetDate',
    type: 'date',
    label: 'Term Sheet Date',
    required: true,
    helpText: 'Date this term sheet is issued'
  },
  {
    id: 'expirationDate',
    type: 'date',
    label: 'Expiration Date',
    required: true,
    helpText: 'Date when this term sheet expires'
  }
];