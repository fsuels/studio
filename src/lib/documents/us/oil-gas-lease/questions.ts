// src/lib/documents/us/oil-gas-lease/questions.ts
import type { FormQuestion } from '@/types/documents';

export const oilGasLeaseQuestions: FormQuestion[] = [
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
    label: 'Oil & Gas Company Name',
    placeholder: 'Enter company name',
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
    id: 'primaryTerm',
    type: 'text',
    label: 'Primary Term',
    placeholder: 'Enter lease duration (e.g., 5 years)',
    required: false,
    group: 'terms',
  },
  {
    id: 'bonusPayment',
    type: 'text',
    label: 'Bonus Payment',
    placeholder: 'Enter bonus payment per acre',
    required: false,
    group: 'financial',
  },
  {
    id: 'royaltyRate',
    type: 'text',
    label: 'Royalty Rate',
    placeholder: 'Enter royalty percentage (e.g., 12.5%)',
    required: false,
    group: 'financial',
  },
  {
    id: 'frackingRights',
    type: 'boolean',
    label: 'Hydraulic fracturing allowed?',
    required: false,
    group: 'operations',
  },
];