// src/lib/documents/us/payment-plan/questions.ts
import type { FormQuestion } from '@/types/documents';

export const paymentPlanQuestions: FormQuestion[] = [
  {
    id: 'creditorName',
    type: 'text',
    label: 'Creditor Name',
    placeholder: 'Enter creditor name',
    required: true,
    section: 'Creditor Information',
  },
  {
    id: 'creditorAddress',
    type: 'address',
    label: 'Creditor Address',
    required: true,
    section: 'Creditor Information',
  },
  {
    id: 'debtorName',
    type: 'text',
    label: 'Debtor Name',
    placeholder: 'Enter debtor name',
    required: true,
    section: 'Debtor Information',
  },
  {
    id: 'debtorAddress',
    type: 'address',
    label: 'Debtor Address',
    required: true,
    section: 'Debtor Information',
  },
  {
    id: 'currentBalanceOwed',
    type: 'currency',
    label: 'Current Balance Owed',
    required: true,
    section: 'Debt Information',
  },
  {
    id: 'paymentAmount',
    type: 'currency',
    label: 'Payment Amount',
    required: true,
    section: 'Payment Plan',
  },
  {
    id: 'paymentFrequency',
    type: 'select',
    label: 'Payment Frequency',
    options: [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ],
    required: true,
    section: 'Payment Plan',
  },
  {
    id: 'firstPaymentDate',
    type: 'date',
    label: 'First Payment Date',
    required: true,
    section: 'Payment Plan',
  },
  {
    id: 'agreementDate',
    type: 'date',
    label: 'Agreement Date',
    required: true,
    section: 'Execution',
  },
];
