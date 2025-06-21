import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const questions: Question[] = [
  {
    id: 'testatorName',
    label: 'Your Full Name (Testator)',
    type: 'text',
    required: true,
  },
  {
    id: 'testatorAddress',
    label: 'Your Full Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'executorName',
    label: 'Executor Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'executorAddress',
    label: 'Executor Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'alternateExecutorName',
    label: 'Alternate Executor Full Name (Optional)',
    type: 'text',
  },
  {
    id: 'beneficiaries',
    label: 'Beneficiaries and Asset Distribution',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., My house at 123 Main St to my daughter Jane Doe. My savings account to my son John Doe. Residue to...',
  },
  {
    id: 'guardianForMinors',
    label: 'Guardian for Minor Children (if applicable)',
    type: 'text',
    placeholder: 'Full name of guardian',
  },
  {
    id: 'state',
    label: 'State Governing the Will',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
