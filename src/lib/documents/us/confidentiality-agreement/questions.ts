// src/lib/documents/us/confidentiality-agreement/questions.ts
import type { Question } from '@/types/documents';

export const confidentialityAgreementQuestions: Question[] = [
  {
    id: 'disclosingPartyName',
    label: 'Disclosing Party Full Name/Company',
    type: 'text',
    required: true,
  },
  {
    id: 'disclosingPartyAddress',
    label: 'Disclosing Party Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'disclosingPartyTitle',
    label: 'Disclosing Party Title (if applicable)',
    type: 'text',
    placeholder: 'e.g., CEO, President, Director',
  },
  {
    id: 'receivingPartyName',
    label: 'Receiving Party Full Name/Company',
    type: 'text',
    required: true,
  },
  {
    id: 'receivingPartyAddress',
    label: 'Receiving Party Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'receivingPartyTitle',
    label: 'Receiving Party Title (if applicable)',
    type: 'text',
    placeholder: 'e.g., CEO, President, Director',
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date of Agreement',
    type: 'date',
    required: true,
  },
  {
    id: 'purpose',
    label: 'Purpose of Disclosure',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., Evaluation of potential business relationship, due diligence review',
  },
  {
    id: 'confidentialInfoDescription',
    label: 'Description of Confidential Information',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., Technical specifications, business strategies, financial information',
  },
  {
    id: 'termYears',
    label: 'Term of Agreement (Years, 0 for indefinite)',
    type: 'number',
    placeholder: 'e.g., 3',
  },
  {
    id: 'specificExclusions',
    label: 'Specific Information Exclusions (Optional)',
    type: 'textarea',
    placeholder: 'Information that should not be considered confidential',
  },
  {
    id: 'returnDate',
    label: 'Date for Return of Materials (Optional)',
    type: 'date',
    placeholder: 'When materials should be returned',
  },
  {
    id: 'remediesClause',
    label: 'Additional Remedies (Optional)',
    type: 'textarea',
    placeholder: 'Specific remedies for breach of confidentiality',
  },
  {
    id: 'governingState',
    label: 'Governing State',
    type: 'select',
    required: true,
    options: [
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' },
    ],
  },
];
