import type { FormQuestion } from '@/types/documents';

export const endorsementAgreementQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    required: true,
    placeholder: 'Enter your company name',
    validation: { min: 1 }
  },
  {
    id: 'companyAddress',
    type: 'textarea',
    label: 'Company Address',
    required: true,
    placeholder: 'Enter the complete address of your company',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'endorserName',
    type: 'text',
    label: 'Endorser Name',
    required: true,
    placeholder: 'Enter the endorser\'s full name',
    validation: { min: 1 }
  },
  {
    id: 'endorserAddress',
    type: 'textarea',
    label: 'Endorser Address',
    required: true,
    placeholder: 'Enter the complete address of the endorser',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'productService',
    type: 'text',
    label: 'Product/Service Being Endorsed',
    required: true,
    placeholder: 'Enter the product or service to be endorsed',
    validation: { min: 1 }
  },
  {
    id: 'brandName',
    type: 'text',
    label: 'Brand Name',
    required: true,
    placeholder: 'Enter the brand name',
    validation: { min: 1 }
  },
  {
    id: 'endorsementType',
    type: 'checkbox-group',
    label: 'Types of Endorsement',
    required: true,
    options: [
      { value: 'social-media', label: 'Social Media Posts' },
      { value: 'television', label: 'Television Appearances' },
      { value: 'print', label: 'Print Advertisements' },
      { value: 'radio', label: 'Radio Spots' },
      { value: 'events', label: 'Event Appearances' },
      { value: 'product-placement', label: 'Product Placement' },
      { value: 'testimonial', label: 'Written/Video Testimonials' }
    ]
  },
  {
    id: 'minimumPosts',
    type: 'number',
    label: 'Minimum Social Media Posts',
    required: false,
    validation: { min: 0 },
    placeholder: 'Number of posts required',
    conditional: { field: 'endorsementType', value: 'social-media' }
  },
  {
    id: 'compensationType',
    type: 'select',
    label: 'Compensation Type',
    required: true,
    options: [
      { value: 'fixed-fee', label: 'Fixed Fee' },
      { value: 'per-post', label: 'Per Post/Appearance' },
      { value: 'commission', label: 'Commission Based' },
      { value: 'product-only', label: 'Product/Service Only' },
      { value: 'hybrid', label: 'Combination' }
    ]
  },
  {
    id: 'totalCompensation',
    type: 'number',
    label: 'Total Compensation Amount',
    required: false,
    validation: { min: 0 },
    placeholder: 'Enter total compensation in dollars'
  },
  {
    id: 'paymentSchedule',
    type: 'textarea',
    label: 'Payment Schedule',
    required: true,
    placeholder: 'Describe when and how payments will be made',
    validation: { min: 10, max: 500 }
  },
  {
    id: 'agreementTerm',
    type: 'text',
    label: 'Agreement Term',
    required: true,
    placeholder: 'e.g., 6 months, 1 year, per campaign',
    validation: { min: 1 }
  },
  {
    id: 'exclusivityClause',
    type: 'checkbox',
    label: 'Include Exclusivity Clause',
    required: false,
    defaultValue: false,
    helpText: 'Prevent endorser from promoting competing products'
  },
  {
    id: 'exclusivityScope',
    type: 'text',
    label: 'Exclusivity Scope',
    required: false,
    placeholder: 'Define the scope of exclusivity (e.g., category, competitors)',
    conditional: { field: 'exclusivityClause', value: true }
  },
  {
    id: 'ftcDisclosure',
    type: 'checkbox',
    label: 'Require FTC Disclosure',
    required: false,
    defaultValue: true,
    helpText: 'Ensure compliance with FTC endorsement guidelines'
  },
  {
    id: 'disclosureLanguage',
    type: 'text',
    label: 'Disclosure Language',
    required: false,
    defaultValue: '#ad #sponsored',
    placeholder: 'Required disclosure text/hashtags',
    conditional: { field: 'ftcDisclosure', value: true }
  },
  {
    id: 'contentApproval',
    type: 'checkbox',
    label: 'Company Approval Required for Content',
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
    helpText: 'Date this endorsement agreement is signed'
  }
];