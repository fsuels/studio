// src/lib/documents/us/talent-management-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const talentManagementAgreementQuestions: FormQuestion[] = [
  {
    id: 'talentName',
    type: 'text',
    label: 'Talent Name',
    placeholder: 'Enter talent name',
    required: true,
    group: 'talent',
  },
  {
    id: 'managerName',
    type: 'text',
    label: 'Manager Name',
    placeholder: 'Enter manager name',
    required: true,
    group: 'manager',
  },
  {
    id: 'talentType',
    type: 'select',
    label: 'Talent Type',
    options: [
      { value: 'musician', label: 'Musician' },
      { value: 'actor', label: 'Actor' },
      { value: 'comedian', label: 'Comedian' },
      { value: 'athlete', label: 'Athlete' },
      { value: 'influencer', label: 'Influencer' },
      { value: 'model', label: 'Model' },
      { value: 'writer', label: 'Writer' },
    ],
    required: false,
    group: 'talent',
  },
  {
    id: 'commissionRate',
    type: 'text',
    label: 'Commission Rate (%)',
    placeholder: 'Enter commission percentage',
    required: false,
    group: 'financial',
  },
  {
    id: 'contractTerm',
    type: 'text',
    label: 'Contract Term',
    placeholder: 'Enter contract duration',
    required: false,
    group: 'contract',
  },
  {
    id: 'exclusivity',
    type: 'boolean',
    label: 'Exclusive representation?',
    required: false,
    group: 'contract',
  },
];
