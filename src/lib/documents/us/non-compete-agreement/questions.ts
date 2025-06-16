import type { Question } from '@/types/documents';

export const questions: Question[] = [
  { 
    id: 'companyName', 
    label: 'Company Name', 
    type: 'text', 
    required: true 
  },
  {
    id: 'employeeName',
    label: 'Employee/Contractor Name',
    type: 'text',
    required: true,
  },
  {
    id: 'restrictedActivities',
    label: 'Description of Restricted Activities',
    type: 'textarea',
    required: true,
  },
  {
    id: 'geographicScope',
    label: 'Geographic Scope of Restriction',
    type: 'text',
    placeholder:
      'e.g., 50 miles radius from main office, State of California',
  },
  {
    id: 'durationMonths',
    label: 'Duration of Restriction (Months after termination)',
    type: 'number',
    required: true,
  },
];