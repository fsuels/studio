import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'employerName',
    label: 'Employer / Company Name',
    type: 'text',
    required: true,
  },
  {
    id: 'employerAddress',
    label: 'Employer Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'employeeName',
    label: 'Employee Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'employeePosition',
    label: 'Position / Job Title',
    type: 'text',
  },
  {
    id: 'terminationDate',
    label: 'Termination Effective Date',
    type: 'date',
    required: true,
  },
  {
    id: 'terminationReason',
    label: 'Reason for Termination (brief)',
    type: 'textarea',
    placeholder: 'e.g. position eliminated, misconduct, performance',
  },
  {
    id: 'finalPaycheckDate',
    label: 'Final Paycheck Date',
    type: 'date',
    required: true,
  },
  {
    id: 'supervisorName',
    label: 'Supervisor Name',
    type: 'text',
    required: true,
  },
  {
    id: 'supervisorTitle',
    label: 'Supervisor Title',
    type: 'text',
    required: true,
  },
];
