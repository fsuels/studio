// src/lib/documents/us/release-of-liability/questions.ts
import type { FormQuestion } from '@/types/documents';

export const releaseOfLiabilityQuestions: FormQuestion[] = [
  {
    id: 'releasorName',
    type: 'text',
    label: 'Your Name (Releasor)',
    placeholder: 'Enter your full name',
    required: true,
    group: 'releasor',
  },
  {
    id: 'releaseeName',
    type: 'text',
    label: 'Business/Organization Name (Releasee)',
    placeholder: 'Enter name of business or organization',
    required: true,
    group: 'releasee',
  },
  {
    id: 'activityDescription',
    type: 'textarea',
    label: 'Activity Description',
    placeholder: 'Describe the activity or service',
    required: false,
    group: 'activity',
  },
  {
    id: 'activityDate',
    type: 'text',
    label: 'Activity Date',
    placeholder: 'Enter date of activity',
    required: false,
    group: 'activity',
  },
  {
    id: 'releaseType',
    type: 'select',
    label: 'Release Type',
    options: [
      { value: 'general', label: 'General Release' },
      { value: 'specific', label: 'Specific Activity' },
      { value: 'mutual', label: 'Mutual Release' },
    ],
    required: false,
    group: 'release',
  },
  {
    id: 'assumptionOfRisk',
    type: 'boolean',
    label: 'Include assumption of risk?',
    required: false,
    group: 'risk',
  },
  {
    id: 'minorParticipant',
    type: 'boolean',
    label: 'Is participant a minor?',
    required: false,
    group: 'minor',
  },
  {
    id: 'photoRelease',
    type: 'boolean',
    label: 'Include photo/media release?',
    required: false,
    group: 'media',
  },
];
