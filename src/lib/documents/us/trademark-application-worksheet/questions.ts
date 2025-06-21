// src/lib/documents/us/trademark-application-worksheet/questions.ts
import type { Question } from '@/types/documents';

export const trademarkApplicationWorksheetQuestions: Question[] = [
  {
    id: 'applicantName',
    label: 'Applicant Full Name or Business Name',
    type: 'text',
    required: true,
  },
  {
    id: 'applicantAddress',
    label: 'Applicant Complete Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'applicantEmail',
    label: 'Applicant Email Address',
    type: 'email',
    required: true,
  },
  {
    id: 'applicantPhone',
    label: 'Applicant Phone Number',
    type: 'tel',
    required: true,
  },
  {
    id: 'trademarkName',
    label: 'Trademark Name/Mark',
    type: 'text',
    required: true,
    placeholder: 'Enter the exact trademark you want to register',
  },
  {
    id: 'trademarkType',
    label: 'Type of Trademark',
    type: 'radio',
    required: true,
    options: [
      { value: 'word', label: 'Word Mark (text only)' },
      { value: 'design', label: 'Design Mark (logo/image only)' },
      { value: 'combined', label: 'Combined Mark (text and design)' },
    ],
  },
  {
    id: 'trademarkDescription',
    label: 'Description of the Mark',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe what the trademark looks like, colors, elements, etc.',
  },
  {
    id: 'goodsServices',
    label: 'Goods and/or Services',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe the specific goods or services the trademark will be used for',
  },
  {
    id: 'trademarkClass',
    label: 'Trademark Class (1-45)',
    type: 'text',
    required: true,
    placeholder: 'e.g., Class 25 for clothing, Class 35 for business services',
  },
  {
    id: 'currentUse',
    label: 'Currently Using Mark in Commerce?',
    type: 'checkbox',
    placeholder: 'Check if you are already using this trademark in business',
  },
  {
    id: 'firstUseDate',
    label: 'Date of First Use (if applicable)',
    type: 'date',
    placeholder: 'When you first used this mark',
  },
  {
    id: 'firstUseCommerceDate',
    label: 'Date of First Use in Commerce (if applicable)',
    type: 'date',
    placeholder: 'When you first used this mark in interstate commerce',
  },
  {
    id: 'intentToUse',
    label: 'Intent to Use (if not currently using)',
    type: 'checkbox',
    placeholder: 'Check if you intend to use this mark in the future',
  },
  {
    id: 'priority',
    label: 'Priority Claim (if applicable)',
    type: 'text',
    placeholder:
      'Foreign priority information if claiming priority from another country',
  },
  {
    id: 'attorneyName',
    label: 'Attorney Name (if using attorney)',
    type: 'text',
    placeholder: 'Name of representing attorney',
  },
  {
    id: 'attorneyAddress',
    label: 'Attorney Address (if using attorney)',
    type: 'textarea',
    placeholder: 'Complete address of representing attorney',
  },
  {
    id: 'attorneyPhone',
    label: 'Attorney Phone (if using attorney)',
    type: 'tel',
    placeholder: 'Phone number of representing attorney',
  },
  {
    id: 'attorneyEmail',
    label: 'Attorney Email (if using attorney)',
    type: 'email',
    placeholder: 'Email address of representing attorney',
  },
  {
    id: 'signatureDate',
    label: 'Signature Date',
    type: 'date',
    required: true,
  },
];
