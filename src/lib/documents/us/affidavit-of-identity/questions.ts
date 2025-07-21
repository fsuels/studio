// src/lib/documents/us/affidavit-of-identity/questions.ts
import type { FormQuestion } from '@/types/documents';

export const affidavitOfIdentityQuestions: FormQuestion[] = [
  {
    id: 'affiantName',
    type: 'text',
    label: 'Your Full Name',
    placeholder: 'Enter your complete legal name',
    required: true,
    group: 'identity',
  },
  {
    id: 'dateOfBirth',
    type: 'text',
    label: 'Date of Birth',
    placeholder: 'Enter your date of birth',
    required: false,
    group: 'identity',
  },
  {
    id: 'purposeOfAffidavit',
    type: 'textarea',
    label: 'Purpose of Affidavit',
    placeholder: 'Explain why this affidavit is needed',
    required: false,
    group: 'purpose',
  },
  {
    id: 'aliasesUsed',
    type: 'boolean',
    label: 'Have you used any other names?',
    required: false,
    group: 'names',
  },
  {
    id: 'formerNames',
    type: 'textarea',
    label: 'Former Names',
    placeholder: 'List any previous names used',
    required: false,
    group: 'names',
  },
];
