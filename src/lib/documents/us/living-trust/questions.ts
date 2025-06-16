import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'trustorName',
    label: 'Trustor Full Name (Person Creating the Trust)',
    type: 'text',
    required: true,
  },
  {
    id: 'trusteeName',
    label: 'Initial Trustee Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'successorTrusteeName',
    label: 'Successor Trustee Full Name (Optional)',
    type: 'text',
  },
  {
    id: 'beneficiaryDetails',
    label: 'Beneficiary Details',
    type: 'textarea',
    required: true,
    placeholder: 'List primary and contingent beneficiaries',
  },
  {
    id: 'assets',
    label: 'Assets to be Placed in Trust',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the assets to be included in the trust',
  },
  {
    id: 'distributionInstructions',
    label: 'Distribution Instructions',
    type: 'textarea',
    required: true,
    placeholder: 'How should assets be distributed upon incapacity or death?',
  },
];