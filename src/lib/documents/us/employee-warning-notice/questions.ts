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
    id: 'jobTitle',
    type: 'text',
    label: 'Job Title',
    required: true,
    category: 'Employee Information',
  },
  {
    id: 'department',
    type: 'text',
    label: 'Department (Optional)',
    required: false,
    category: 'Employee Information',
  },
  {
    id: 'supervisorName',
    type: 'text',
    label: 'Supervisor Name',
    required: true,
    category: 'Employee Information',
  },
  {
    id: 'warningType',
    type: 'select',
    label: 'Type of Warning',
    required: true,
    category: 'Warning Details',
    options: ['Verbal Warning', 'Written Warning', 'Final Warning'],
  },
  {
    id: 'incidentDate',
    type: 'date',
    label: 'Date of Incident',
    required: true,
    category: 'Warning Details',
  },
  {
    id: 'warningDate',
    type: 'date',
    label: 'Date of Warning',
    required: true,
    category: 'Warning Details',
  },
  {
    id: 'violationType',
    type: 'select',
    label: 'Type of Violation',
    required: true,
    category: 'Violation Information',
    options: [
      'Attendance',
      'Performance',
      'Conduct',
      'Policy Violation',
      'Safety',
      'Other',
    ],
  },
  {
    id: 'violationDescription',
    type: 'textarea',
    label: 'Description of Violation',
    required: true,
    category: 'Violation Information',
    placeholder: 'Provide detailed description of the violation or incident',
  },
  {
    id: 'correctiveActionRequired',
    type: 'textarea',
    label: 'Required Corrective Action',
    required: true,
    category: 'Corrective Action',
    placeholder: 'Describe the specific actions the employee must take',
  },
  {
    id: 'consequencesDescription',
    type: 'textarea',
    label: 'Consequences of Further Violations',
    required: true,
    category: 'Corrective Action',
    placeholder: 'Describe what will happen if the behavior continues',
  },
  {
    id: 'signatureDate',
    type: 'date',
    label: 'Date',
    required: true,
    category: 'Signatures',
  },
  {
    id: 'supervisorSignatureDate',
    type: 'date',
    label: 'Supervisor Signature Date',
    required: true,
    category: 'Signatures',
  },
];
