// src/lib/documents/us/corporate-bylaws/questions.ts
import type { FormQuestion } from '@/types/documents';

export const corporateBylawsQuestions: FormQuestion[] = [
  {
    id: 'corporationName',
    type: 'text',
    label: 'Corporation Name',
    placeholder: 'Enter corporation name',
    required: true,
    section: 'Corporation Information',
  },
  {
    id: 'stateOfIncorporation',
    type: 'select',
    label: 'State of Incorporation',
    options: [
      { value: 'CA', label: 'California' },
      { value: 'DE', label: 'Delaware' },
      { value: 'NY', label: 'New York' },
      { value: 'TX', label: 'Texas' },
    ],
    required: true,
    section: 'Corporation Information',
  },
  {
    id: 'principalOfficeAddress',
    type: 'address',
    label: 'Principal Office Address',
    required: true,
    section: 'Corporation Information',
  },
  {
    id: 'registeredAgentName',
    type: 'text',
    label: 'Registered Agent Name',
    required: true,
    section: 'Corporation Information',
  },
  {
    id: 'authorizedShares',
    type: 'text',
    label: 'Number of Authorized Shares',
    required: true,
    section: 'Shareholders',
  },
  {
    id: 'numberOfDirectors',
    type: 'text',
    label: 'Number of Directors',
    required: true,
    section: 'Board of Directors',
  },
  {
    id: 'directorTermLength',
    type: 'text',
    label: 'Director Term Length',
    required: true,
    section: 'Board of Directors',
  },
  {
    id: 'requiredOfficers',
    type: 'textarea',
    label: 'Required Officers',
    required: true,
    section: 'Officers',
  },
  {
    id: 'adoptionDate',
    type: 'date',
    label: 'Adoption Date',
    required: true,
    section: 'Execution',
  },
];
