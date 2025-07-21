import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const questions: Question[] = [
  {
    id: 'spouse1Name',
    label: 'Spouse 1 Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'spouse2Name',
    label: 'Spouse 2 Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'dateOfMarriage',
    label: 'Date of Marriage',
    type: 'date',
    required: true,
  },
  {
    id: 'dateOfSeparation',
    label: 'Date of Separation',
    type: 'date',
    required: true,
  },
  {
    id: 'hasChildren',
    label: 'Are there minor children involved?',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    required: true,
  },
  {
    id: 'propertyDivision',
    label: 'Describe Division of Assets & Debts',
    type: 'textarea',
    required: true,
    placeholder: 'e.g., House to Spouse 1, Car to Spouse 2, Split savings...',
  },
  {
    id: 'spousalSupport',
    label: 'Spousal Support (Alimony) Details',
    type: 'textarea',
    placeholder: 'e.g., Spouse 1 pays $500/month for 36 months, or waived',
  },
  {
    id: 'state',
    label: 'State Governing Divorce',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
