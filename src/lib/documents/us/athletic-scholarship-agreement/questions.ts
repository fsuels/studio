// src/lib/documents/us/athletic-scholarship-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const athleticScholarshipAgreementQuestions: FormQuestion[] = [
  {
    id: 'studentName',
    type: 'text',
    label: 'Student-Athlete Name',
    placeholder: 'Enter student-athlete name',
    required: true,
    group: 'student',
  },
  {
    id: 'universityName',
    type: 'text',
    label: 'University Name',
    placeholder: 'Enter university name',
    required: true,
    group: 'university',
  },
  {
    id: 'sport',
    type: 'select',
    label: 'Sport',
    options: [
      { value: 'football', label: 'Football' },
      { value: 'basketball', label: 'Basketball' },
      { value: 'baseball', label: 'Baseball' },
      { value: 'soccer', label: 'Soccer' },
      { value: 'tennis', label: 'Tennis' },
      { value: 'track', label: 'Track & Field' },
      { value: 'swimming', label: 'Swimming' },
      { value: 'golf', label: 'Golf' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'athletics',
  },
  {
    id: 'scholarshipType',
    type: 'select',
    label: 'Scholarship Type',
    options: [
      { value: 'full-ride', label: 'Full Ride' },
      { value: 'partial', label: 'Partial' },
      { value: 'head-count', label: 'Head Count' },
      { value: 'equivalency', label: 'Equivalency' },
    ],
    required: false,
    group: 'scholarship',
  },
  {
    id: 'scholarshipPercentage',
    type: 'text',
    label: 'Scholarship Percentage',
    placeholder: 'Enter scholarship percentage',
    required: false,
    group: 'scholarship',
  },
  {
    id: 'gpaRequirement',
    type: 'text',
    label: 'GPA Requirement',
    placeholder: 'Enter minimum GPA requirement',
    required: false,
    group: 'academic',
  },
];
