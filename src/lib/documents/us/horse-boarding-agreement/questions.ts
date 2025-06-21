// src/lib/documents/us/horse-boarding-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const horseBoardingAgreementQuestions: FormQuestion[] = [
  {
    id: 'stableOwnerName',
    type: 'text',
    label: 'Stable Owner Name',
    placeholder: 'Enter stable owner name',
    required: true,
    group: 'stableOwner',
  },
  {
    id: 'horseOwnerName',
    type: 'text',
    label: 'Horse Owner Name',
    placeholder: 'Enter horse owner name',
    required: true,
    group: 'horseOwner',
  },
  {
    id: 'horseName',
    type: 'text',
    label: 'Horse Name',
    placeholder: 'Enter horse name',
    required: true,
    group: 'horse',
  },
  {
    id: 'horseBreed',
    type: 'text',
    label: 'Horse Breed',
    placeholder: 'Enter horse breed',
    required: false,
    group: 'horse',
  },
  {
    id: 'boardingType',
    type: 'select',
    label: 'Boarding Type',
    options: [
      { value: 'full-board', label: 'Full Board' },
      { value: 'partial-board', label: 'Partial Board' },
      { value: 'pasture-board', label: 'Pasture Board' },
      { value: 'training-board', label: 'Training Board' },
    ],
    required: false,
    group: 'boarding',
  },
  {
    id: 'monthlyBoardingFee',
    type: 'text',
    label: 'Monthly Boarding Fee',
    placeholder: 'Enter monthly fee',
    required: false,
    group: 'financial',
  },
  {
    id: 'dailyCare',
    type: 'select',
    label: 'Daily Care Level',
    options: [
      { value: 'full-service', label: 'Full Service' },
      { value: 'self-care', label: 'Self Care' },
      { value: 'partial-care', label: 'Partial Care' },
    ],
    required: false,
    group: 'care',
  },
];
