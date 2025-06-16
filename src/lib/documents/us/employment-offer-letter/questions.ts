import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'companyName',
    label: 'Company Name',
    type: 'text',
    required: true,
  },
  {
    id: 'companyAddress',
    label: 'Company Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'candidateName',
    label: 'Candidate Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'candidateAddress',
    label: 'Candidate Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'position',
    label: 'Position Title',
    type: 'text',
    required: true,
  },
  {
    id: 'department',
    label: 'Department',
    type: 'text',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
  },
  {
    id: 'salary',
    label: 'Salary Amount',
    type: 'text',
    required: true,
    placeholder: 'e.g., $75,000 or $25.00',
  },
  {
    id: 'payFrequency',
    label: 'Pay Frequency',
    type: 'select',
    required: true,
    options: [
      { value: 'hourly', label: 'Hourly' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'bi-weekly', label: 'Bi-weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'annually', label: 'Annually' },
    ],
  },
  {
    id: 'benefits',
    label: 'Benefits Package',
    type: 'textarea',
    placeholder: 'e.g., Health insurance, 401k, vacation days...',
  },
  {
    id: 'reportingManager',
    label: 'Reporting Manager',
    type: 'text',
    required: true,
  },
  {
    id: 'workSchedule',
    label: 'Work Schedule',
    type: 'text',
    placeholder: 'e.g., Monday-Friday 9:00 AM - 5:00 PM',
  },
  {
    id: 'employmentType',
    label: 'Employment Type',
    type: 'select',
    required: true,
    options: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'temporary', label: 'Temporary' },
    ],
  },
  {
    id: 'probationPeriod',
    label: 'Probation Period',
    type: 'text',
    placeholder: 'e.g., 90 days',
  },
  {
    id: 'signingBonus',
    label: 'Signing Bonus',
    type: 'text',
    placeholder: 'e.g., $5,000',
  },
];