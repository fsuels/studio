import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    required: true,
    category: 'Company Information',
  },
  {
    id: 'employeeName',
    type: 'text',
    label: 'Employee Full Name',
    required: true,
    category: 'Employee Information',
  },
  {
    id: 'employeeId',
    type: 'text',
    label: 'Employee ID (Optional)',
    required: false,
    category: 'Employee Information',
  },
  {
    id: 'signatureDate',
    type: 'date',
    label: 'Date',
    required: true,
    category: 'Signatures',
  },
];
