import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const buySellAgreementQuestions: Question[] = [
  {
    id: 'companyName',
    label: 'Company/Business Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Acme Business Solutions LLC',
  },
  {
    id: 'companyType',
    label: 'Business Entity Type',
    type: 'select',
    required: true,
    options: [
      { value: 'llc', label: 'Limited Liability Company (LLC)' },
      { value: 'corporation', label: 'Corporation' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'companyAddress',
    label: 'Company Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'owner1Name',
    label: 'Owner 1 Full Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., John Smith',
  },
  {
    id: 'owner1Address',
    label: 'Owner 1 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'owner1Ownership',
    label: 'Owner 1 Ownership Percentage',
    type: 'text',
    required: true,
    placeholder: 'e.g., 50%',
  },
  {
    id: 'owner2Name',
    label: 'Owner 2 Full Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Alice Johnson',
  },
  {
    id: 'owner2Address',
    label: 'Owner 2 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'owner2Ownership',
    label: 'Owner 2 Ownership Percentage',
    type: 'text',
    required: true,
    placeholder: 'e.g., 50%',
  },
  {
    id: 'additionalOwners',
    label: 'Additional Owners (if any)',
    type: 'textarea',
    placeholder: 'List additional owners with their ownership percentages',
  },
  {
    id: 'triggeringEvents',
    label: 'Triggering Events',
    type: 'multi-select',
    required: true,
    options: [
      { value: 'death', label: 'Death of Owner' },
      { value: 'disability', label: 'Disability of Owner' },
      { value: 'retirement', label: 'Retirement' },
      { value: 'involuntary_termination', label: 'Involuntary Termination' },
      { value: 'voluntary_departure', label: 'Voluntary Departure' },
      { value: 'divorce', label: 'Divorce' },
      { value: 'bankruptcy', label: 'Bankruptcy' },
      { value: 'breach_of_agreement', label: 'Breach of Agreement' },
    ],
  },
  {
    id: 'valuationMethod',
    label: 'Valuation Method',
    type: 'select',
    required: true,
    options: [
      {
        value: 'fair_market_value',
        label: 'Fair Market Value (Professional Appraisal)',
      },
      { value: 'book_value', label: 'Book Value' },
      { value: 'formula', label: 'Formula-Based Valuation' },
      { value: 'appraisal', label: 'Independent Appraisal' },
      { value: 'multiple', label: 'Revenue/Earnings Multiple' },
    ],
  },
  {
    id: 'valuationDetails',
    label: 'Valuation Details',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe the specific valuation methodology, formulas, or appraisal process',
  },
  {
    id: 'paymentTerms',
    label: 'Payment Terms',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., Lump sum within 90 days, or installments over 5 years at 6% interest',
  },
  {
    id: 'fundingMechanism',
    label: 'Funding Mechanism',
    type: 'select',
    required: true,
    options: [
      { value: 'installments', label: 'Installment Payments' },
      { value: 'life_insurance', label: 'Life Insurance Proceeds' },
      { value: 'company_funds', label: 'Company Funds/Redemption' },
      { value: 'external_financing', label: 'External Financing' },
    ],
  },
  {
    id: 'rightOfFirstRefusal',
    label: 'Right of First Refusal',
    type: 'checkbox',
    required: false,
  },
  {
    id: 'restrictionsOnTransfer',
    label: 'Restrictions on Transfer',
    type: 'textarea',
    placeholder:
      'Any restrictions on transferring ownership interests to third parties',
  },
  {
    id: 'disputeResolution',
    label: 'Dispute Resolution Method',
    type: 'select',
    required: true,
    options: [
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date',
    type: 'date',
    required: true,
  },
  {
    id: 'state',
    label: 'Governing State Law',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
