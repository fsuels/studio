import type { FormQuestion } from '@/types/documents';

export const marketingAgreementQuestions: FormQuestion[] = [
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    required: true,
    placeholder: 'Enter the client\'s name or company name',
    validation: { min: 1 }
  },
  {
    id: 'clientAddress',
    type: 'textarea',
    label: 'Client Address',
    required: true,
    placeholder: 'Enter the complete address of the client',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'marketingCompanyName',
    type: 'text',
    label: 'Marketing Company Name',
    required: true,
    placeholder: 'Enter the marketing company\'s name',
    validation: { min: 1 }
  },
  {
    id: 'marketingCompanyAddress',
    type: 'textarea',
    label: 'Marketing Company Address',
    required: true,
    placeholder: 'Enter the complete address of the marketing company',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'campaignDescription',
    type: 'textarea',
    label: 'Campaign Description',
    required: true,
    placeholder: 'Describe the marketing campaign and objectives',
    validation: { min: 20, max: 1000 }
  },
  {
    id: 'campaignDuration',
    type: 'text',
    label: 'Campaign Duration',
    required: true,
    placeholder: 'e.g., 6 months, 1 year',
    validation: { min: 1 }
  },
  {
    id: 'totalBudget',
    type: 'number',
    label: 'Total Marketing Budget',
    required: true,
    validation: { min: 0 },
    placeholder: 'Enter the total budget in dollars'
  },
  {
    id: 'paymentStructure',
    type: 'select',
    label: 'Payment Structure',
    required: true,
    options: [
      { value: 'monthly', label: 'Monthly Payments' },
      { value: 'milestone', label: 'Milestone-Based' },
      { value: 'performance', label: 'Performance-Based' },
      { value: 'upfront', label: 'Upfront Payment' }
    ]
  },
  {
    id: 'paymentTerms',
    type: 'textarea',
    label: 'Payment Terms',
    required: true,
    placeholder: 'Describe the payment schedule and terms',
    validation: { min: 10, max: 500 }
  },
  {
    id: 'reportingFrequency',
    type: 'radio',
    label: 'Reporting Frequency',
    required: true,
    defaultValue: 'monthly',
    options: [
      { value: 'weekly', label: 'Weekly Reports' },
      { value: 'monthly', label: 'Monthly Reports' },
      { value: 'quarterly', label: 'Quarterly Reports' }
    ]
  },
  {
    id: 'contentOwnership',
    type: 'radio',
    label: 'Content Ownership',
    required: true,
    defaultValue: 'client',
    options: [
      { value: 'client', label: 'Client owns all content' },
      { value: 'agency', label: 'Agency retains content rights' },
      { value: 'shared', label: 'Shared ownership' }
    ]
  },
  {
    id: 'confidentialityClause',
    type: 'checkbox',
    label: 'Include Confidentiality Clause',
    required: false,
    defaultValue: true
  },
  {
    id: 'terminationNotice',
    type: 'text',
    label: 'Termination Notice Period',
    required: false,
    defaultValue: '30 days',
    placeholder: 'e.g., 30 days, 60 days'
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
    id: 'agreementDate',
    type: 'date',
    label: 'Agreement Date',
    required: true,
    helpText: 'Date this marketing agreement is signed'
  }
];