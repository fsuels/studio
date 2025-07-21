// src/lib/documents/us/credit-card-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const creditCardAgreementQuestions: FormQuestion[] = [
  {
    id: 'cardholderName',
    type: 'text',
    label: 'Cardholder Name',
    placeholder: 'Enter cardholder full name',
    required: true,
    group: 'cardholder',
  },
  {
    id: 'cardType',
    type: 'select',
    label: 'Card Type',
    options: [
      { value: 'visa', label: 'Visa' },
      { value: 'mastercard', label: 'Mastercard' },
      { value: 'amex', label: 'American Express' },
      { value: 'discover', label: 'Discover' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'card',
  },
  {
    id: 'creditLimit',
    type: 'text',
    label: 'Credit Limit',
    placeholder: 'Enter credit limit',
    required: false,
    group: 'credit',
  },
  {
    id: 'purchaseAPR',
    type: 'text',
    label: 'Purchase APR',
    placeholder: 'Enter purchase APR',
    required: false,
    group: 'rates',
  },
  {
    id: 'annualFee',
    type: 'text',
    label: 'Annual Fee',
    placeholder: 'Enter annual fee',
    required: false,
    group: 'fees',
  },
  {
    id: 'rewardsProgram',
    type: 'boolean',
    label: 'Rewards program included?',
    required: false,
    group: 'rewards',
  },
];
