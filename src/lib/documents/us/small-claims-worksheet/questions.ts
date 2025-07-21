import { DocumentQuestion } from '@/types/documents';

export const smallClaimsWorksheetQuestions: DocumentQuestion[] = [
  // Case Overview
  {
    id: 'caseOverview.caseTitle',
    text: 'What is the title of your case?',
    type: 'text',
    required: true,
    placeholder: 'Smith vs. Jones - Contract Dispute',
    helpText: 'Brief descriptive title for your case',
  },
  {
    id: 'caseOverview.caseType',
    text: 'What type of case is this?',
    type: 'select',
    required: true,
    options: [
      { value: 'contract_dispute', label: 'Contract dispute' },
      { value: 'property_damage', label: 'Property damage' },
      { value: 'unpaid_debt', label: 'Unpaid debt/loan' },
      { value: 'landlord_tenant', label: 'Landlord-tenant dispute' },
      { value: 'personal_injury', label: 'Personal injury' },
      { value: 'warranty_issue', label: 'Warranty/defective product' },
      { value: 'service_dispute', label: 'Service dispute' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'caseOverview.totalAmountClaimed',
    text: 'Total amount you are claiming (in dollars)',
    type: 'number',
    required: true,
    placeholder: '2500',
    helpText: 'Include all damages, costs, and interest',
  },
  {
    id: 'caseOverview.courtJurisdiction',
    text: 'Which court will you file in?',
    type: 'text',
    required: true,
    placeholder: 'Los Angeles County Small Claims Court',
    helpText: 'Check your local court rules for proper jurisdiction',
  },

  // Plaintiff Information
  {
    id: 'plaintiff.type',
    text: 'Are you filing as an individual or business?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business' },
    ],
  },
  {
    id: 'plaintiff.name',
    text: 'Your full legal name',
    type: 'text',
    required: true,
    placeholder: 'John Smith or ABC Company, LLC',
  },
  {
    id: 'plaintiff.address',
    text: 'Your address',
    type: 'text',
    required: true,
    placeholder: '123 Main Street',
  },
  {
    id: 'plaintiff.city',
    text: 'City',
    type: 'text',
    required: true,
  },
  {
    id: 'plaintiff.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'plaintiff.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345',
  },
  {
    id: 'plaintiff.phone',
    text: 'Phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567',
  },

  // Defendant Information
  {
    id: 'defendant.type',
    text: 'Is the defendant an individual or business?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    id: 'defendant.name',
    text: "Defendant's full name or business name",
    type: 'text',
    required: true,
    placeholder: 'Jane Doe or XYZ Corporation',
  },
  {
    id: 'defendant.knownAddresses.0.address',
    text: "Defendant's address",
    type: 'text',
    required: true,
    placeholder: '456 Oak Avenue',
  },
  {
    id: 'defendant.knownAddresses.0.city',
    text: 'City',
    type: 'text',
    required: true,
  },
  {
    id: 'defendant.knownAddresses.0.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'defendant.knownAddresses.0.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345',
  },

  // Case Facts
  {
    id: 'caseFacts.relationshipToDefendant',
    text: 'What was your relationship to the defendant?',
    type: 'select',
    required: true,
    options: [
      { value: 'customer', label: 'Customer/Client relationship' },
      { value: 'tenant', label: 'Tenant (defendant is landlord)' },
      { value: 'landlord', label: 'Landlord (defendant is tenant)' },
      { value: 'contractor', label: 'Contractor/service provider' },
      { value: 'business_partner', label: 'Business partner' },
      { value: 'neighbor', label: 'Neighbor' },
      { value: 'stranger', label: 'No prior relationship' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'caseFacts.incidentDate',
    text: 'When did the incident or breach occur?',
    type: 'date',
    required: true,
    helpText: 'The date when the problem first occurred',
  },
  {
    id: 'caseFacts.incidentLocation',
    text: 'Where did the incident occur?',
    type: 'text',
    required: true,
    placeholder: 'Specific address or location',
  },
  {
    id: 'caseFacts.factualDescription',
    text: 'Describe what happened in detail',
    type: 'textarea',
    required: true,
    placeholder:
      'Provide a chronological, factual description of what occurred. Stick to facts, not opinions or emotions...',
    minLength: 100,
  },
  {
    id: 'caseFacts.demandLetterSent',
    text: 'Did you send a demand letter before filing suit?',
    type: 'boolean',
    required: true,
    helpText: 'Many courts require you to first demand payment or resolution',
  },
  {
    id: 'caseFacts.demandLetterDate',
    text: 'When did you send the demand letter?',
    type: 'date',
    required: false,
    conditionalOn: { field: 'caseFacts.demandLetterSent', value: true },
  },

  // Legal Basis
  {
    id: 'legalBasis.contractExists',
    text: 'Was there a contract between you and the defendant?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'legalBasis.contractType',
    text: 'What type of contract?',
    type: 'select',
    required: false,
    options: [
      { value: 'written', label: 'Written contract' },
      { value: 'oral', label: 'Oral agreement' },
      { value: 'implied', label: 'Implied contract' },
    ],
    conditionalOn: { field: 'legalBasis.contractExists', value: true },
  },
  {
    id: 'legalBasis.negligenceAlleged',
    text: 'Are you claiming the defendant was negligent?',
    type: 'boolean',
    required: true,
    helpText: 'Did they fail to use reasonable care?',
  },

  // Damages
  {
    id: 'damages.directDamages.0.type',
    text: 'Primary type of damage/loss',
    type: 'text',
    required: true,
    placeholder: 'E.g., Unpaid invoice, property damage, lost wages',
  },
  {
    id: 'damages.directDamages.0.amount',
    text: 'Amount of primary damage',
    type: 'number',
    required: true,
    placeholder: '1500',
  },
  {
    id: 'damages.directDamages.0.documentation',
    text: 'What documentation do you have for this damage?',
    type: 'text',
    required: false,
    placeholder: 'Invoice, receipt, estimate, etc.',
  },
  {
    id: 'damages.lostWages.applicable',
    text: 'Did you lose wages due to this incident?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'damages.lostWages.dailyWage',
    text: 'What do you earn per day?',
    type: 'number',
    required: false,
    placeholder: '200',
    conditionalOn: { field: 'damages.lostWages.applicable', value: true },
  },
  {
    id: 'damages.lostWages.daysLost',
    text: 'How many days of work did you lose?',
    type: 'number',
    required: false,
    placeholder: '3',
    conditionalOn: { field: 'damages.lostWages.applicable', value: true },
  },

  // Evidence
  {
    id: 'evidence.documents.0.type',
    text: 'Type of key document',
    type: 'text',
    required: false,
    placeholder: 'Contract, invoice, receipt, correspondence',
  },
  {
    id: 'evidence.documents.0.description',
    text: 'Describe this document',
    type: 'text',
    required: false,
    placeholder: 'Signed contract for services dated...',
    conditionalOn: { field: 'evidence.documents.0.type', value: true },
  },
  {
    id: 'evidence.photographs.0.description',
    text: 'Do you have relevant photographs?',
    type: 'text',
    required: false,
    placeholder: 'Photos of damaged property, before/after shots, etc.',
  },

  // Witnesses
  {
    id: 'witnesses.0.name',
    text: 'Witness name',
    type: 'text',
    required: false,
    placeholder: 'Full name of witness',
  },
  {
    id: 'witnesses.0.relationship',
    text: 'Relationship to you',
    type: 'text',
    required: false,
    placeholder: 'Friend, neighbor, coworker, etc.',
    conditionalOn: { field: 'witnesses.0.name', value: true },
  },
  {
    id: 'witnesses.0.relevantKnowledge',
    text: 'What does this witness know about the case?',
    type: 'textarea',
    required: false,
    placeholder:
      'Describe what the witness saw, heard, or knows about the situation',
    conditionalOn: { field: 'witnesses.0.name', value: true },
  },
  {
    id: 'witnesses.0.willTestify',
    text: 'Will this witness testify in court?',
    type: 'select',
    required: false,
    options: [
      { value: 'yes', label: 'Yes, willing to testify' },
      { value: 'no', label: 'No, unwilling to testify' },
      { value: 'unknown', label: "Haven't asked yet" },
    ],
    conditionalOn: { field: 'witnesses.0.name', value: true },
  },

  // Settlement
  {
    id: 'settlement.willingToSettle',
    text: 'Are you willing to settle out of court?',
    type: 'boolean',
    required: true,
    helpText: 'Settlement can save time and guarantee payment',
  },
  {
    id: 'settlement.minimumAcceptable',
    text: 'Minimum amount you would accept to settle',
    type: 'number',
    required: false,
    placeholder: '2000',
    conditionalOn: { field: 'settlement.willingToSettle', value: true },
  },

  // Court Preparation
  {
    id: 'courtPreparation.presentationOutline',
    text: 'Outline your presentation to the judge',
    type: 'textarea',
    required: false,
    placeholder:
      'Brief outline of how you plan to present your case: 1) Introduce yourself, 2) Explain the agreement, 3) Show evidence...',
  },
  {
    id: 'courtPreparation.anticipatedDefenses',
    text: 'What defenses might the defendant raise?',
    type: 'array',
    required: false,
    placeholder: 'E.g., They did complete the work, payment was never due',
  },
];
