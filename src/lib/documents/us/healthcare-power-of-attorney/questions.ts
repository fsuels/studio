import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const questions: Question[] = [
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
    label: "Healthcare Agent's Full Name",
    type: 'text',
    required: true,
  },
  {
    id: 'agentAddress',
    label: "Healthcare Agent's Full Address",
    type: 'textarea',
    required: true,
  },
  {
    id: 'alternateAgentName',
    label: "Alternate Healthcare Agent's Full Name (Optional)",
    type: 'text',
  },
  {
    id: 'lifeSupportPreferences',
    label: 'Preferences regarding life support (Optional)',
    type: 'textarea',
    placeholder: 'e.g., I do/do not want artificial respiration...',
  },
  {
    id: 'state',
    label: 'State Governing the POA',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
