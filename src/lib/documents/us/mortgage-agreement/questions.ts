// src/lib/documents/us/mortgage-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const mortgageAgreementQuestions: FormQuestion[] = [
  {
    id: 'borrowerName',
    type: 'text',
    label: 'Borrower Name',
    placeholder: 'Enter borrower full name',
    required: true,
    group: 'borrower',
  },
  {
    id: 'lenderName',
    type: 'text',
    label: 'Lender Name',
    placeholder: 'Enter lender name',
    required: true,
    group: 'lender',
  },
  {
    id: 'propertyAddress',
    type: 'text',
    label: 'Property Address',
    placeholder: 'Enter property address',
    required: true,
    group: 'property',
  },
  {
    id: 'loanAmount',
    type: 'text',
    label: 'Loan Amount',
    placeholder: 'Enter loan amount',
    required: false,
    group: 'loan',
  },
  {
    id: 'interestRate',
    type: 'text',
    label: 'Interest Rate',
    placeholder: 'Enter interest rate',
    required: false,
    group: 'loan',
  },
  {
    id: 'loanTerm',
    type: 'text',
    label: 'Loan Term',
    placeholder: 'Enter loan term in years',
    required: false,
    group: 'loan',
  },
  {
    id: 'loanType',
    type: 'select',
    label: 'Loan Type',
    options: [
      { value: 'conventional', label: 'Conventional' },
      { value: 'fha', label: 'FHA' },
      { value: 'va', label: 'VA' },
      { value: 'usda', label: 'USDA' },
      { value: 'jumbo', label: 'Jumbo' },
    ],
    required: false,
    group: 'loan',
  },
];
