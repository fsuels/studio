import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const privatePlacementMemorandumQuestions: Question[] = [
  {
    id: 'companyName',
    label: 'Company Legal Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Acme Technologies, Inc.',
  },
  {
    id: 'companyAddress',
    label: 'Company Principal Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'companyStateOfIncorporation',
    label: 'State of Incorporation',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
  {
    id: 'offeringType',
    label: 'Type of Securities Offered',
    type: 'select',
    required: true,
    options: [
      { value: 'equity', label: 'Common Stock/Equity' },
      { value: 'debt', label: 'Debt Securities' },
      { value: 'convertible', label: 'Convertible Securities' },
      { value: 'preferred_stock', label: 'Preferred Stock' },
    ],
  },
  {
    id: 'totalOfferingAmount',
    label: 'Total Offering Amount',
    type: 'text',
    required: true,
    placeholder: 'e.g., $2,000,000',
  },
  {
    id: 'minimumInvestment',
    label: 'Minimum Investment Amount',
    type: 'text',
    required: true,
    placeholder: 'e.g., $25,000',
  },
  {
    id: 'useOfProceeds',
    label: 'Use of Proceeds',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe how the funds will be used (e.g., working capital, expansion, debt repayment)',
  },
  {
    id: 'businessDescription',
    label: 'Business Description',
    type: 'textarea',
    required: true,
    placeholder:
      "Detailed description of the company's business, products, services, and market",
  },
  {
    id: 'managementTeam',
    label: 'Management Team',
    type: 'textarea',
    required: true,
    placeholder: 'Key management personnel, their backgrounds, and experience',
  },
  {
    id: 'riskFactors',
    label: 'Risk Factors',
    type: 'textarea',
    required: true,
    placeholder:
      'Material risks associated with the investment and business operations',
  },
  {
    id: 'financialHighlights',
    label: 'Financial Highlights',
    type: 'textarea',
    required: true,
    placeholder: 'Key financial metrics, revenue, growth projections, etc.',
  },
  {
    id: 'termsOfOffering',
    label: 'Terms of the Offering',
    type: 'textarea',
    required: true,
    placeholder:
      'Detailed terms including valuation, liquidation preferences, voting rights, etc.',
  },
  {
    id: 'closingDate',
    label: 'Expected Closing Date',
    type: 'date',
    required: true,
  },
  {
    id: 'placementAgent',
    label: 'Placement Agent (if any)',
    type: 'text',
    placeholder: 'Name and details of placement agent or broker-dealer',
  },
  {
    id: 'transferRestrictions',
    label: 'Transfer Restrictions',
    type: 'textarea',
    required: true,
    placeholder:
      'Restrictions on transfer of securities, holding periods, etc.',
  },
  {
    id: 'exemptionProvision',
    label: 'Securities Act Exemption',
    type: 'select',
    required: true,
    options: [
      { value: '506b', label: 'Rule 506(b) - Private Placement' },
      { value: '506c', label: 'Rule 506(c) - General Solicitation Allowed' },
      { value: '504', label: 'Rule 504 - Small Offering' },
      { value: '505', label: 'Rule 505 - Limited Offering' },
    ],
  },
  {
    id: 'accreditedInvestorOnly',
    label: 'Accredited Investors Only?',
    type: 'checkbox',
    required: false,
  },
  {
    id: 'state',
    label: 'Governing State Law',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
