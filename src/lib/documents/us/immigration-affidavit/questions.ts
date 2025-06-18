// src/lib/documents/us/immigration-affidavit/questions.ts
import type { FormQuestion } from '@/types/documents';

export const immigrationAffidavitQuestions: FormQuestion[] = [
  {
    id: 'affiantName',
    type: 'text',
    label: 'Affiant Name',
    placeholder: 'Enter person making the affidavit',
    required: true,
    group: 'affiant',
  },
  {
    id: 'beneficiaryName',
    type: 'text',
    label: 'Beneficiary Name',
    placeholder: 'Enter person being supported',
    required: true,
    group: 'beneficiary',
  },
  {
    id: 'relationshipToBeneficiary',
    type: 'text',
    label: 'Relationship to Beneficiary',
    placeholder: 'e.g., spouse, parent, employer',
    required: true,
    group: 'relationship',
  },
  {
    id: 'affidavitType',
    type: 'select',
    label: 'Affidavit Type',
    options: [
      { value: 'support', label: 'Affidavit of Support' },
      { value: 'relationship', label: 'Relationship Affidavit' },
      { value: 'character', label: 'Character Reference' },
      { value: 'employment', label: 'Employment Affidavit' },
      { value: 'financial', label: 'Financial Support' },
    ],
    required: true,
    group: 'type',
  },
  {
    id: 'purpose',
    type: 'textarea',
    label: 'Purpose of Affidavit',
    placeholder: 'Explain the purpose and context',
    required: true,
    group: 'purpose',
  },
  {
    id: 'swornStatement',
    type: 'textarea',
    label: 'Sworn Statement',
    placeholder: 'Enter the detailed sworn statement',
    required: true,
    group: 'statement',
  },
];