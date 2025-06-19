import { DocumentQuestion } from '@/types/documents';

export const holdHarmlessAgreementQuestions: DocumentQuestion[] = [
  // Agreement Type
  {
    id: 'agreementType',
    text: 'What type of hold harmless agreement do you need?',
    type: 'select',
    required: true,
    options: [
      { value: 'unilateral', label: 'Unilateral (One party protected)' },
      { value: 'mutual', label: 'Mutual (Both parties protected)' }
    ],
    helpText: 'Unilateral protects only one party, mutual protects both parties'
  },

  // Indemnitee Information
  {
    id: 'indemnitee.type',
    text: 'Who is being protected (Indemnitee)?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business/Organization' }
    ]
  },
  {
    id: 'indemnitee.name',
    text: 'Full legal name of the protected party',
    type: 'text',
    required: true,
    placeholder: 'John Smith or ABC Company, LLC'
  },
  {
    id: 'indemnitee.address',
    text: 'Street address of the protected party',
    type: 'text',
    required: true,
    placeholder: '123 Main Street'
  },
  {
    id: 'indemnitee.city',
    text: 'City',
    type: 'text',
    required: true
  },
  {
    id: 'indemnitee.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'indemnitee.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
  },

  // Indemnitor Information
  {
    id: 'indemnitor.type',
    text: 'Who is assuming the risk (Indemnitor)?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business/Organization' }
    ]
  },
  {
    id: 'indemnitor.name',
    text: 'Full legal name of the party assuming risk',
    type: 'text',
    required: true,
    placeholder: 'Jane Doe or XYZ Corporation'
  },
  {
    id: 'indemnitor.address',
    text: 'Street address of the party assuming risk',
    type: 'text',
    required: true,
    placeholder: '456 Oak Avenue'
  },
  {
    id: 'indemnitor.city',
    text: 'City',
    type: 'text',
    required: true
  },
  {
    id: 'indemnitor.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'indemnitor.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
  },

  // Activity Details
  {
    id: 'effectiveDate',
    text: 'When does this agreement become effective?',
    type: 'date',
    required: true
  },
  {
    id: 'activityDescription',
    text: 'Describe the activity, event, or situation covered by this agreement',
    type: 'textarea',
    required: true,
    placeholder: 'Provide a detailed description of the activity, project, or situation...',
    minLength: 50
  },
  {
    id: 'location',
    text: 'Where will the activity take place? (Optional)',
    type: 'text',
    required: false,
    placeholder: 'Specific address or general location'
  },
  {
    id: 'duration.type',
    text: 'What is the duration of this agreement?',
    type: 'select',
    required: true,
    options: [
      { value: 'oneTime', label: 'One-time event' },
      { value: 'ongoing', label: 'Ongoing/Indefinite' },
      { value: 'specific', label: 'Specific time period' }
    ]
  },

  // Scope of Protection
  {
    id: 'scopeOfProtection',
    text: 'What types of liability are covered?',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'propertyDamage', label: 'Property damage' },
      { value: 'personalInjury', label: 'Personal injury' },
      { value: 'financialLoss', label: 'Financial loss' },
      { value: 'intellectualProperty', label: 'Intellectual property claims' }
    ],
    helpText: 'Select all that apply'
  },

  // Specific Risks
  {
    id: 'specificRisks',
    text: 'List specific risks or hazards associated with the activity',
    type: 'array',
    required: true,
    placeholder: 'E.g., Physical injury from equipment use',
    helpText: 'Add each risk separately'
  },

  // Insurance
  {
    id: 'insuranceRequired',
    text: 'Is insurance required?',
    type: 'boolean',
    required: true,
    helpText: 'Will the indemnitor need to maintain insurance coverage?'
  },
  {
    id: 'insuranceDetails.minimumCoverage',
    text: 'Minimum insurance coverage amount',
    type: 'number',
    required: false,
    placeholder: '1000000',
    conditionalOn: { field: 'insuranceRequired', value: true }
  },

  // Additional Provisions
  {
    id: 'additionalProvisions.defendDutyIncluded',
    text: 'Include duty to defend?',
    type: 'boolean',
    required: true,
    helpText: 'Requires indemnitor to provide legal defense'
  },
  {
    id: 'additionalProvisions.attorneyFeesIncluded',
    text: 'Include attorney fees in indemnification?',
    type: 'boolean',
    required: true
  },

  // Governing Law
  {
    id: 'governingState',
    text: 'Which state\'s laws will govern this agreement?',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'disputeResolution',
    text: 'How will disputes be resolved?',
    type: 'select',
    required: true,
    options: [
      { value: 'litigation', label: 'Court litigation' },
      { value: 'arbitration', label: 'Binding arbitration' },
      { value: 'mediation', label: 'Mediation first, then litigation' }
    ]
  }
];