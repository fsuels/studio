// src/lib/documents/us/coaching-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const coachingAgreementQuestions: FormQuestion[] = [
  {
    id: 'coachName',
    type: 'text',
    label: 'Coach Name',
    placeholder: 'Enter coach full name',
    required: true,
    group: 'coach',
  },
  {
    id: 'coachEmail',
    type: 'email',
    label: 'Coach Email',
    placeholder: 'Enter coach email',
    required: false,
    group: 'coach',
  },
  {
    id: 'coachCertifications',
    type: 'text',
    label: 'Coach Certifications',
    placeholder: 'Enter relevant certifications',
    required: false,
    group: 'coach',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client full name',
    required: true,
    group: 'client',
  },
  {
    id: 'clientEmail',
    type: 'email',
    label: 'Client Email',
    placeholder: 'Enter client email',
    required: false,
    group: 'client',
  },
  {
    id: 'coachingType',
    type: 'select',
    label: 'Coaching Type',
    options: [
      { value: 'life', label: 'Life Coaching' },
      { value: 'business', label: 'Business Coaching' },
      { value: 'executive', label: 'Executive Coaching' },
      { value: 'career', label: 'Career Coaching' },
      { value: 'health', label: 'Health Coaching' },
      { value: 'relationship', label: 'Relationship Coaching' },
      { value: 'spiritual', label: 'Spiritual Coaching' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'coaching',
  },
  {
    id: 'coachingGoals',
    type: 'textarea',
    label: 'Coaching Goals',
    placeholder: 'Describe the coaching goals',
    required: false,
    group: 'coaching',
  },
  {
    id: 'sessionFormat',
    type: 'select',
    label: 'Session Format',
    options: [
      { value: 'in-person', label: 'In-Person' },
      { value: 'phone', label: 'Phone' },
      { value: 'video', label: 'Video Call' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
    required: false,
    group: 'sessions',
  },
  {
    id: 'sessionDuration',
    type: 'text',
    label: 'Session Duration',
    placeholder: 'Enter session duration (e.g., 60 minutes)',
    required: false,
    group: 'sessions',
  },
  {
    id: 'sessionFrequency',
    type: 'select',
    label: 'Session Frequency',
    options: [
      { value: 'weekly', label: 'Weekly' },
      { value: 'bi-weekly', label: 'Bi-Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'as-needed', label: 'As Needed' },
    ],
    required: false,
    group: 'sessions',
  },
  {
    id: 'numberOfSessions',
    type: 'text',
    label: 'Number of Sessions',
    placeholder: 'Enter total number of sessions',
    required: false,
    group: 'sessions',
  },
  {
    id: 'startDate',
    type: 'date',
    label: 'Start Date',
    required: false,
    group: 'schedule',
  },
  {
    id: 'cancellationNotice',
    type: 'text',
    label: 'Cancellation Notice',
    placeholder: 'Enter notice period (e.g., 24 hours)',
    required: false,
    group: 'schedule',
  },
  {
    id: 'feeStructure',
    type: 'select',
    label: 'Fee Structure',
    options: [
      { value: 'per-session', label: 'Per Session' },
      { value: 'package', label: 'Package Deal' },
      { value: 'monthly-retainer', label: 'Monthly Retainer' },
      { value: 'hourly', label: 'Hourly Rate' },
    ],
    required: false,
    group: 'fees',
  },
  {
    id: 'sessionRate',
    type: 'text',
    label: 'Session Rate',
    placeholder: 'Enter rate per session',
    required: false,
    group: 'fees',
  },
  {
    id: 'totalFee',
    type: 'text',
    label: 'Total Fee',
    placeholder: 'Enter total coaching fee',
    required: false,
    group: 'fees',
  },
  {
    id: 'homeworkAssignments',
    type: 'boolean',
    label: 'Homework assignments included?',
    required: false,
    group: 'scope',
  },
  {
    id: 'assessmentsIncluded',
    type: 'boolean',
    label: 'Assessments included?',
    required: false,
    group: 'scope',
  },
  {
    id: 'communicationBetweenSessions',
    type: 'boolean',
    label: 'Communication between sessions?',
    required: false,
    group: 'communication',
  },
  {
    id: 'preferredCommunication',
    type: 'select',
    label: 'Preferred Communication Method',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'text', label: 'Text' },
      { value: 'none', label: 'None' },
    ],
    required: false,
    group: 'communication',
  },
  {
    id: 'confidentialityAgreement',
    type: 'boolean',
    label: 'Confidentiality agreement?',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'sessionRecording',
    type: 'boolean',
    label: 'Session recording allowed?',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'noGuaranteeClause',
    type: 'boolean',
    label: 'Include no-guarantee clause?',
    required: false,
    group: 'results',
  },
  {
    id: 'progressReviews',
    type: 'boolean',
    label: 'Progress reviews included?',
    required: false,
    group: 'results',
  },
  {
    id: 'testimonialRights',
    type: 'boolean',
    label: 'Testimonial usage rights?',
    required: false,
    group: 'intellectual',
  },
  {
    id: 'terminationNotice',
    type: 'text',
    label: 'Termination Notice',
    placeholder: 'Enter termination notice period',
    required: false,
    group: 'termination',
  },
  {
    id: 'governingLaw',
    type: 'text',
    label: 'Governing Law',
    placeholder: 'Enter governing law/state',
    required: false,
    group: 'legal',
  },
];
