import { DocumentQuestion } from '@/types/documents';

export const forceMajeureNoticeQuestions: DocumentQuestion[] = [
  // Party Information
  {
    id: 'notifyingParty.name',
    text: 'Your name or business name (giving notice)',
    type: 'text',
    required: true,
    placeholder: 'ABC Company, LLC',
  },
  {
    id: 'receivingParty.name',
    text: 'Name of party receiving notice',
    type: 'text',
    required: true,
    placeholder: 'XYZ Corporation',
  },

  // Contract Information
  {
    id: 'contractInfo.contractTitle',
    text: 'Title or description of the contract',
    type: 'text',
    required: true,
    placeholder: 'Service Agreement, Supply Contract, etc.',
  },
  {
    id: 'contractInfo.contractDate',
    text: 'Date the contract was signed',
    type: 'date',
    required: true,
  },
  {
    id: 'contractInfo.forceMajeureClauseExists',
    text: 'Does your contract have a force majeure clause?',
    type: 'boolean',
    required: true,
    helpText:
      'This notice is most effective if your contract includes force majeure provisions',
  },
  {
    id: 'contractInfo.clauseText',
    text: 'Copy the force majeure clause from your contract',
    type: 'textarea',
    required: false,
    placeholder: 'Paste the exact text of the force majeure clause here...',
    conditionalOn: {
      field: 'contractInfo.forceMajeureClauseExists',
      value: true,
    },
  },

  // Force Majeure Event
  {
    id: 'event.eventType',
    text: 'What type of force majeure event occurred?',
    type: 'select',
    required: true,
    options: [
      {
        value: 'natural_disaster',
        label: 'Natural disaster (earthquake, hurricane, flood, etc.)',
      },
      { value: 'pandemic', label: 'Pandemic/epidemic' },
      { value: 'government_action', label: 'Government action/regulation' },
      { value: 'war_terrorism', label: 'War/terrorism/civil unrest' },
      { value: 'labor_strike', label: 'Labor strike/work stoppage' },
      { value: 'supply_chain_disruption', label: 'Supply chain disruption' },
      { value: 'cyberattack', label: 'Cyberattack/system failure' },
      { value: 'infrastructure_failure', label: 'Infrastructure failure' },
      { value: 'other', label: 'Other unforeseeable event' },
    ],
  },
  {
    id: 'event.eventDescription',
    text: 'Describe the force majeure event in detail',
    type: 'textarea',
    required: true,
    placeholder:
      'Provide a comprehensive description of what happened, when it started, its scope and impact...',
    minLength: 100,
  },
  {
    id: 'event.eventStartDate',
    text: 'When did the event begin?',
    type: 'date',
    required: true,
  },
  {
    id: 'event.eventLocation',
    text: 'Where did the event occur?',
    type: 'text',
    required: true,
    placeholder: 'Geographic location or scope of the event',
  },
  {
    id: 'event.ongoingEvent',
    text: 'Is this event still ongoing?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'event.estimatedEndDate',
    text: 'Estimated end date (if known)',
    type: 'date',
    required: false,
    conditionalOn: { field: 'event.ongoingEvent', value: false },
  },

  // Impact on Performance
  {
    id: 'performanceImpact.affectedObligations.0.obligation',
    text: 'First affected contractual obligation',
    type: 'text',
    required: true,
    placeholder:
      'E.g., Delivery of goods, provision of services, payment deadline',
  },
  {
    id: 'performanceImpact.affectedObligations.0.impactType',
    text: 'How is this obligation affected?',
    type: 'select',
    required: true,
    options: [
      {
        value: 'complete_impossibility',
        label: 'Complete impossibility to perform',
      },
      { value: 'partial_impossibility', label: 'Partial impossibility' },
      { value: 'significant_delay', label: 'Significant delay in performance' },
      { value: 'increased_cost', label: 'Substantially increased cost' },
    ],
  },
  {
    id: 'performanceImpact.affectedObligations.0.description',
    text: 'Describe how this obligation is affected',
    type: 'textarea',
    required: true,
    placeholder:
      'Explain specifically how the force majeure event prevents or delays performance of this obligation...',
    minLength: 50,
  },
  {
    id: 'performanceImpact.causalConnection',
    text: 'Explain how the event directly prevents your performance',
    type: 'textarea',
    required: true,
    placeholder:
      'Clearly establish the causal connection between the force majeure event and your inability to perform...',
    minLength: 50,
  },

  // Mitigation Efforts
  {
    id: 'mitigation.effortsMade.0.effort',
    text: 'What efforts have you made to mitigate the impact?',
    type: 'text',
    required: false,
    placeholder: 'E.g., Sought alternative suppliers, relocated operations',
  },
  {
    id: 'mitigation.effortsMade.0.result',
    text: 'What was the result of this effort?',
    type: 'text',
    required: false,
    placeholder: 'Successful, partially successful, unsuccessful',
    conditionalOn: { field: 'mitigation.effortsMade.0.effort', value: true },
  },
  {
    id: 'mitigation.alternativePerformance.available',
    text: 'Is alternative performance possible?',
    type: 'boolean',
    required: true,
    helpText: 'Can you perform the contract in a different way?',
  },
  {
    id: 'mitigation.alternativePerformance.description',
    text: 'Describe the alternative performance available',
    type: 'textarea',
    required: false,
    placeholder:
      'Explain what alternative performance is possible and any limitations...',
    conditionalOn: {
      field: 'mitigation.alternativePerformance.available',
      value: true,
    },
  },

  // Performance Changes
  {
    id: 'performanceChanges.suspensionRequested',
    text: 'Are you requesting suspension of performance?',
    type: 'boolean',
    required: true,
    helpText: 'Temporary halt to your contractual obligations',
  },
  {
    id: 'performanceChanges.suspensionScope',
    text: 'Scope of suspension requested',
    type: 'select',
    required: false,
    options: [
      { value: 'complete', label: 'Complete suspension of all obligations' },
      { value: 'partial', label: 'Partial suspension of specific obligations' },
    ],
    conditionalOn: {
      field: 'performanceChanges.suspensionRequested',
      value: true,
    },
  },
  {
    id: 'performanceChanges.timeExtensionRequested',
    text: 'Are you requesting a time extension?',
    type: 'boolean',
    required: true,
    helpText: 'Additional time to complete performance after event ends',
  },
  {
    id: 'performanceChanges.extensionPeriod',
    text: 'How much additional time do you need?',
    type: 'text',
    required: false,
    placeholder: 'E.g., 30 days, 3 months, time equal to delay period',
    conditionalOn: {
      field: 'performanceChanges.timeExtensionRequested',
      value: true,
    },
  },

  // Notice Timing
  {
    id: 'noticeDetails.noticeDate',
    text: 'Date you are giving this notice',
    type: 'date',
    required: true,
  },
  {
    id: 'noticeDetails.daysFromEvent',
    text: 'How many days after the event started are you giving notice?',
    type: 'number',
    required: true,
    placeholder: '15',
    helpText: 'Many contracts require prompt notice',
  },
  {
    id: 'noticeDetails.timelyNotice',
    text: 'Are you giving this notice within the required timeframe?',
    type: 'boolean',
    required: true,
    helpText: 'Check your contract for notice requirements',
  },
  {
    id: 'noticeDetails.delayExplanation',
    text: 'If notice is delayed, explain why',
    type: 'textarea',
    required: false,
    placeholder: 'Explain the circumstances that prevented earlier notice...',
    conditionalOn: { field: 'noticeDetails.timelyNotice', value: false },
  },

  // Evidence
  {
    id: 'evidence.mediaReports',
    text: 'Are there media reports about this event?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'evidence.governmentNotices',
    text: 'Are there government notices or declarations?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'evidence.expertReports',
    text: 'Do you have expert reports or assessments?',
    type: 'boolean',
    required: true,
  },

  // Financial Impact
  {
    id: 'financial.lossIncurred',
    text: 'Have you incurred financial losses?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'financial.lossAmount',
    text: 'Estimated amount of loss',
    type: 'number',
    required: false,
    placeholder: '50000',
    conditionalOn: { field: 'financial.lossIncurred', value: true },
    helpText: 'Enter amount in dollars',
  },
  {
    id: 'financial.insuranceCoverage.applicableCoverage',
    text: 'Do you have applicable insurance coverage?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'financial.compensationSought',
    text: 'Are you seeking compensation for losses?',
    type: 'boolean',
    required: true,
  },

  // Resumption Plans
  {
    id: 'resumption.intendToResume',
    text: 'Do you intend to resume performance when possible?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'resumption.estimatedResumptionDate',
    text: 'Estimated date when you can resume performance',
    type: 'date',
    required: false,
    conditionalOn: { field: 'resumption.intendToResume', value: true },
  },
  {
    id: 'resumption.notificationCommitment.willNotifyWhenAble',
    text: "Will you notify when you're able to resume?",
    type: 'boolean',
    required: true,
    conditionalOn: { field: 'resumption.intendToResume', value: true },
  },

  // Communication
  {
    id: 'communication.requestAcknowledgment',
    text: 'Request acknowledgment of this notice?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'communication.requestDiscussion',
    text: 'Request discussion about the situation?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'communication.ongoingCommunication.regularUpdates',
    text: 'Commit to providing regular updates?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'communication.ongoingCommunication.updateFrequency',
    text: 'How often will you provide updates?',
    type: 'select',
    required: false,
    options: [
      { value: 'weekly', label: 'Weekly' },
      { value: 'biweekly', label: 'Every two weeks' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'as_needed', label: 'As developments occur' },
    ],
    conditionalOn: {
      field: 'communication.ongoingCommunication.regularUpdates',
      value: true,
    },
  },
];
