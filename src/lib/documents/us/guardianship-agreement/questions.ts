// src/lib/documents/us/guardianship-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const guardianshipAgreementQuestions: FormQuestion[] = [
  {
    id: 'wardName',
    type: 'text',
    label: 'Ward Name',
    placeholder: 'Enter ward name',
    required: true,
    group: 'ward',
  },
  {
    id: 'guardianName',
    type: 'text',
    label: 'Guardian Name',
    placeholder: 'Enter guardian name',
    required: true,
    group: 'guardian',
  },
  {
    id: 'guardianshipType',
    type: 'select',
    label: 'Guardianship Type',
    options: [
      { value: 'person', label: 'Guardianship of Person' },
      { value: 'estate', label: 'Guardianship of Estate' },
      { value: 'both', label: 'Both Person and Estate' },
    ],
    required: false,
    group: 'type',
  },
  {
    id: 'guardianRelationship',
    type: 'select',
    label: 'Relationship to Ward',
    options: [
      { value: 'parent', label: 'Parent' },
      { value: 'spouse', label: 'Spouse' },
      { value: 'sibling', label: 'Sibling' },
      { value: 'child', label: 'Child' },
      { value: 'relative', label: 'Other Relative' },
      { value: 'friend', label: 'Friend' },
      { value: 'professional', label: 'Professional Guardian' },
    ],
    required: false,
    group: 'guardian',
  },
  {
    id: 'medicalDecisions',
    type: 'boolean',
    label: 'Medical decision authority?',
    required: false,
    group: 'powers',
  },
  {
    id: 'financialManagement',
    type: 'boolean',
    label: 'Financial management authority?',
    required: false,
    group: 'powers',
  },
];
