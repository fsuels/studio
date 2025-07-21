// src/lib/documents/us/internship-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const internshipAgreementQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter company name',
    required: true,
    group: 'company',
  },
  {
    id: 'internName',
    type: 'text',
    label: 'Intern Name',
    placeholder: 'Enter intern full name',
    required: true,
    group: 'intern',
  },
  {
    id: 'internshipTitle',
    type: 'text',
    label: 'Internship Title',
    placeholder: 'Enter internship position title',
    required: true,
    group: 'internship',
  },
  {
    id: 'jobDescription',
    type: 'textarea',
    label: 'Job Description',
    placeholder: 'Describe internship duties and responsibilities',
    required: true,
    group: 'internship',
  },
  {
    id: 'startDate',
    type: 'text',
    label: 'Start Date',
    placeholder: 'Enter internship start date',
    required: true,
    group: 'schedule',
  },
  {
    id: 'endDate',
    type: 'text',
    label: 'End Date',
    placeholder: 'Enter internship end date',
    required: true,
    group: 'schedule',
  },
  {
    id: 'compensationType',
    type: 'select',
    label: 'Compensation Type',
    options: [
      { value: 'paid', label: 'Paid' },
      { value: 'unpaid', label: 'Unpaid' },
      { value: 'stipend', label: 'Stipend' },
      { value: 'academic-credit', label: 'Academic Credit Only' },
    ],
    required: true,
    group: 'compensation',
  },
];
