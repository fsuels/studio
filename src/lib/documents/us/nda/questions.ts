// src/lib/documents/us/nda/questions.ts
import type { Question } from '@/types/documents';

export const ndaQuestions: Question[] = [
  {
    id: 'party1Name',
    label: 'Party 1 Full Name/Company',
    type: 'text',
    required: true,
  },
  {
    id: 'party1Address',
    label: 'Party 1 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'party2Name',
    label: 'Party 2 Full Name/Company',
    type: 'text',
    required: true,
  },
  {
    id: 'party2Address',
    label: 'Party 2 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date of Agreement',
    type: 'date',
    required: true,
  },
  {
    id: 'purpose',
    label: 'Purpose of Disclosure',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., Discussing potential business partnership, evaluating software',
  },
  {
    id: 'confidentialInfoDescription',
    label: 'Brief Description of Confidential Information',
    type: 'textarea',
    placeholder: 'e.g., Business plans, customer lists, source code',
  },
  {
    id: 'termYears',
    label: 'Term of Agreement (Years, 0 for indefinite)',
    type: 'number',
    placeholder: 'e.g., 3',
  },
];