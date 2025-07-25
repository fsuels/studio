import type { FormQuestion } from '@/types/documents';

export const shareholderAgreementQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    required: true,
    placeholder: 'Enter the full legal name of the company',
    validation: { min: 1 },
  },
  {
    id: 'stateOfIncorporation',
    type: 'select',
    label: 'State of Incorporation',
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
  {
    id: 'companyAddress',
    type: 'textarea',
    label: 'Company Address',
    required: true,
    placeholder: 'Enter the complete address of the company',
    validation: { min: 10, max: 300 },
  },
  {
    id: 'shareholders',
    type: 'array',
    label: 'Shareholders',
    required: true,
    arrayConfig: {
      addButtonText: 'Add Shareholder',
      minItems: 2,
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Shareholder Name',
          required: true,
          placeholder: "Enter shareholder's full name",
        },
        {
          id: 'address',
          type: 'textarea',
          label: 'Address',
          required: true,
          placeholder: 'Enter complete address',
        },
        {
          id: 'sharesOwned',
          type: 'number',
          label: 'Shares Owned',
          required: true,
          validation: { min: 1 },
        },
        {
          id: 'shareClass',
          type: 'text',
          label: 'Share Class',
          required: false,
          defaultValue: 'Common',
          placeholder: 'e.g., Common, Preferred',
        },
        {
          id: 'ownershipPercentage',
          type: 'number',
          label: 'Ownership Percentage',
          required: true,
          validation: { min: 0, max: 100 },
          placeholder: 'Enter percentage (0-100)',
        },
      ],
    },
  },
  {
    id: 'totalShares',
    type: 'number',
    label: 'Total Shares Outstanding',
    required: true,
    validation: { min: 1 },
  },
  {
    id: 'boardOfDirectors.totalDirectors',
    type: 'number',
    label: 'Number of Directors',
    required: true,
    validation: { min: 1 },
  },
  {
    id: 'boardOfDirectors.electionMethod',
    type: 'select',
    label: 'Director Election Method',
    required: true,
    defaultValue: 'majority',
    options: [
      { value: 'majority', label: 'Majority Voting' },
      { value: 'cumulative', label: 'Cumulative Voting' },
      { value: 'class-based', label: 'Class-Based Voting' },
    ],
  },
  {
    id: 'votingAgreements.dragAlongRights',
    type: 'checkbox',
    label: 'Include Drag-Along Rights',
    required: false,
    defaultValue: true,
    helpText:
      'Majority shareholders can force minority shareholders to join in sale',
  },
  {
    id: 'votingAgreements.tagAlongRights',
    type: 'checkbox',
    label: 'Include Tag-Along Rights',
    required: false,
    defaultValue: true,
    helpText: 'Minority shareholders can join in when majority sells',
  },
  {
    id: 'votingAgreements.rightOfFirstRefusal',
    type: 'checkbox',
    label: 'Include Right of First Refusal',
    required: false,
    defaultValue: true,
    helpText:
      'Existing shareholders get first opportunity to buy shares being sold',
  },
  {
    id: 'transferRestrictions.transfersAllowed',
    type: 'checkbox',
    label: 'Allow Free Transfer of Shares',
    required: false,
    defaultValue: false,
  },
  {
    id: 'transferRestrictions.approvalRequired',
    type: 'checkbox',
    label: 'Require Board Approval for Transfers',
    required: false,
    defaultValue: true,
  },
  {
    id: 'buySellProvisions.valuationMethod',
    type: 'select',
    label: 'Share Valuation Method',
    required: true,
    defaultValue: 'appraisal',
    options: [
      { value: 'appraisal', label: 'Professional Appraisal' },
      { value: 'formula', label: 'Formula-Based' },
      { value: 'multiple-of-earnings', label: 'Multiple of Earnings' },
    ],
  },
  {
    id: 'confidentialityClause',
    type: 'checkbox',
    label: 'Include Confidentiality Clause',
    required: false,
    defaultValue: true,
  },
  {
    id: 'nonCompeteClause',
    type: 'checkbox',
    label: 'Include Non-Compete Clause',
    required: false,
    defaultValue: false,
  },
  {
    id: 'nonCompetePeriod',
    type: 'text',
    label: 'Non-Compete Period',
    required: false,
    placeholder: 'e.g., 2 years',
    conditional: { field: 'nonCompeteClause', value: true },
  },
  {
    id: 'disputeResolution.method',
    type: 'select',
    label: 'Dispute Resolution Method',
    required: true,
    defaultValue: 'arbitration',
    options: [
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'mediation', label: 'Mediation' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
  },
  {
    id: 'disputeResolution.governingLaw',
    type: 'select',
    label: 'Governing Law',
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
  {
    id: 'additionalProvisions',
    type: 'textarea',
    label: 'Additional Provisions',
    required: false,
    placeholder: 'Enter any additional terms or provisions for this agreement',
    validation: { max: 1000 },
  },
  {
    id: 'agreementDate',
    type: 'date',
    label: 'Agreement Date',
    required: true,
    helpText: 'Date this shareholder agreement is signed',
  },
  {
    id: 'notarization',
    type: 'checkbox',
    label: 'Require Notarization',
    required: false,
    defaultValue: true,
  },
];
