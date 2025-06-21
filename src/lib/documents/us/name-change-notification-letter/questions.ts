// src/lib/documents/us/name-change-notification-letter/questions.ts
import type { FormQuestion } from '@/types/documents';

export const nameChangeNotificationLetterQuestions: FormQuestion[] = [
  {
    id: 'oldName',
    type: 'text',
    label: 'Previous Name',
    placeholder: 'Enter your previous legal name',
    required: true,
    group: 'names',
  },
  {
    id: 'newName',
    type: 'text',
    label: 'New Name',
    placeholder: 'Enter your new legal name',
    required: true,
    group: 'names',
  },
  {
    id: 'organizationName',
    type: 'text',
    label: 'Organization Name',
    placeholder: 'Enter organization to notify',
    required: false,
    group: 'recipient',
  },
  {
    id: 'nameChangeReason',
    type: 'select',
    label: 'Reason for Name Change',
    options: [
      { value: 'marriage', label: 'Marriage' },
      { value: 'divorce', label: 'Divorce' },
      { value: 'court-order', label: 'Court Order' },
      { value: 'personal-choice', label: 'Personal Choice' },
    ],
    required: false,
    group: 'change-details',
  },
  {
    id: 'accountNumber',
    type: 'text',
    label: 'Account Number',
    placeholder: 'Enter account or membership number',
    required: false,
    group: 'account',
  },
];
