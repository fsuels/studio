// src/lib/documents/us/elder-care-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const elderCareAgreementQuestions: FormQuestion[] = [
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client name',
    required: true,
    group: 'client',
  },
  {
    id: 'caregiverName',
    type: 'text',
    label: 'Caregiver Name',
    placeholder: 'Enter caregiver name',
    required: true,
    group: 'caregiver',
  },
  {
    id: 'schedule',
    type: 'select',
    label: 'Care Schedule',
    options: [
      { value: 'hourly', label: 'Hourly' },
      { value: 'daily', label: 'Daily' },
      { value: 'live-in', label: 'Live-in' },
      { value: 'overnight', label: 'Overnight' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'full-time', label: 'Full-time' },
    ],
    required: false,
    group: 'schedule',
  },
  {
    id: 'hourlyRate',
    type: 'text',
    label: 'Hourly Rate',
    placeholder: 'Enter hourly rate',
    required: false,
    group: 'compensation',
  },
  {
    id: 'personalCare',
    type: 'boolean',
    label: 'Personal care services?',
    required: false,
    group: 'services',
  },
  {
    id: 'medicationAssistance',
    type: 'boolean',
    label: 'Medication assistance?',
    required: false,
    group: 'services',
  },
];
