// src/lib/documents/us/ecommerce-terms-of-service/questions.ts
import type { FormQuestion } from '@/types/documents';

export const ecommerceTermsOfServiceQuestions: FormQuestion[] = [
  {
    id: 'businessName',
    type: 'text',
    label: 'Business Name',
    placeholder: 'Enter business name',
    required: true,
    group: 'business',
  },
  {
    id: 'websiteURL',
    type: 'text',
    label: 'Website URL',
    placeholder: 'Enter website URL',
    required: false,
    group: 'business',
  },
  {
    id: 'targetMarket',
    type: 'select',
    label: 'Target Market',
    options: [
      { value: 'b2b', label: 'Business to Business' },
      { value: 'b2c', label: 'Business to Consumer' },
      { value: 'both', label: 'Both B2B and B2C' },
    ],
    required: false,
    group: 'business',
  },
  {
    id: 'returnPolicy',
    type: 'textarea',
    label: 'Return Policy',
    placeholder: 'Describe your return policy',
    required: false,
    group: 'policies',
  },
  {
    id: 'internationalShipping',
    type: 'boolean',
    label: 'Offer international shipping?',
    required: false,
    group: 'shipping',
  },
  {
    id: 'accountRequired',
    type: 'boolean',
    label: 'Require user accounts?',
    required: false,
    group: 'accounts',
  },
];
