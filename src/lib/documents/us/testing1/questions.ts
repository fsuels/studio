import { usStates } from '@/lib/usStates';

export const firstSecondQuestions = [
  { id: 'fullName', label: 'Full Name', type: 'text', required: true },
  {
    id: 'state',
    label: 'State',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label }))
  }
];
