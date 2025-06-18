// src/lib/documents/us/nonprofit-bylaws/questions.ts
import type { FormQuestion } from '@/types/documents';

export const nonprofitBylawsQuestions: FormQuestion[] = [
  {
    id: 'organizationName',
    type: 'text',
    label: 'Organization Name',
    placeholder: 'Enter nonprofit organization name',
    required: true,
    group: 'organization',
  },
  {
    id: 'stateOfIncorporation',
    type: 'text',
    label: 'State of Incorporation',
    placeholder: 'Enter state where incorporated',
    required: false,
    group: 'organization',
  },
  {
    id: 'taxExemptStatus',
    type: 'select',
    label: 'Tax Exempt Status',
    options: [
      { value: '501c3', label: '501(c)(3) - Charitable' },
      { value: '501c4', label: '501(c)(4) - Social Welfare' },
      { value: '501c6', label: '501(c)(6) - Business League' },
      { value: '501c7', label: '501(c)(7) - Social Club' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'tax',
  },
  {
    id: 'minimumDirectors',
    type: 'text',
    label: 'Minimum Number of Directors',
    placeholder: 'Enter minimum directors',
    required: false,
    group: 'board',
  },
  {
    id: 'regularMeetingSchedule',
    type: 'select',
    label: 'Regular Meeting Schedule',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'annually', label: 'Annually' },
      { value: 'as-needed', label: 'As Needed' },
    ],
    required: false,
    group: 'meetings',
  },
  {
    id: 'membershipOrganization',
    type: 'boolean',
    label: 'Membership organization?',
    required: false,
    group: 'membership',
  },
];