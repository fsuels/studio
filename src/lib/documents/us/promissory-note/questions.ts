import { usStates } from '@/lib/usStates';
import type { Question } from '@/types/documents';

export const promissoryNoteQuestions: Question[] = [
  { id: 'date', label: 'Date of Note', type: 'date', required: true },
  {
    id: 'placeOfExecution',
    label: 'Place of Execution',
    type: 'text',
    required: true,
    placeholder: 'City, State',
  },
  { id: 'lenderName', label: 'Lender Name', type: 'text', required: true },
  {
    id: 'lenderAddress',
    label: 'Lender Address',
    type: 'text',
    required: true,
    placeholder: 'Street, City, State, ZIP',
  },
  { id: 'borrowerName', label: 'Borrower Name', type: 'text', required: true },
  {
    id: 'borrowerAddress',
    label: 'Borrower Address',
    type: 'text',
    required: true,
    placeholder: 'Street, City, State, ZIP',
  },
  {
    id: 'principalAmount',
    label: 'Principal Amount',
    type: 'number',
    required: true,
    placeholder: 'e.g., 10000',
  },
  {
    id: 'interestRate',
    label: 'Interest Rate (%)',
    type: 'number',
    required: true,
    placeholder: 'e.g., 5',
  },
  {
    id: 'paymentFrequency',
    label: 'Payment Frequency',
    type: 'select',
    required: true,
    options: [
      { value: 'Monthly', label: 'Monthly' },
      { value: 'Quarterly', label: 'Quarterly' },
      { value: 'Annually', label: 'Annually' },
      { value: 'Lump Sum', label: 'Lump Sum' },
    ],
  },
  { id: 'maturityDate', label: 'Maturity Date', type: 'date', required: true },
  {
    id: 'governingLaw',
    label: 'Governing Law',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
  {
    id: 'lateFeeRate',
    label: 'Late Fee Rate (%)',
    type: 'number',
    required: false,
    tooltip: 'Optional percentage charged on late payments',
  },
];
