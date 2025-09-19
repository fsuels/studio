import { usStates } from '@/lib/usStates';
import type { Question } from '@/types/documents';

export const prenuptialAgreementQuestions: Question[] = [
  {
    id: 'spouse1Name',
    label: 'First spouse full legal name',
    type: 'text',
    required: true,
    placeholder: 'Spouse 1 name',
  },
  {
    id: 'spouse2Name',
    label: 'Second spouse full legal name',
    type: 'text',
    required: true,
    placeholder: 'Spouse 2 name',
  },
  {
    id: 'weddingDate',
    label: 'Planned wedding date',
    type: 'date',
    required: true,
  },
  {
    id: 'ceremonyState',
    label: 'State where the ceremony will take place',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
  {
    id: 'primaryResidenceState',
    label: 'Primary state of residence after marriage',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
  {
    id: 'separatePropertyList',
    label: 'Separate property to remain with each spouse',
    type: 'textarea',
    placeholder: 'List assets either spouse will keep as separate property.',
    helperText: 'Include major assets, inheritances, or business interests that should remain separate.',
  },
  {
    id: 'maritalPropertyPlan',
    label: 'How will marital property be handled?',
    type: 'textarea',
    placeholder: 'Describe how assets acquired after marriage will be owned or divided.',
  },
  {
    id: 'debtResponsibilityPlan',
    label: 'Responsibility for debts',
    type: 'textarea',
    placeholder: 'Outline who is responsible for current or future debts.',
  },
  {
    id: 'spousalSupportPreference',
    label: 'Spousal support (alimony) plan',
    type: 'select',
    required: true,
    options: [
      { value: 'waived', label: 'Each spouse waives support' },
      { value: 'limited', label: 'Limited support with caps' },
      { value: 'custom', label: 'Custom support arrangement' },
      { value: 'state-default', label: 'Follow state default laws' },
    ],
  },
  {
    id: 'spousalSupportDetails',
    label: 'Spousal support details',
    type: 'textarea',
    placeholder: 'Specify payment amounts, duration, or triggers for support.',
    helperText: 'If support is waived, you can leave this blank.',
  },
  {
    id: 'sunsetClauseDate',
    label: 'Sunset clause date (if agreement expires)',
    type: 'date',
    helperText: 'Optional: choose a date when the agreement terminates unless renewed.',
  },
  {
    id: 'estatePlanningNotes',
    label: 'Estate planning or inheritance notes',
    type: 'textarea',
    placeholder: 'Document beneficiary designations, trusts, or inheritances.',
  },
  {
    id: 'childrenFromPriorRelationships',
    label: 'Either spouse has children from prior relationships?',
    type: 'boolean',
  },
  {
    id: 'independentCounsel',
    label: 'Both parties will consult independent legal counsel',
    type: 'boolean',
  },
  {
    id: 'financialDisclosureComplete',
    label: 'Have both spouses fully disclosed assets and liabilities?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'disputeResolution',
    label: 'Preferred dispute resolution method',
    type: 'select',
    required: true,
    options: [
      { value: 'mediation', label: 'Mediation first' },
      { value: 'arbitration', label: 'Binding arbitration' },
      { value: 'litigation', label: 'Court litigation if needed' },
    ],
  },
  {
    id: 'governingLawState',
    label: 'State governing this agreement',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
  {
    id: 'witnessRequirement',
    label: 'Execution requirements',
    type: 'select',
    required: true,
    options: [
      { value: 'notary-only', label: 'Notary acknowledgment only' },
      { value: 'witnesses-only', label: 'Two witness signatures' },
      { value: 'notary-plus-witnesses', label: 'Notary + witnesses' },
    ],
  },
];
