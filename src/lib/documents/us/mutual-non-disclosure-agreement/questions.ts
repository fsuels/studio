// src/lib/documents/us/mutual-non-disclosure-agreement/questions.ts
import type { Question } from '@/types/documents';

export const mutualNdaQuestions: Question[] = [
  {
    id: 'party1Name',
    label: 'First Party Full Name/Company',
    type: 'text',
    required: true,
  },
  {
    id: 'party1Address',
    label: 'First Party Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'party1Title',
    label: 'First Party Title (if applicable)',
    type: 'text',
    placeholder: 'e.g., CEO, President, Director',
  },
  {
    id: 'party2Name',
    label: 'Second Party Full Name/Company',
    type: 'text',
    required: true,
  },
  {
    id: 'party2Address',
    label: 'Second Party Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'party2Title',
    label: 'Second Party Title (if applicable)',
    type: 'text',
    placeholder: 'e.g., CEO, President, Director',
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date of Agreement',
    type: 'date',
    required: true,
  },
  {
    id: 'purpose',
    label: 'Purpose of Mutual Disclosure',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., Exploring potential joint venture, merger discussions, technology partnership',
  },
  {
    id: 'confidentialInfoDescription',
    label: 'Brief Description of Confidential Information',
    type: 'textarea',
    placeholder:
      'e.g., Business plans, financial data, proprietary technology, customer lists',
  },
  {
    id: 'termYears',
    label: 'Term of Agreement (Years, 0 for indefinite)',
    type: 'number',
    placeholder: 'e.g., 5',
  },
  {
    id: 'specificExclusions',
    label: 'Specific Information Exclusions (Optional)',
    type: 'textarea',
    placeholder: 'Information that should not be considered confidential',
  },
  {
    id: 'returnDate',
    label: 'Date for Return of Materials (Optional)',
    type: 'date',
    placeholder: 'When materials should be returned',
  },
];
