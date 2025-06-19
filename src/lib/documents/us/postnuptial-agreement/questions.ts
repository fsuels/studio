// src/lib/documents/us/postnuptial-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const postnuptialAgreementQuestions: FormQuestion[] = [
  {
    id: 'spouse1Name',
    type: 'text',
    label: 'First Spouse Name',
    placeholder: 'Enter first spouse full name',
    required: true,
    group: 'spouses',
  },
  {
    id: 'spouse2Name',
    type: 'text',
    label: 'Second Spouse Name',
    placeholder: 'Enter second spouse full name',
    required: true,
    group: 'spouses',
  },
  {
    id: 'marriageDate',
    type: 'text',
    label: 'Marriage Date',
    placeholder: 'Enter date of marriage',
    required: false,
    group: 'marriage',
  },
  {
    id: 'realEstate',
    type: 'textarea',
    label: 'Real Estate Assets',
    placeholder: 'List all real estate properties',
    required: false,
    group: 'assets',
  },
  {
    id: 'futureAcquisitions',
    type: 'select',
    label: 'Future Property Acquisitions',
    options: [
      { value: 'separate', label: 'Remain Separate' },
      { value: 'marital', label: 'Become Marital Property' },
      { value: 'as-titled', label: 'As Titled' },
    ],
    required: false,
    group: 'property',
  },
  {
    id: 'spousalSupportWaiver',
    type: 'boolean',
    label: 'Waive spousal support rights?',
    required: false,
    group: 'support',
  },
  {
    id: 'childrenFromMarriage',
    type: 'boolean',
    label: 'Children from this marriage?',
    required: false,
    group: 'children',
  },
  {
    id: 'businessOwnership',
    type: 'textarea',
    label: 'Business Interests',
    placeholder: 'Describe any business ownership',
    required: false,
    group: 'business',
  },
  {
    id: 'independentLegalCounsel',
    type: 'boolean',
    label: 'Independent legal counsel for both spouses?',
    required: false,
    group: 'legal',
  },
];