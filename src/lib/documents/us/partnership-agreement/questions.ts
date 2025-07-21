import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const partnershipAgreementQuestions: Question[] = [
  {
    id: 'partner1Name',
    label: 'Partner 1 Full Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., John Smith',
  },
  {
    id: 'partner1Address',
    label: 'Partner 1 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'partner2Name',
    label: 'Partner 2 Full Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Alice Brown',
  },
  {
    id: 'partner2Address',
    label: 'Partner 2 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'businessName',
    label: 'Partnership Business Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Acme Innovations LLC',
  },
  {
    id: 'businessAddress',
    label: 'Principal Business Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'startDate',
    label: 'Partnership Start Date',
    type: 'date',
    required: true,
  },
  {
    id: 'capitalContributions',
    label: 'Initial Capital Contributions (describe)',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., Partner 1: $10,000 cash, Partner 2: Equipment valued at $5,000',
  },
  {
    id: 'profitSplit',
    label: 'Profit/Loss Sharing Arrangement',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., 50/50 split after expenses, or based on capital contribution',
  },
  {
    id: 'managementRoles',
    label: 'Management Roles & Responsibilities',
    type: 'textarea',
    placeholder:
      'e.g., Partner 1: Operations, Partner 2: Marketing. Major decisions require unanimous vote.',
  },
  {
    id: 'dissolutionTerms',
    label: 'Terms for Dissolution/Partner Exit',
    type: 'textarea',
    placeholder: 'e.g., Buyout options, asset distribution procedure',
  },
  {
    id: 'state',
    label: 'Governing State Law',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
