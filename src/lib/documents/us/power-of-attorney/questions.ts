import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const powerOfAttorneyQuestions: Question[] = [
  {
    id: 'principalName',
    label: "Principal's Full Name (Person granting power)",
    type: 'text',
    required: true,
  },
  {
    id: 'principalAddress',
    label: "Principal's Full Address",
    type: 'textarea',
    required: true,
  },
  {
    id: 'agentName',
    label: "Agent's Full Name (Person receiving power)",
    type: 'text',
    required: true,
  },
  {
    id: 'agentAddress',
    label: "Agent's Full Address",
    type: 'textarea',
    required: true,
  },
  {
    id: 'alternateAgentName',
    label: "Alternate Agent's Full Name (Optional)",
    type: 'text',
  },
  {
    id: 'effectiveDateType',
    label: 'When does this POA become effective?',
    type: 'select',
    options: [
      { value: 'immediately', label: 'Immediately' },
      { value: 'incapacity', label: 'Upon my incapacity' },
    ],
    required: true,
  },
  {
    id: 'isDurable',
    label: 'Is this a Durable POA (remains effective after incapacity)?',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes (Durable)' },
      { value: 'no', label: 'No (Terminates on incapacity)' },
    ],
    required: true,
  },
  {
    id: 'state',
    label: 'State Governing the POA',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];