// src/lib/documents/us/separation-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const separationAgreementQuestions: FormQuestion[] = [
  {
    id: 'party1Name',
    type: 'text',
    label: 'First Party Name',
    placeholder: 'Enter first person name',
    required: true,
    group: 'parties',
  },
  {
    id: 'party2Name',
    type: 'text',
    label: 'Second Party Name',
    placeholder: 'Enter second person name',
    required: true,
    group: 'parties',
  },
  {
    id: 'relationshipType',
    type: 'select',
    label: 'Relationship Type',
    options: [
      { value: 'married', label: 'Married' },
      { value: 'domestic-partnership', label: 'Domestic Partnership' },
      { value: 'cohabitation', label: 'Cohabitation' },
    ],
    required: false,
    group: 'relationship',
  },
  {
    id: 'children',
    type: 'boolean',
    label: 'Are there children involved?',
    required: false,
    group: 'children',
  },
];
