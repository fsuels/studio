// src/lib/documents/us/clinical-trial-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const clinicalTrialAgreementQuestions: FormQuestion[] = [
  {
    id: 'sponsorName',
    type: 'text',
    label: 'Sponsor Name',
    placeholder: 'Enter sponsor organization name',
    required: true,
    group: 'sponsor',
  },
  {
    id: 'siteName',
    type: 'text',
    label: 'Research Site Name',
    placeholder: 'Enter research site/hospital name',
    required: true,
    group: 'site',
  },
  {
    id: 'studyTitle',
    type: 'text',
    label: 'Study Title',
    placeholder: 'Enter clinical study title',
    required: false,
    group: 'study',
  },
  {
    id: 'studyPhase',
    type: 'select',
    label: 'Study Phase',
    options: [
      { value: 'phase-i', label: 'Phase I' },
      { value: 'phase-ii', label: 'Phase II' },
      { value: 'phase-iii', label: 'Phase III' },
      { value: 'phase-iv', label: 'Phase IV' },
      { value: 'observational', label: 'Observational' },
    ],
    required: false,
    group: 'study',
  },
  {
    id: 'targetEnrollment',
    type: 'text',
    label: 'Target Enrollment',
    placeholder: 'Enter number of participants',
    required: false,
    group: 'participants',
  },
  {
    id: 'studyBudget',
    type: 'text',
    label: 'Total Study Budget',
    placeholder: 'Enter total budget amount',
    required: false,
    group: 'financial',
  },
];
