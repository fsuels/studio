// src/lib/documents/us/volunteer-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const volunteerAgreementQuestions: FormQuestion[] = [
  {
    id: 'organizationName',
    type: 'text',
    label: 'Organization Name',
    placeholder: 'Enter organization name',
    required: true,
    group: 'organization',
  },
  {
    id: 'volunteerName',
    type: 'text',
    label: 'Volunteer Name',
    placeholder: 'Enter volunteer full name',
    required: true,
    group: 'volunteer',
  },
  {
    id: 'volunteerPosition',
    type: 'text',
    label: 'Volunteer Position',
    placeholder: 'Enter volunteer role title',
    required: true,
    group: 'role',
  },
  {
    id: 'roleDescription',
    type: 'textarea',
    label: 'Role Description',
    placeholder: 'Describe volunteer duties and responsibilities',
    required: true,
    group: 'role',
  },
  {
    id: 'organizationType',
    type: 'select',
    label: 'Organization Type',
    options: [
      { value: 'non-profit', label: 'Non-Profit' },
      { value: 'charity', label: 'Charity' },
      { value: 'religious', label: 'Religious Organization' },
      { value: 'educational', label: 'Educational Institution' },
      { value: 'government', label: 'Government Agency' },
    ],
    required: true,
    group: 'organization',
  },
];