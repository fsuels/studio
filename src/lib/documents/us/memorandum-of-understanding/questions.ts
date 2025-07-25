// src/lib/documents/us/memorandum-of-understanding/questions.ts
import type { FormQuestion } from '@/types/documents';

export const memorandumOfUnderstandingQuestions: FormQuestion[] = [
  {
    id: 'mouTitle',
    type: 'text',
    label: 'MOU Title',
    placeholder: 'e.g., Collaboration Agreement, Research Partnership MOU',
    required: true,
    group: 'basic',
  },
  {
    id: 'mouPurpose',
    type: 'textarea',
    label: 'Purpose of MOU',
    placeholder: 'Describe the main purpose and goals of this memorandum',
    required: true,
    group: 'basic',
  },
  {
    id: 'background',
    type: 'textarea',
    label: 'Background Information',
    placeholder: 'Provide context and background for this cooperation',
    required: false,
    group: 'basic',
  },
  {
    id: 'objectives',
    type: 'textarea',
    label: 'Objectives',
    placeholder: 'List the specific objectives this MOU aims to achieve',
    required: true,
    group: 'basic',
  },
  {
    id: 'party1Name',
    type: 'text',
    label: 'First Party Name',
    placeholder: 'Enter organization or individual name',
    required: true,
    group: 'party1',
  },
  {
    id: 'party1Type',
    type: 'select',
    label: 'First Party Type',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'corporation', label: 'Corporation' },
      { value: 'llc', label: 'LLC' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'government', label: 'Government Agency' },
      { value: 'nonprofit', label: 'Nonprofit Organization' },
    ],
    required: true,
    group: 'party1',
  },
  {
    id: 'party1Address',
    type: 'textarea',
    label: 'First Party Address',
    placeholder: 'Enter complete address',
    required: true,
    group: 'party1',
  },
  {
    id: 'party1Representative',
    type: 'text',
    label: 'First Party Representative',
    placeholder: 'Name of authorized representative',
    required: false,
    group: 'party1',
  },
  {
    id: 'party1Title',
    type: 'text',
    label: 'First Party Representative Title',
    placeholder: 'Title of the representative',
    required: false,
    group: 'party1',
  },
  {
    id: 'party2Name',
    type: 'text',
    label: 'Second Party Name',
    placeholder: 'Enter organization or individual name',
    required: true,
    group: 'party2',
  },
  {
    id: 'party2Type',
    type: 'select',
    label: 'Second Party Type',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'corporation', label: 'Corporation' },
      { value: 'llc', label: 'LLC' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'government', label: 'Government Agency' },
      { value: 'nonprofit', label: 'Nonprofit Organization' },
    ],
    required: true,
    group: 'party2',
  },
  {
    id: 'party2Address',
    type: 'textarea',
    label: 'Second Party Address',
    placeholder: 'Enter complete address',
    required: true,
    group: 'party2',
  },
  {
    id: 'party2Representative',
    type: 'text',
    label: 'Second Party Representative',
    placeholder: 'Name of authorized representative',
    required: false,
    group: 'party2',
  },
  {
    id: 'party2Title',
    type: 'text',
    label: 'Second Party Representative Title',
    placeholder: 'Title of the representative',
    required: false,
    group: 'party2',
  },
  {
    id: 'party1Responsibilities',
    type: 'textarea',
    label: 'First Party Responsibilities',
    placeholder:
      'List specific responsibilities and commitments of the first party',
    required: true,
    group: 'responsibilities',
  },
  {
    id: 'party2Responsibilities',
    type: 'textarea',
    label: 'Second Party Responsibilities',
    placeholder:
      'List specific responsibilities and commitments of the second party',
    required: true,
    group: 'responsibilities',
  },
  {
    id: 'mutualBenefits',
    type: 'textarea',
    label: 'Mutual Benefits',
    placeholder: 'Describe benefits each party will receive',
    required: false,
    group: 'responsibilities',
  },
  {
    id: 'effectiveDate',
    type: 'date',
    label: 'Effective Date',
    required: true,
    group: 'timeline',
  },
  {
    id: 'expirationDate',
    type: 'date',
    label: 'Expiration Date',
    required: false,
    group: 'timeline',
  },
  {
    id: 'duration',
    type: 'text',
    label: 'Duration',
    placeholder: 'e.g., 2 years, indefinite, ongoing',
    required: false,
    group: 'timeline',
  },
  {
    id: 'renewalTerms',
    type: 'textarea',
    label: 'Renewal Terms',
    placeholder: 'Specify how the MOU can be renewed',
    required: false,
    group: 'timeline',
  },
  {
    id: 'primaryContact1',
    type: 'text',
    label: 'First Party Primary Contact',
    placeholder: 'Name and contact information',
    required: false,
    group: 'communication',
  },
  {
    id: 'primaryContact2',
    type: 'text',
    label: 'Second Party Primary Contact',
    placeholder: 'Name and contact information',
    required: false,
    group: 'communication',
  },
  {
    id: 'meetingSchedule',
    type: 'text',
    label: 'Meeting Schedule',
    placeholder: 'e.g., Monthly, Quarterly, As needed',
    required: false,
    group: 'communication',
  },
  {
    id: 'reportingRequirements',
    type: 'textarea',
    label: 'Reporting Requirements',
    placeholder: 'Specify any reporting obligations',
    required: false,
    group: 'communication',
  },
  {
    id: 'confidentialityClause',
    type: 'checkbox',
    label: 'Include confidentiality provisions',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'confidentialityTerms',
    type: 'textarea',
    label: 'Confidentiality Terms',
    placeholder: 'Specify confidentiality obligations',
    required: false,
    group: 'confidentiality',
    dependsOn: 'confidentialityClause',
  },
  {
    id: 'governingLaw',
    type: 'text',
    label: 'Governing Law',
    placeholder: 'e.g., State of California',
    required: false,
    group: 'legal',
  },
  {
    id: 'disputeResolution',
    type: 'select',
    label: 'Dispute Resolution Method',
    options: [
      { value: 'negotiation', label: 'Good Faith Negotiation' },
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
    ],
    required: false,
    group: 'legal',
  },
  {
    id: 'terminationClause',
    type: 'textarea',
    label: 'Termination Conditions',
    placeholder: 'Specify conditions under which the MOU can be terminated',
    required: false,
    group: 'termination',
  },
  {
    id: 'noticePeriod',
    type: 'text',
    label: 'Notice Period for Termination',
    placeholder: '30 days',
    required: false,
    group: 'termination',
  },
  {
    id: 'additionalTerms',
    type: 'textarea',
    label: 'Additional Terms',
    placeholder: 'Any additional terms or special provisions',
    required: false,
    group: 'additional',
  },
];
