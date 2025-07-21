import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'trustorName',
    label: 'Trustor Full Name (Trust Creator)',
    type: 'text',
    required: true,
    placeholder: 'Enter the full name of the person who created the trust',
  },
  {
    id: 'originalTrustName',
    label: 'Original Trust Name',
    type: 'text',
    required: true,
    placeholder: 'Enter the full legal name of the trust being amended',
  },
  {
    id: 'originalTrustDate',
    label: 'Original Trust Date',
    type: 'date',
    required: true,
  },
  {
    id: 'amendmentNumber',
    label: 'Amendment Number',
    type: 'text',
    required: true,
    placeholder: 'First Amendment, Second Amendment, etc.',
  },
  {
    id: 'amendmentDate',
    label: 'Amendment Date',
    type: 'date',
    required: true,
  },
  {
    id: 'amendmentType',
    label: 'Type of Amendment',
    type: 'select',
    required: true,
    options: [
      { value: 'beneficiary_change', label: 'Beneficiary Changes' },
      { value: 'trustee_change', label: 'Trustee Changes' },
      { value: 'distribution_change', label: 'Distribution Changes' },
      { value: 'asset_change', label: 'Asset Changes' },
      { value: 'other', label: 'Other Changes' },
    ],
  },
  {
    id: 'sectionBeingAmended',
    label: 'Section/Article Being Amended',
    type: 'text',
    required: true,
    placeholder:
      'Specify which section, article, or paragraph is being amended',
  },
  {
    id: 'specificChanges',
    label: 'Description of Changes',
    type: 'textarea',
    required: true,
    placeholder: 'Describe in detail what changes are being made to the trust',
  },
  {
    id: 'newLanguage',
    label: 'New Language/Terms',
    type: 'textarea',
    required: true,
    placeholder:
      'Enter the exact new language that will replace or be added to the trust',
  },
  {
    id: 'replacementClause',
    label: 'Replacement Clause (Optional)',
    type: 'textarea',
    placeholder: 'If completely replacing a section, enter the new clause here',
  },
  {
    id: 'additionalProvisions',
    label: 'Additional Provisions (Optional)',
    type: 'textarea',
    placeholder: 'Any additional terms or conditions related to this amendment',
  },
  {
    id: 'witnessOneName',
    label: 'First Witness Full Name',
    type: 'text',
    required: true,
    placeholder: 'Adult witness to amendment signing',
  },
  {
    id: 'witnessTwoName',
    label: 'Second Witness Full Name',
    type: 'text',
    required: true,
    placeholder: 'Second adult witness to amendment signing',
  },
  {
    id: 'executionState',
    label: 'State Where Amendment is Executed',
    type: 'text',
    required: true,
    placeholder: 'State where you are signing this amendment',
  },
  {
    id: 'executionCounty',
    label: 'County Where Amendment is Executed',
    type: 'text',
    required: true,
    placeholder: 'County where you are signing this amendment',
  },
];
