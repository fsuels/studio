// src/lib/documents/us/talent-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const talentAgreementQuestions: FormQuestion[] = [
  {
    id: 'talentName',
    type: 'text',
    label: 'Talent Name',
    placeholder: 'Enter talent full name',
    required: true,
    group: 'talent',
  },
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter production company name',
    required: true,
    group: 'company',
  },
  {
    id: 'projectTitle',
    type: 'text',
    label: 'Project Title',
    placeholder: 'Enter project or production title',
    required: true,
    group: 'project',
  },
  {
    id: 'projectType',
    type: 'select',
    label: 'Project Type',
    options: [
      { value: 'film', label: 'Film' },
      { value: 'television', label: 'Television' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'music', label: 'Music' },
      { value: 'theater', label: 'Theater' },
      { value: 'digital', label: 'Digital Media' },
    ],
    required: true,
    group: 'project',
  },
  {
    id: 'performanceType',
    type: 'select',
    label: 'Performance Type',
    options: [
      { value: 'acting', label: 'Acting' },
      { value: 'singing', label: 'Singing' },
      { value: 'dancing', label: 'Dancing' },
      { value: 'modeling', label: 'Modeling' },
      { value: 'voice-over', label: 'Voice Over' },
      { value: 'hosting', label: 'Hosting' },
    ],
    required: true,
    group: 'performance',
  },
  {
    id: 'compensationType',
    type: 'select',
    label: 'Compensation Type',
    options: [
      { value: 'flat-fee', label: 'Flat Fee' },
      { value: 'daily-rate', label: 'Daily Rate' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'residuals', label: 'Residuals' },
      { value: 'percentage', label: 'Percentage' },
    ],
    required: true,
    group: 'compensation',
  },
];
