// src/lib/documents/us/franchise-disclosure-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const franchiseDisclosureAgreementQuestions: FormQuestion[] = [
  {
    id: 'franchisorName',
    type: 'text',
    label: 'Franchisor Name',
    placeholder: 'Enter franchisor company name',
    required: true,
    group: 'franchisor',
  },
  {
    id: 'franchiseeName',
    type: 'text',
    label: 'Franchisee Name',
    placeholder: 'Enter franchisee name',
    required: true,
    group: 'franchisee',
  },
  {
    id: 'franchiseBrand',
    type: 'text',
    label: 'Franchise Brand',
    placeholder: 'Enter franchise brand name',
    required: false,
    group: 'franchise',
  },
  {
    id: 'businessType',
    type: 'select',
    label: 'Business Type',
    options: [
      { value: 'restaurant', label: 'Restaurant' },
      { value: 'retail', label: 'Retail' },
      { value: 'service', label: 'Service' },
      { value: 'hospitality', label: 'Hospitality' },
      { value: 'automotive', label: 'Automotive' },
      { value: 'education', label: 'Education' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'franchise',
  },
  {
    id: 'franchiseFee',
    type: 'text',
    label: 'Initial Franchise Fee',
    placeholder: 'Enter franchise fee amount',
    required: false,
    group: 'financial',
  },
  {
    id: 'territoryGrant',
    type: 'select',
    label: 'Territory Type',
    options: [
      { value: 'exclusive', label: 'Exclusive Territory' },
      { value: 'non-exclusive', label: 'Non-Exclusive' },
      { value: 'protected', label: 'Protected Area' },
      { value: 'none', label: 'No Territory' },
    ],
    required: false,
    group: 'territory',
  },
];