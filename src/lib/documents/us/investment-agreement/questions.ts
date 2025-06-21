// src/lib/documents/us/investment-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const investmentAgreementQuestions: FormQuestion[] = [
  {
    id: 'investorName',
    type: 'text',
    label: 'Investor Name',
    placeholder: 'Enter investor name',
    required: true,
    group: 'investor',
  },
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter company name',
    required: true,
    group: 'company',
  },
  {
    id: 'investmentAmount',
    type: 'text',
    label: 'Investment Amount',
    placeholder: 'Enter investment amount',
    required: false,
    group: 'investment',
  },
  {
    id: 'investmentType',
    type: 'select',
    label: 'Investment Type',
    options: [
      { value: 'equity', label: 'Equity' },
      { value: 'debt', label: 'Debt' },
      { value: 'convertible', label: 'Convertible' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
    required: false,
    group: 'investment',
  },
  {
    id: 'accreditedInvestor',
    type: 'boolean',
    label: 'Accredited investor?',
    required: false,
    group: 'investor',
  },
  {
    id: 'votingRights',
    type: 'boolean',
    label: 'Voting rights included?',
    required: false,
    group: 'rights',
  },
];
