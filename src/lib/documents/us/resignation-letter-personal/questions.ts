// src/lib/documents/us/resignation-letter-personal/questions.ts
import type { FormQuestion } from '@/types/documents';

export const resignationLetterPersonalQuestions: FormQuestion[] = [
  {
    id: 'employeeName',
    type: 'text',
    label: 'Your Name',
    placeholder: 'Enter your full name',
    required: true,
    group: 'employee',
  },
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter employer company name',
    required: false,
    group: 'employer',
  },
  {
    id: 'supervisorName',
    type: 'text',
    label: 'Supervisor Name',
    placeholder: 'Enter your direct supervisor name',
    required: false,
    group: 'employer',
  },
  {
    id: 'jobTitle',
    type: 'text',
    label: 'Job Title',
    placeholder: 'Enter your current position',
    required: false,
    group: 'employment',
  },
  {
    id: 'lastWorkingDay',
    type: 'text',
    label: 'Last Working Day',
    placeholder: 'Enter your final day of work',
    required: false,
    group: 'resignation',
  },
  {
    id: 'reasonForResigning',
    type: 'select',
    label: 'Reason for Resignation',
    options: [
      { value: 'personal-reasons', label: 'Personal Reasons' },
      { value: 'family-obligations', label: 'Family Obligations' },
      { value: 'health-issues', label: 'Health Issues' },
      { value: 'relocation', label: 'Relocation' },
      { value: 'career-change', label: 'Career Change' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'resignation',
  },
];