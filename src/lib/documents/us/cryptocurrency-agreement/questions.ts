// src/lib/documents/us/cryptocurrency-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const cryptocurrencyAgreementQuestions: FormQuestion[] = [
  {
    id: 'party1Name',
    type: 'text',
    label: 'Party 1 Name',
    placeholder: 'Enter first party name',
    required: true,
    group: 'parties',
  },
  {
    id: 'party2Name',
    type: 'text',
    label: 'Party 2 Name',
    placeholder: 'Enter second party name',
    required: true,
    group: 'parties',
  },
  {
    id: 'transactionType',
    type: 'select',
    label: 'Transaction Type',
    options: [
      { value: 'sale', label: 'Sale' },
      { value: 'purchase', label: 'Purchase' },
      { value: 'exchange', label: 'Exchange' },
      { value: 'loan', label: 'Loan' },
      { value: 'mining', label: 'Mining' },
      { value: 'staking', label: 'Staking' },
    ],
    required: true,
    group: 'transaction',
  },
  {
    id: 'cryptocurrency',
    type: 'text',
    label: 'Cryptocurrency',
    placeholder: 'e.g., Bitcoin, Ethereum, etc.',
    required: true,
    group: 'transaction',
  },
  {
    id: 'amount',
    type: 'text',
    label: 'Amount',
    placeholder: 'Enter cryptocurrency amount',
    required: true,
    group: 'transaction',
  },
  {
    id: 'paymentMethod',
    type: 'select',
    label: 'Payment Method',
    options: [
      { value: 'cryptocurrency', label: 'Cryptocurrency' },
      { value: 'fiat', label: 'Fiat Currency' },
      { value: 'both', label: 'Both' },
    ],
    required: true,
    group: 'payment',
  },
];
