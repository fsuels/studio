import type { Question } from '../../types';

export const terminationLetterQuestions: Question[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter name...',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    required: false,
    placeholder: 'Enter email...',
  },
  {
    id: 'address',
    label: 'Address',
    type: 'address',
    required: true,
    placeholder: 'Enter address...',
  },
  {
    id: 'city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'Enter city...',
  },
  {
    id: 'state',
    label: 'State',
    type: 'text',
    required: true,
    placeholder: 'Enter state...',
  },
  {
    id: 'zipCode',
    label: 'Zip Code',
    type: 'text',
    required: true,
    placeholder: 'Enter zip code...',
  },
  {
    id: 'date',
    label: 'Date',
    type: 'date',
    required: true,
    placeholder: 'Enter date...',
  },
];
