import { DocumentQuestion } from '@/types/documents';

export const liabilityWaiverQuestions: DocumentQuestion[] = [
  // Organization Information
  {
    id: 'organization.name',
    text: 'What is the name of your organization?',
    type: 'text',
    required: true,
    placeholder: 'ABC Fitness Center, LLC'
  },
  {
    id: 'organization.type',
    text: 'What type of organization is this?',
    type: 'select',
    required: true,
    options: [
      { value: 'business', label: 'Business' },
      { value: 'nonprofit', label: 'Non-profit organization' },
      { value: 'government', label: 'Government entity' },
      { value: 'individual', label: 'Individual/Sole proprietor' }
    ]
  },
  {
    id: 'organization.address',
    text: 'Organization street address',
    type: 'text',
    required: true,
    placeholder: '123 Main Street'
  },
  {
    id: 'organization.city',
    text: 'City',
    type: 'text',
    required: true
  },
  {
    id: 'organization.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'organization.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
  },
  {
    id: 'organization.phone',
    text: 'Phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567'
  },
  {
    id: 'organization.email',
    text: 'Contact email',
    type: 'email',
    required: true,
    placeholder: 'contact@example.com'
  },

  // Activity Information
  {
    id: 'activity.name',
    text: 'What is the name of the activity or program?',
    type: 'text',
    required: true,
    placeholder: 'Rock Climbing Experience'
  },
  {
    id: 'activity.type',
    text: 'What type of activity is this?',
    type: 'select',
    required: true,
    options: [
      { value: 'sports', label: 'Sports/Athletics' },
      { value: 'fitness', label: 'Fitness/Exercise' },
      { value: 'adventure', label: 'Adventure/Outdoor' },
      { value: 'educational', label: 'Educational/Workshop' },
      { value: 'entertainment', label: 'Entertainment/Recreation' },
      { value: 'medical', label: 'Medical/Wellness' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'activity.description',
    text: 'Describe the activity in detail',
    type: 'textarea',
    required: true,
    placeholder: 'Provide a comprehensive description of the activity, including what participants will be doing...',
    minLength: 50
  },
  {
    id: 'activity.location',
    text: 'Where does the activity take place?',
    type: 'text',
    required: true,
    placeholder: 'Facility name and/or address'
  },
  {
    id: 'activity.frequency',
    text: 'How often does this activity occur?',
    type: 'select',
    required: true,
    options: [
      { value: 'oneTime', label: 'One-time event' },
      { value: 'recurring', label: 'Recurring activity' },
      { value: 'membership', label: 'Ongoing membership' }
    ]
  },

  // Participant Information
  {
    id: 'participantInfo.requireEmergencyContact',
    text: 'Require emergency contact information?',
    type: 'boolean',
    required: true,
    helpText: 'Highly recommended for activities with physical risks'
  },
  {
    id: 'participantInfo.requireMedicalInfo',
    text: 'Require medical information disclosure?',
    type: 'boolean',
    required: true,
    helpText: 'Important for physical activities'
  },

  // Risks
  {
    id: 'risks.generalRisks',
    text: 'List the general risks associated with this activity',
    type: 'array',
    required: true,
    placeholder: 'E.g., Physical injury, muscle strain, falls',
    helpText: 'Add each risk separately'
  },
  {
    id: 'risks.specificHazards',
    text: 'List any specific hazards (optional)',
    type: 'array',
    required: false,
    placeholder: 'E.g., Heights, water hazards, equipment malfunction'
  },

  // Medical Considerations
  {
    id: 'medical.requireMedicalDisclosure',
    text: 'Require participants to disclose medical conditions?',
    type: 'boolean',
    required: true
  },
  {
    id: 'medical.requirePhysicianClearance',
    text: 'Require physician clearance for participation?',
    type: 'boolean',
    required: true
  },
  {
    id: 'medical.firstAidAvailable',
    text: 'Is first aid available on site?',
    type: 'boolean',
    required: true
  },
  {
    id: 'medical.medicalPersonnelOnSite',
    text: 'Are medical personnel present during activities?',
    type: 'boolean',
    required: true
  },

  // Waiver Clauses
  {
    id: 'waiverClauses.photoVideoRelease',
    text: 'Include photo/video release?',
    type: 'boolean',
    required: true,
    helpText: 'Allows use of participant images for marketing'
  },
  {
    id: 'waiverClauses.equipmentResponsibility',
    text: 'Include equipment damage responsibility clause?',
    type: 'boolean',
    required: true,
    helpText: 'Makes participants responsible for damaged equipment'
  },

  // Minor Provisions
  {
    id: 'minorProvisions.allowMinors',
    text: 'Do you allow minors to participate?',
    type: 'boolean',
    required: true
  },
  {
    id: 'minorProvisions.minimumAge',
    text: 'Minimum age requirement (if any)',
    type: 'number',
    required: false,
    placeholder: '13',
    conditionalOn: { field: 'minorProvisions.allowMinors', value: true }
  },

  // Insurance
  {
    id: 'insurance.participantInsuranceRequired',
    text: 'Do participants need their own insurance?',
    type: 'boolean',
    required: true
  },
  {
    id: 'insurance.organizationInsured',
    text: 'Does your organization have liability insurance?',
    type: 'boolean',
    required: true
  },

  // Legal Provisions
  {
    id: 'legalProvisions.governingState',
    text: 'Which state\'s laws will govern this waiver?',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'legalProvisions.venueJurisdiction',
    text: 'County for legal venue/jurisdiction',
    type: 'text',
    required: true,
    placeholder: 'County name'
  },

  // Signature Requirements
  {
    id: 'signatureRequirements.witnessRequired',
    text: 'Require witness signature?',
    type: 'boolean',
    required: true
  },
  {
    id: 'signatureRequirements.notarizationRequired',
    text: 'Require notarization?',
    type: 'boolean',
    required: true
  }
];