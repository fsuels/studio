import { DocumentQuestion } from '@/types/documents';

export const breachContractNoticeQuestions: DocumentQuestion[] = [
  // Party Information
  {
    id: 'notifyingParty.name',
    text: 'Your name or business name',
    type: 'text',
    required: true,
    placeholder: 'ABC Company, LLC',
  },
  {
    id: 'breachingParty.name',
    text: 'Name of party in breach',
    type: 'text',
    required: true,
    placeholder: 'XYZ Corporation',
  },
  {
    id: 'breachingParty.address',
    text: 'Address of breaching party',
    type: 'text',
    required: true,
    placeholder: '456 Oak Avenue',
  },
  {
    id: 'breachingParty.city',
    text: 'City',
    type: 'text',
    required: true,
  },
  {
    id: 'breachingParty.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'breachingParty.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345',
  },

  // Contract Information
  {
    id: 'contractDetails.contractTitle',
    text: 'Title or description of the contract',
    type: 'text',
    required: true,
    placeholder: 'Service Agreement, Purchase Contract, etc.',
  },
  {
    id: 'contractDetails.contractDate',
    text: 'Date the contract was signed',
    type: 'date',
    required: true,
  },
  {
    id: 'contractDetails.contractNumber',
    text: 'Contract number (if any)',
    type: 'text',
    required: false,
    placeholder: 'Contract reference number',
  },
  {
    id: 'contractDetails.contractValue',
    text: 'Total contract value (optional)',
    type: 'number',
    required: false,
    placeholder: '50000',
    helpText: 'Enter amount in dollars',
  },

  // Breach Details
  {
    id: 'breachDetails.breachType',
    text: 'What type of breach has occurred?',
    type: 'select',
    required: true,
    options: [
      { value: 'non_payment', label: 'Non-payment of money owed' },
      { value: 'failure_to_deliver', label: 'Failure to deliver goods' },
      {
        value: 'defective_performance',
        label: 'Defective or substandard performance',
      },
      { value: 'delay_in_performance', label: 'Delay in performance' },
      {
        value: 'failure_to_provide_services',
        label: 'Failure to provide services',
      },
      { value: 'breach_of_warranty', label: 'Breach of warranty' },
      { value: 'violation_of_terms', label: 'Violation of contract terms' },
      {
        value: 'anticipatory_breach',
        label: "Anticipatory breach (announced they won't perform)",
      },
      { value: 'other', label: 'Other type of breach' },
    ],
  },
  {
    id: 'breachDetails.breachDescription',
    text: 'Describe the breach in detail',
    type: 'textarea',
    required: true,
    placeholder:
      'Provide a comprehensive description of how the other party has breached the contract. Include specific facts, dates, and contract provisions violated...',
    minLength: 100,
  },
  {
    id: 'breachDetails.specificViolations.0.clause',
    text: 'First violated contract provision',
    type: 'text',
    required: true,
    placeholder: 'Section 3.2 - Payment Terms or describe the specific clause',
  },
  {
    id: 'breachDetails.specificViolations.0.violation',
    text: 'How was this provision violated?',
    type: 'text',
    required: true,
    placeholder:
      'Payment was due 30 days after invoice but has not been received after 60 days',
  },
  {
    id: 'breachDetails.firstBreachDate',
    text: 'When did the breach first occur?',
    type: 'date',
    required: true,
  },
  {
    id: 'breachDetails.ongoingBreach',
    text: 'Is this an ongoing breach?',
    type: 'boolean',
    required: true,
    helpText: 'Is the other party continuing to violate the contract?',
  },
  {
    id: 'breachDetails.materialBreach',
    text: 'Do you consider this a material breach?',
    type: 'boolean',
    required: true,
    helpText:
      'A material breach goes to the essence of the contract and may justify termination',
  },

  // Prior Notice
  {
    id: 'breachDetails.priorNotifications.previousNoticeGiven',
    text: 'Have you previously notified them of this breach?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'breachDetails.priorNotifications.noticeDate',
    text: 'When did you give prior notice?',
    type: 'date',
    required: false,
    conditionalOn: {
      field: 'breachDetails.priorNotifications.previousNoticeGiven',
      value: true,
    },
  },

  // Impact and Damages
  {
    id: 'impact.financialImpact.directDamages',
    text: 'Amount of direct financial damages',
    type: 'number',
    required: false,
    placeholder: '25000',
    helpText: 'Actual monetary losses you can prove',
  },
  {
    id: 'impact.financialImpact.lostProfits',
    text: 'Amount of lost profits',
    type: 'number',
    required: false,
    placeholder: '15000',
    helpText: 'Profits you would have earned but for the breach',
  },
  {
    id: 'impact.operationalImpact.businessDisruption',
    text: 'Has this caused business disruption?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'impact.operationalImpact.reputationalHarm',
    text: 'Has this caused reputational harm?',
    type: 'boolean',
    required: true,
  },

  // Demanded Remedies
  {
    id: 'remedies.specificPerformance.demanded',
    text: 'Do you demand specific performance of the contract?',
    type: 'boolean',
    required: true,
    helpText: 'Requiring them to do what they promised to do',
  },
  {
    id: 'remedies.specificPerformance.performanceDetails',
    text: 'What specific performance do you demand?',
    type: 'textarea',
    required: false,
    placeholder:
      'Describe exactly what you want them to do to cure the breach...',
    conditionalOn: {
      field: 'remedies.specificPerformance.demanded',
      value: true,
    },
  },
  {
    id: 'remedies.specificPerformance.performanceDeadline',
    text: 'Deadline for performance',
    type: 'date',
    required: false,
    conditionalOn: {
      field: 'remedies.specificPerformance.demanded',
      value: true,
    },
  },
  {
    id: 'remedies.monetaryDamages.demanded',
    text: 'Do you demand monetary damages?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'remedies.monetaryDamages.amountDemanded',
    text: 'Total amount of damages demanded',
    type: 'number',
    required: false,
    placeholder: '40000',
    conditionalOn: { field: 'remedies.monetaryDamages.demanded', value: true },
    helpText: 'Enter total amount in dollars',
  },
  {
    id: 'remedies.monetaryDamages.paymentDeadline',
    text: 'Deadline for payment',
    type: 'date',
    required: false,
    conditionalOn: { field: 'remedies.monetaryDamages.demanded', value: true },
  },

  // Cure Period
  {
    id: 'curePeriod.cureOffered',
    text: 'Will you give them an opportunity to cure the breach?',
    type: 'boolean',
    required: true,
    helpText:
      'Allowing them time to fix the problem before taking further action',
  },
  {
    id: 'curePeriod.curePeriodDays',
    text: 'How many days to cure the breach?',
    type: 'number',
    required: false,
    placeholder: '15',
    conditionalOn: { field: 'curePeriod.cureOffered', value: true },
    helpText: 'Reasonable time period for them to fix the breach',
  },
  {
    id: 'curePeriod.cureRequirements',
    text: 'What must they do to cure the breach?',
    type: 'textarea',
    required: false,
    placeholder: 'Specific steps they must take to remedy the breach...',
    conditionalOn: { field: 'curePeriod.cureOffered', value: true },
  },

  // Legal Consequences
  {
    id: 'consequences.contractTermination.threatened',
    text: 'Will you terminate the contract if not cured?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'consequences.legalAction.threatened',
    text: 'Will you pursue legal action if not cured?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'consequences.legalAction.specificActions',
    text: 'What legal actions might you take?',
    type: 'array',
    required: false,
    placeholder: 'E.g., File lawsuit for damages, seek injunctive relief',
    conditionalOn: {
      field: 'consequences.legalAction.threatened',
      value: true,
    },
  },
  {
    id: 'consequences.withholding.paymentWithholding',
    text: 'Will you withhold future payments?',
    type: 'boolean',
    required: true,
    helpText: 'Stopping payments until breach is cured',
  },

  // Evidence
  {
    id: 'evidence.documentationAttached',
    text: 'Are you attaching supporting documentation?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'evidence.correspondence.relevantCorrespondence',
    text: 'Do you have relevant correspondence about this issue?',
    type: 'boolean',
    required: true,
    helpText: 'Emails, letters, or other communications',
  },
  {
    id: 'evidence.witnessEvidence.witnessesAvailable',
    text: 'Do you have witnesses to the breach?',
    type: 'boolean',
    required: true,
  },

  // Notice Compliance
  {
    id: 'noticeCompliance.contractNoticeClause.noticeClauseExists',
    text: 'Does your contract have specific notice requirements?',
    type: 'boolean',
    required: true,
    helpText: 'Check if contract specifies how notices must be given',
  },
  {
    id: 'noticeCompliance.deliveryMethod',
    text: 'How will you deliver this notice?',
    type: 'select',
    required: true,
    options: [
      { value: 'certified_mail', label: 'Certified mail (recommended)' },
      { value: 'personal_service', label: 'Personal service' },
      { value: 'email', label: 'Email' },
      { value: 'fax', label: 'Fax' },
      { value: 'multiple_methods', label: 'Multiple methods' },
    ],
  },

  // Communication
  {
    id: 'communication.responseRequested',
    text: 'Do you request a response to this notice?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'communication.responseDeadline',
    text: 'Deadline for response',
    type: 'date',
    required: false,
    conditionalOn: { field: 'communication.responseRequested', value: true },
  },
  {
    id: 'communication.meetingRequested',
    text: 'Do you request a meeting to discuss the breach?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'communication.meetingPurpose',
    text: 'Purpose of requested meeting',
    type: 'text',
    required: false,
    placeholder: 'To discuss resolution options and avoid litigation',
    conditionalOn: { field: 'communication.meetingRequested', value: true },
  },

  // Future Relationship
  {
    id: 'futureRelationship.continuedRelationship.desired',
    text: 'Do you want to continue the contractual relationship?',
    type: 'boolean',
    required: true,
    helpText:
      'If the breach is cured, do you want to continue with the contract?',
  },
  {
    id: 'futureRelationship.confidentiality.requestConfidentiality',
    text: 'Request that this matter be kept confidential?',
    type: 'boolean',
    required: true,
  },
];
