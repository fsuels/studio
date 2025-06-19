import type { FormQuestion } from '@/types/documents';

export const boardResolutionQuestions: FormQuestion[] = [
  {
    id: 'corporationName',
    type: 'text',
    label: 'Corporation Name',
    required: true,
    placeholder: 'Enter the full legal name of the corporation',
    validation: { min: 1 }
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
      { value: 'WY', label: 'Wyoming' }
    ]
  },
  {
    id: 'meetingType',
    type: 'radio',
    label: 'Meeting Type',
    required: true,
    options: [
      { value: 'regular', label: 'Regular Board Meeting' },
      { value: 'special', label: 'Special Board Meeting' }
    ]
  },
  {
    id: 'meetingDate',
    type: 'date',
    label: 'Meeting Date',
    required: true
  },
  {
    id: 'meetingTime',
    type: 'text',
    label: 'Meeting Time',
    required: true,
    placeholder: 'e.g., 10:00 AM EST'
  },
  {
    id: 'meetingLocation',
    type: 'text',
    label: 'Meeting Location',
    required: true,
    placeholder: 'Enter the physical or virtual meeting location'
  },
  {
    id: 'directorsPresent',
    type: 'array',
    label: 'Directors Present',
    required: true,
    arrayConfig: {
      addButtonText: 'Add Director',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Director Name',
          required: true,
          placeholder: 'Enter director\'s full name'
        },
        {
          id: 'title',
          type: 'text',
          label: 'Title',
          required: false,
          defaultValue: 'Director',
          placeholder: 'e.g., Chairman, Director, President'
        }
      ]
    }
  },
  {
    id: 'totalDirectors',
    type: 'number',
    label: 'Total Number of Directors',
    required: true,
    validation: { min: 1 }
  },
  {
    id: 'quorumRequired',
    type: 'number',
    label: 'Quorum Required',
    required: true,
    helpText: 'Minimum number of directors required for valid meeting',
    validation: { min: 1 }
  },
  {
    id: 'resolutionTitle',
    type: 'text',
    label: 'Resolution Title',
    required: true,
    placeholder: 'Enter a brief title for this resolution'
  },
  {
    id: 'resolutionType',
    type: 'select',
    label: 'Resolution Type',
    required: true,
    options: [
      { value: 'appointment', label: 'Officer/Director Appointment' },
      { value: 'banking', label: 'Banking Resolution' },
      { value: 'contract-approval', label: 'Contract Approval' },
      { value: 'policy-adoption', label: 'Policy Adoption' },
      { value: 'dividend-declaration', label: 'Dividend Declaration' },
      { value: 'stock-issuance', label: 'Stock Issuance' },
      { value: 'merger-acquisition', label: 'Merger/Acquisition' },
      { value: 'loan-authorization', label: 'Loan Authorization' },
      { value: 'lease-approval', label: 'Lease Approval' },
      { value: 'officer-compensation', label: 'Officer Compensation' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'resolutionDescription',
    type: 'textarea',
    label: 'Resolution Description',
    required: true,
    placeholder: 'Provide a detailed description of the resolution being passed',
    validation: { min: 20, max: 2000 }
  },
  {
    id: 'appointmentDetails.appointeeName',
    type: 'text',
    label: 'Appointee Name',
    required: false,
    placeholder: 'Name of person being appointed',
    conditional: { field: 'resolutionType', value: 'appointment' }
  },
  {
    id: 'appointmentDetails.position',
    type: 'text',
    label: 'Position',
    required: false,
    placeholder: 'Position being appointed to',
    conditional: { field: 'resolutionType', value: 'appointment' }
  },
  {
    id: 'appointmentDetails.term',
    type: 'text',
    label: 'Term',
    required: false,
    placeholder: 'Length of appointment term',
    conditional: { field: 'resolutionType', value: 'appointment' }
  },
  {
    id: 'appointmentDetails.compensation',
    type: 'text',
    label: 'Compensation',
    required: false,
    placeholder: 'Compensation details',
    conditional: { field: 'resolutionType', value: 'appointment' }
  },
  {
    id: 'bankingDetails.bankName',
    type: 'text',
    label: 'Bank Name',
    required: false,
    placeholder: 'Name of banking institution',
    conditional: { field: 'resolutionType', value: 'banking' }
  },
  {
    id: 'bankingDetails.accountType',
    type: 'text',
    label: 'Account Type',
    required: false,
    placeholder: 'Type of account (checking, savings, etc.)',
    conditional: { field: 'resolutionType', value: 'banking' }
  },
  {
    id: 'contractDetails.counterparty',
    type: 'text',
    label: 'Contract Counterparty',
    required: false,
    placeholder: 'Other party to the contract',
    conditional: { field: 'resolutionType', value: 'contract-approval' }
  },
  {
    id: 'contractDetails.contractValue',
    type: 'text',
    label: 'Contract Value',
    required: false,
    placeholder: 'Total value of the contract',
    conditional: { field: 'resolutionType', value: 'contract-approval' }
  },
  {
    id: 'votingResults.inFavor',
    type: 'number',
    label: 'Votes in Favor',
    required: true,
    validation: { min: 0 }
  },
  {
    id: 'votingResults.against',
    type: 'number',
    label: 'Votes Against',
    required: true,
    validation: { min: 0 }
  },
  {
    id: 'votingResults.abstentions',
    type: 'number',
    label: 'Abstentions',
    required: true,
    validation: { min: 0 }
  },
  {
    id: 'chairpersonName',
    type: 'text',
    label: 'Chairperson Name',
    required: true,
    placeholder: 'Name of meeting chairperson'
  },
  {
    id: 'secretaryName',
    type: 'text',
    label: 'Secretary Name',
    required: true,
    placeholder: 'Name of corporate secretary'
  },
  {
    id: 'meetingAdjournmentTime',
    type: 'text',
    label: 'Meeting Adjournment Time',
    required: false,
    placeholder: 'e.g., 11:30 AM EST'
  },
  {
    id: 'additionalProvisions',
    type: 'textarea',
    label: 'Additional Provisions',
    required: false,
    placeholder: 'Any additional terms or provisions for this resolution',
    validation: { max: 1000 }
  },
  {
    id: 'resolutionDate',
    type: 'date',
    label: 'Resolution Date',
    required: true,
    helpText: 'Date the resolution is formally adopted'
  },
  {
    id: 'notarization',
    type: 'checkbox',
    label: 'Require Notarization',
    required: false,
    defaultValue: true
  }
];