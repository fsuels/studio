// src/lib/documents/us/startup-equity-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const startupEquityAgreementQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter company name',
    required: true,
    group: 'company',
  },
  {
    id: 'founder1Name',
    type: 'text',
    label: 'Founder 1 Name',
    placeholder: 'Enter first founder name',
    required: true,
    group: 'founders',
  },
  {
    id: 'founder1Equity',
    type: 'text',
    label: 'Founder 1 Equity %',
    placeholder: 'Enter equity percentage',
    required: false,
    group: 'founders',
  },
  {
    id: 'founder2Name',
    type: 'text',
    label: 'Founder 2 Name',
    placeholder: 'Enter second founder name',
    required: false,
    group: 'founders',
  },
  {
    id: 'vestingSchedule',
    type: 'select',
    label: 'Vesting Schedule',
    options: [
      { value: '4-year-cliff', label: '4 Year with 1 Year Cliff' },
      { value: '3-year-cliff', label: '3 Year with 1 Year Cliff' },
      { value: 'immediate', label: 'Immediate Vesting' },
      { value: 'custom', label: 'Custom Schedule' },
    ],
    required: false,
    group: 'vesting',
  },
  {
    id: 'ipAssignment',
    type: 'boolean',
    label: 'Include IP assignment?',
    required: false,
    group: 'legal',
  },
];
