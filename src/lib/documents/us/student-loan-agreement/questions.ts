// src/lib/documents/us/student-loan-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const studentLoanAgreementQuestions: FormQuestion[] = [
  {
    id: 'studentName',
    type: 'text',
    label: 'Student Name',
    placeholder: 'Enter student full name',
    required: true,
    group: 'student',
  },
  {
    id: 'lenderName',
    type: 'text',
    label: 'Lender Name',
    placeholder: 'Enter lender name',
    required: true,
    group: 'lender',
  },
  {
    id: 'schoolName',
    type: 'text',
    label: 'School Name',
    placeholder: 'Enter educational institution name',
    required: false,
    group: 'education',
  },
  {
    id: 'loanAmount',
    type: 'text',
    label: 'Loan Amount',
    placeholder: 'Enter total loan amount',
    required: false,
    group: 'loan',
  },
  {
    id: 'interestRate',
    type: 'text',
    label: 'Interest Rate (%)',
    placeholder: 'Enter interest rate',
    required: false,
    group: 'terms',
  },
  {
    id: 'enrollmentStatus',
    type: 'select',
    label: 'Enrollment Status',
    options: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'less-than-half', label: 'Less than Half-time' },
    ],
    required: false,
    group: 'education',
  },
  {
    id: 'cosignerRequired',
    type: 'boolean',
    label: 'Cosigner required?',
    required: false,
    group: 'cosigner',
  },
];
