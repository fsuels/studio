// src/lib/documents/us/complaint-letter/questions.ts
import type { FormQuestion } from '@/types/documents';

export const complaintLetterQuestions: FormQuestion[] = [
  {
    id: 'complainantName',
    type: 'text',
    label: 'Your Name',
    placeholder: 'Enter your full name',
    required: true,
    group: 'complainant',
  },
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter company you are complaining about',
    required: false,
    group: 'recipient',
  },
  {
    id: 'complaintSubject',
    type: 'text',
    label: 'Subject of Complaint',
    placeholder: 'Brief subject line for your complaint',
    required: false,
    group: 'complaint',
  },
  {
    id: 'complaintDescription',
    type: 'textarea',
    label: 'Complaint Description',
    placeholder: 'Describe the issue in detail',
    required: false,
    group: 'complaint',
  },
  {
    id: 'desiredResolution',
    type: 'textarea',
    label: 'Desired Resolution',
    placeholder: 'What would you like the company to do?',
    required: false,
    group: 'resolution',
  },
];
