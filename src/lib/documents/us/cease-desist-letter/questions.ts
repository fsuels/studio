import { DocumentQuestion } from '@/types/documents';

export const ceaseDesistLetterQuestions: DocumentQuestion[] = [
  // Sender Information
  {
    id: 'sender.type',
    text: 'Who is sending this cease and desist letter?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business/Organization' },
      { value: 'attorney', label: 'Attorney/Law Firm' }
    ]
  },
  {
    id: 'sender.name',
    text: 'Your full name or business name',
    type: 'text',
    required: true,
    placeholder: 'John Smith or ABC Company, LLC'
  },
  {
    id: 'sender.address',
    text: 'Your street address',
    type: 'text',
    required: true,
    placeholder: '123 Main Street'
  },
  {
    id: 'sender.city',
    text: 'City',
    type: 'text',
    required: true
  },
  {
    id: 'sender.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'sender.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
  },
  {
    id: 'sender.phone',
    text: 'Phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567'
  },
  {
    id: 'sender.email',
    text: 'Email address',
    type: 'email',
    required: true,
    placeholder: 'contact@example.com'
  },

  // Recipient Information
  {
    id: 'recipient.type',
    text: 'Who are you sending this letter to?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual person' },
      { value: 'business', label: 'Business/Organization' },
      { value: 'unknown', label: 'Unknown entity' }
    ]
  },
  {
    id: 'recipient.name',
    text: 'Recipient\'s name or business name',
    type: 'text',
    required: true,
    placeholder: 'Jane Doe or XYZ Corporation'
  },
  {
    id: 'recipient.address',
    text: 'Recipient\'s address',
    type: 'text',
    required: true,
    placeholder: '456 Oak Avenue'
  },
  {
    id: 'recipient.city',
    text: 'City',
    type: 'text',
    required: true
  },
  {
    id: 'recipient.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'recipient.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345'
  },

  // Violation Details
  {
    id: 'violation.type',
    text: 'What type of violation or harmful activity is occurring?',
    type: 'select',
    required: true,
    options: [
      { value: 'trademark_infringement', label: 'Trademark infringement' },
      { value: 'copyright_infringement', label: 'Copyright infringement' },
      { value: 'patent_infringement', label: 'Patent infringement' },
      { value: 'harassment', label: 'Harassment' },
      { value: 'defamation', label: 'Defamation/Libel/Slander' },
      { value: 'breach_of_contract', label: 'Breach of contract' },
      { value: 'unfair_competition', label: 'Unfair competition' },
      { value: 'trade_secret_theft', label: 'Trade secret theft' },
      { value: 'privacy_invasion', label: 'Invasion of privacy' },
      { value: 'debt_collection_abuse', label: 'Abusive debt collection' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'violation.description',
    text: 'Describe the harmful activity in detail',
    type: 'textarea',
    required: true,
    placeholder: 'Provide a comprehensive description of the activities you want stopped, including dates, locations, and specific actions...',
    minLength: 100
  },
  {
    id: 'violation.specificActivities',
    text: 'List specific activities that must stop',
    type: 'array',
    required: true,
    placeholder: 'E.g., Using my copyrighted images on their website',
    helpText: 'Add each specific activity separately'
  },
  {
    id: 'violation.ongoingViolation',
    text: 'Is this an ongoing violation?',
    type: 'boolean',
    required: true,
    helpText: 'Is the harmful activity continuing to occur?'
  },

  // Evidence
  {
    id: 'evidence.documentsAvailable',
    text: 'Do you have documents as evidence?',
    type: 'boolean',
    required: true,
    helpText: 'Contracts, registrations, correspondence, etc.'
  },
  {
    id: 'evidence.photographsAvailable',
    text: 'Do you have photographs or screenshots as evidence?',
    type: 'boolean',
    required: true
  },
  {
    id: 'evidence.witnessesAvailable',
    text: 'Do you have witnesses to the violation?',
    type: 'boolean',
    required: true
  },

  // Demands - Immediate Actions
  {
    id: 'demands.immediateActions',
    text: 'What specific actions do you demand they take immediately?',
    type: 'array',
    required: true,
    placeholder: 'E.g., Remove all infringing content from website',
    helpText: 'List each required action separately'
  },
  {
    id: 'demands.monetaryDemands.damagesRequested',
    text: 'Are you requesting monetary damages?',
    type: 'boolean',
    required: true,
    helpText: 'Compensation for losses you\'ve suffered'
  },
  {
    id: 'demands.monetaryDemands.damageAmount',
    text: 'Amount of damages requested',
    type: 'number',
    required: false,
    placeholder: '5000',
    conditionalOn: { field: 'demands.monetaryDemands.damagesRequested', value: true },
    helpText: 'Enter amount in dollars'
  },

  // Timeline
  {
    id: 'timeline.businessDaysAllowed',
    text: 'How many business days will you give them to comply?',
    type: 'number',
    required: true,
    placeholder: '10',
    helpText: 'Typical range is 5-30 business days'
  },
  {
    id: 'timeline.gracePeriodOffered',
    text: 'Offer a grace period for good faith efforts?',
    type: 'boolean',
    required: true,
    helpText: 'Additional time if they show they\'re working to comply'
  },

  // Consequences
  {
    id: 'consequences.legalActionThreatened',
    text: 'Threaten legal action for non-compliance?',
    type: 'boolean',
    required: true,
    helpText: 'Makes the letter more serious but may escalate conflict'
  },
  {
    id: 'consequences.specificLegalActions',
    text: 'What specific legal actions might you take?',
    type: 'array',
    required: false,
    placeholder: 'E.g., Federal lawsuit for trademark infringement',
    conditionalOn: { field: 'consequences.legalActionThreatened', value: true }
  },
  {
    id: 'consequences.injunctiveReliefMentioned',
    text: 'Mention seeking injunctive relief (court order)?',
    type: 'boolean',
    required: true,
    helpText: 'Court order to stop the harmful activity'
  },
  {
    id: 'consequences.monetaryDamagesMentioned',
    text: 'Mention seeking monetary damages in court?',
    type: 'boolean',
    required: true
  },

  // Communication
  {
    id: 'communication.responseRequired',
    text: 'Require a written response?',
    type: 'boolean',
    required: true,
    helpText: 'Confirming they will comply with your demands'
  },
  {
    id: 'communication.preferredContactMethod',
    text: 'Preferred method for their response',
    type: 'select',
    required: true,
    options: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'mail', label: 'US Mail' },
      { value: 'attorney_only', label: 'Through attorney only' }
    ]
  },
  {
    id: 'communication.noDirectContactRequested',
    text: 'Request that they not contact you directly?',
    type: 'boolean',
    required: true,
    helpText: 'Useful in harassment cases'
  },

  // Delivery
  {
    id: 'delivery.deliveryMethod',
    text: 'How will you deliver this letter?',
    type: 'select',
    required: true,
    options: [
      { value: 'certified_mail', label: 'Certified mail (recommended)' },
      { value: 'personal_service', label: 'Personal service' },
      { value: 'email', label: 'Email only' },
      { value: 'multiple_methods', label: 'Multiple methods' }
    ]
  },

  // Additional Terms
  {
    id: 'additionalTerms.governingLaw',
    text: 'Which state\'s laws should govern this matter?',
    type: 'select',
    required: true,
    placeholder: 'Select state'
  },
  {
    id: 'additionalTerms.confidentialityRequest',
    text: 'Request that they keep this letter confidential?',
    type: 'boolean',
    required: true
  }
];