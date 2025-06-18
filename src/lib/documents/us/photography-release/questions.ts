// src/lib/documents/us/photography-release/questions.ts
import type { FormQuestion } from '@/types/documents';

export const photographyReleaseQuestions: FormQuestion[] = [
  {
    id: 'subjectName',
    type: 'text',
    label: 'Subject Name',
    placeholder: 'Enter subject full name',
    required: true,
    group: 'subject',
  },
  {
    id: 'photographerName',
    type: 'text',
    label: 'Photographer Name',
    placeholder: 'Enter photographer name',
    required: true,
    group: 'photographer',
  },
  {
    id: 'isMinor',
    type: 'checkbox',
    label: 'Subject is under 18 years old',
    required: false,
    group: 'subject',
  },
  {
    id: 'commercialUse',
    type: 'checkbox',
    label: 'Allow commercial use',
    required: false,
    group: 'usage',
  },
  {
    id: 'socialMediaUse',
    type: 'checkbox',
    label: 'Allow social media use',
    required: false,
    group: 'usage',
  },
  {
    id: 'releaseScope',
    type: 'select',
    label: 'Release Scope',
    options: [
      { value: 'limited', label: 'Limited Use' },
      { value: 'unlimited', label: 'Unlimited Use' },
      { value: 'specific-project', label: 'Specific Project Only' },
    ],
    required: true,
    group: 'release',
  },
];