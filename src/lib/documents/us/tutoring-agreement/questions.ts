// src/lib/documents/us/tutoring-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const tutoringAgreementQuestions: FormQuestion[] = [
  {
    id: 'tutorName',
    type: 'text',
    label: 'Tutor Name',
    placeholder: 'Enter tutor full name',
    required: true,
    group: 'tutor',
  },
  {
    id: 'tutorEmail',
    type: 'email',
    label: 'Tutor Email',
    placeholder: 'Enter tutor email',
    required: false,
    group: 'tutor',
  },
  {
    id: 'tutorQualifications',
    type: 'textarea',
    label: 'Tutor Qualifications',
    placeholder: 'Describe tutor qualifications and experience',
    required: false,
    group: 'tutor',
  },
  {
    id: 'studentName',
    type: 'text',
    label: 'Student Name',
    placeholder: 'Enter student full name',
    required: true,
    group: 'student',
  },
  {
    id: 'studentAge',
    type: 'text',
    label: 'Student Age',
    placeholder: 'Enter student age',
    required: false,
    group: 'student',
  },
  {
    id: 'studentGrade',
    type: 'text',
    label: 'Student Grade Level',
    placeholder: 'Enter grade level',
    required: false,
    group: 'student',
  },
  {
    id: 'parentName',
    type: 'text',
    label: 'Parent/Guardian Name',
    placeholder: 'Enter parent or guardian name',
    required: false,
    group: 'parent',
  },
  {
    id: 'parentEmail',
    type: 'email',
    label: 'Parent Email',
    placeholder: 'Enter parent email',
    required: false,
    group: 'parent',
  },
  {
    id: 'subjects',
    type: 'text',
    label: 'Subject(s)',
    placeholder: 'Enter subjects to be tutored',
    required: false,
    group: 'tutoring',
  },
  {
    id: 'tutoringGoals',
    type: 'textarea',
    label: 'Tutoring Goals',
    placeholder: 'Describe tutoring goals and objectives',
    required: false,
    group: 'tutoring',
  },
  {
    id: 'sessionLocation',
    type: 'select',
    label: 'Session Location',
    options: [
      { value: 'tutor-home', label: "Tutor's Home" },
      { value: 'student-home', label: "Student's Home" },
      { value: 'library', label: 'Library' },
      { value: 'online', label: 'Online' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'sessions',
  },
  {
    id: 'sessionDuration',
    type: 'text',
    label: 'Session Duration',
    placeholder: 'Enter session length (e.g., 1 hour)',
    required: false,
    group: 'sessions',
  },
  {
    id: 'sessionFrequency',
    type: 'select',
    label: 'Session Frequency',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'bi-weekly', label: 'Bi-Weekly' },
      { value: 'as-needed', label: 'As Needed' },
    ],
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
    id: 'preferredDays',
    type: 'text',
    label: 'Preferred Days',
    placeholder: 'Enter preferred days for tutoring',
    required: false,
    group: 'schedule',
  },
  {
    id: 'hourlyRate',
    type: 'text',
    label: 'Hourly Rate',
    placeholder: 'Enter hourly tutoring rate',
    required: false,
    group: 'fees',
  },
  {
    id: 'paymentSchedule',
    type: 'select',
    label: 'Payment Schedule',
    options: [
      { value: 'per-session', label: 'Per Session' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'package', label: 'Package' },
    ],
    required: false,
    group: 'fees',
  },
  {
    id: 'paymentMethod',
    type: 'select',
    label: 'Payment Method',
    options: [
      { value: 'cash', label: 'Cash' },
      { value: 'check', label: 'Check' },
      { value: 'electronic', label: 'Electronic Transfer' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'fees',
  },
  {
    id: 'materialsProvided',
    type: 'select',
    label: 'Materials Provided By',
    options: [
      { value: 'tutor', label: 'Tutor' },
      { value: 'student', label: 'Student' },
      { value: 'shared', label: 'Shared' },
    ],
    required: false,
    group: 'materials',
  },
  {
    id: 'homeworkHelp',
    type: 'boolean',
    label: 'Homework help included?',
    required: false,
    group: 'academic',
  },
  {
    id: 'testPreparation',
    type: 'boolean',
    label: 'Test preparation included?',
    required: false,
    group: 'academic',
  },
  {
    id: 'progressReports',
    type: 'boolean',
    label: 'Progress reports provided?',
    required: false,
    group: 'academic',
  },
  {
    id: 'parentCommunication',
    type: 'boolean',
    label: 'Regular parent communication?',
    required: false,
    group: 'communication',
  },
  {
    id: 'communicationFrequency',
    type: 'select',
    label: 'Communication Frequency',
    options: [
      { value: 'after-each-session', label: 'After Each Session' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'as-needed', label: 'As Needed' },
    ],
    required: false,
    group: 'communication',
  },
  {
    id: 'cancellationNotice',
    type: 'text',
    label: 'Cancellation Notice',
    placeholder: 'Enter required notice (e.g., 24 hours)',
    required: false,
    group: 'policies',
  },
  {
    id: 'makeupSessions',
    type: 'boolean',
    label: 'Makeup sessions allowed?',
    required: false,
    group: 'policies',
  },
  {
    id: 'backgroundCheckCompleted',
    type: 'boolean',
    label: 'Background check completed?',
    required: false,
    group: 'safety',
  },
  {
    id: 'recordingSessions',
    type: 'boolean',
    label: 'Recording sessions allowed?',
    required: false,
    group: 'online',
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
