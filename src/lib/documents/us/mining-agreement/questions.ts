// src/lib/documents/us/mining-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const miningAgreementQuestions: FormQuestion[] = [
  {
    id: 'lessorName',
    type: 'text',
    label: 'Property Owner Name',
    placeholder: 'Enter property owner name',
    required: true,
    group: 'lessor',
  },
  {
    id: 'lesseeName',
    type: 'text',
    label: 'Mining Company Name',
    placeholder: 'Enter mining company name',
    required: true,
    group: 'lessee',
  },
  {
    id: 'propertyAddress',
    type: 'text',
    label: 'Property Address',
    placeholder: 'Enter property address',
    required: false,
    group: 'property',
  },
  {
    id: 'totalAcreage',
    type: 'text',
    label: 'Total Acreage',
    placeholder: 'Enter total acres',
    required: false,
    group: 'property',
  },
  {
    id: 'mineralsIncluded',
    type: 'textarea',
    label: 'Minerals Included',
    placeholder: 'List minerals covered by agreement',
    required: false,
    group: 'minerals',
  },
  {
    id: 'royaltyPercentage',
    type: 'text',
    label: 'Royalty Percentage',
    placeholder: 'Enter royalty percentage',
    required: false,
    group: 'financial',
  },
  {
    id: 'primaryTerm',
    type: 'text',
    label: 'Primary Term',
    placeholder: 'Enter lease duration',
    required: false,
    group: 'duration',
  },
];