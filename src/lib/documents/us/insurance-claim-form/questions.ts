// src/lib/documents/us/insurance-claim-form/questions.ts
import type { FormQuestion } from '@/types/documents';

export const insuranceClaimFormQuestions: FormQuestion[] = [
  {
    id: 'policyholderName',
    type: 'text',
    label: 'Policyholder Name',
    placeholder: 'Enter policyholder name',
    required: true,
    group: 'policyholder',
  },
  {
    id: 'policyNumber',
    type: 'text',
    label: 'Policy Number',
    placeholder: 'Enter policy number',
    required: false,
    group: 'policy',
  },
  {
    id: 'claimType',
    type: 'select',
    label: 'Claim Type',
    options: [
      { value: 'auto', label: 'Auto Insurance' },
      { value: 'home', label: 'Home Insurance' },
      { value: 'health', label: 'Health Insurance' },
      { value: 'life', label: 'Life Insurance' },
      { value: 'disability', label: 'Disability Insurance' },
      { value: 'liability', label: 'Liability Insurance' },
      { value: 'business', label: 'Business Insurance' },
    ],
    required: false,
    group: 'claim',
  },
  {
    id: 'dateOfLoss',
    type: 'date',
    label: 'Date of Loss',
    required: false,
    group: 'incident',
  },
  {
    id: 'lossDescription',
    type: 'textarea',
    label: 'Description of Loss',
    placeholder: 'Describe what happened',
    required: false,
    group: 'incident',
  },
  {
    id: 'estimatedDamage',
    type: 'text',
    label: 'Estimated Damage Amount',
    placeholder: 'Enter estimated damage cost',
    required: false,
    group: 'damage',
  },
];