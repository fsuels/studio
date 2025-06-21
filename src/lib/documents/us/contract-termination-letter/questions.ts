// src/lib/documents/us/contract-termination-letter/questions.ts
import type { FormQuestion } from '@/types/documents';

export const contractTerminationLetterQuestions: FormQuestion[] = [
  // Sender Information
  {
    id: 'senderName',
    type: 'text',
    label: 'Your Full Name',
    placeholder: 'Enter your full name',
    required: true,
    section: 'Sender Information',
  },
  {
    id: 'senderTitle',
    type: 'text',
    label: 'Your Title (if applicable)',
    placeholder: 'e.g., CEO, Contract Manager',
    required: false,
    section: 'Sender Information',
  },
  {
    id: 'senderCompany',
    type: 'text',
    label: 'Your Company/Organization',
    placeholder: 'Enter company name if applicable',
    required: false,
    section: 'Sender Information',
  },
  {
    id: 'senderAddress',
    type: 'address',
    label: 'Your Address',
    placeholder: 'Enter your complete address',
    required: true,
    section: 'Sender Information',
  },
  {
    id: 'senderPhone',
    type: 'tel',
    label: 'Your Phone Number',
    placeholder: 'Enter phone number',
    required: false,
    section: 'Sender Information',
  },
  {
    id: 'senderEmail',
    type: 'email',
    label: 'Your Email Address',
    placeholder: 'Enter email address',
    required: false,
    section: 'Sender Information',
  },

  // Recipient Information
  {
    id: 'recipientName',
    type: 'text',
    label: 'Recipient Full Name',
    placeholder: "Enter recipient's full name",
    required: true,
    section: 'Recipient Information',
  },
  {
    id: 'recipientTitle',
    type: 'text',
    label: 'Recipient Title (if applicable)',
    placeholder: 'e.g., President, Contract Administrator',
    required: false,
    section: 'Recipient Information',
  },
  {
    id: 'recipientCompany',
    type: 'text',
    label: 'Recipient Company/Organization',
    placeholder: "Enter recipient's company name if applicable",
    required: false,
    section: 'Recipient Information',
  },
  {
    id: 'recipientAddress',
    type: 'address',
    label: 'Recipient Address',
    placeholder: "Enter recipient's complete address",
    required: true,
    section: 'Recipient Information',
  },

  // Letter Details
  {
    id: 'letterDate',
    type: 'date',
    label: 'Letter Date',
    required: true,
    section: 'Letter Details',
  },
  {
    id: 'subject',
    type: 'text',
    label: 'Subject Line',
    placeholder: 'e.g., Notice of Contract Termination',
    required: true,
    section: 'Letter Details',
  },

  // Contract Information
  {
    id: 'contractTitle',
    type: 'text',
    label: 'Contract Title/Name',
    placeholder: 'Enter the title of the contract being terminated',
    required: true,
    section: 'Contract Information',
  },
  {
    id: 'contractDate',
    type: 'date',
    label: 'Contract Date',
    required: true,
    section: 'Contract Information',
  },
  {
    id: 'contractNumber',
    type: 'text',
    label: 'Contract Number (if applicable)',
    placeholder: 'Enter contract number or reference',
    required: false,
    section: 'Contract Information',
  },
  {
    id: 'contractDescription',
    type: 'textarea',
    label: 'Contract Description',
    placeholder: 'Briefly describe the nature of the contract',
    required: true,
    section: 'Contract Information',
  },

  // Termination Details
  {
    id: 'terminationReason',
    type: 'select',
    label: 'Reason for Termination',
    options: [
      { value: 'breach', label: 'Breach of contract' },
      { value: 'convenience', label: 'Termination for convenience' },
      { value: 'mutual_agreement', label: 'Mutual agreement' },
      { value: 'expiration', label: 'Contract expiration' },
      { value: 'non_performance', label: 'Non-performance' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
    section: 'Termination Details',
  },
  {
    id: 'terminationReasonDetails',
    type: 'textarea',
    label: 'Detailed Explanation',
    placeholder: 'Provide specific details about the reason for termination',
    required: true,
    section: 'Termination Details',
  },
  {
    id: 'terminationClause',
    type: 'text',
    label: 'Termination Clause Reference',
    placeholder: 'Reference specific contract clause if applicable',
    required: false,
    section: 'Termination Details',
  },

  // Notice Requirements
  {
    id: 'noticeRequired',
    type: 'radio',
    label: 'Is advance notice required by the contract?',
    options: [
      { value: true, label: 'Yes, advance notice is required' },
      { value: false, label: 'No, advance notice is not required' },
    ],
    required: true,
    section: 'Notice Requirements',
  },
  {
    id: 'noticePeriod',
    type: 'text',
    label: 'Required Notice Period',
    placeholder: 'e.g., 30 days, 60 days',
    required: false,
    section: 'Notice Requirements',
    conditional: {
      field: 'noticeRequired',
      value: [true],
    },
  },
  {
    id: 'effectiveDate',
    type: 'date',
    label: 'Termination Effective Date',
    required: true,
    section: 'Notice Requirements',
  },
  {
    id: 'immediateTermination',
    type: 'radio',
    label: 'Is this immediate termination?',
    options: [
      { value: true, label: 'Yes, terminate immediately' },
      { value: false, label: 'No, terminate on effective date' },
    ],
    required: true,
    section: 'Notice Requirements',
  },

  // Cure Period (for breach)
  {
    id: 'curePeriodOffered',
    type: 'radio',
    label: 'Offer opportunity to cure the breach?',
    options: [
      { value: true, label: 'Yes, offer cure period' },
      { value: false, label: 'No, immediate termination' },
    ],
    required: true,
    section: 'Cure Period',
    conditional: {
      field: 'terminationReason',
      value: ['breach'],
    },
  },
  {
    id: 'curePeriodDays',
    type: 'text',
    label: 'Cure Period Duration',
    placeholder: 'e.g., 10 days, 30 days',
    required: false,
    section: 'Cure Period',
    conditional: {
      field: 'curePeriodOffered',
      value: [true],
    },
  },
  {
    id: 'cureDeadline',
    type: 'date',
    label: 'Cure Deadline Date',
    required: false,
    section: 'Cure Period',
    conditional: {
      field: 'curePeriodOffered',
      value: [true],
    },
  },

  // Obligations and Settlement
  {
    id: 'outstandingObligations',
    type: 'textarea',
    label: 'Outstanding Obligations',
    placeholder: 'Describe any outstanding obligations that must be fulfilled',
    required: false,
    section: 'Settlement Terms',
  },
  {
    id: 'finalPayment',
    type: 'textarea',
    label: 'Final Payment Details',
    placeholder: 'Describe any final payments due or owed',
    required: false,
    section: 'Settlement Terms',
  },
  {
    id: 'returnOfProperty',
    type: 'radio',
    label: 'Property return required?',
    options: [
      { value: true, label: 'Yes, property must be returned' },
      { value: false, label: 'No, no property to return' },
    ],
    required: true,
    section: 'Settlement Terms',
  },
  {
    id: 'propertyDescription',
    type: 'textarea',
    label: 'Property to be Returned',
    placeholder: 'Describe property, materials, or documents to be returned',
    required: false,
    section: 'Settlement Terms',
    conditional: {
      field: 'returnOfProperty',
      value: [true],
    },
  },
  {
    id: 'confidentialityRemains',
    type: 'radio',
    label: 'Do confidentiality obligations continue?',
    options: [
      { value: true, label: 'Yes, confidentiality obligations survive' },
      { value: false, label: 'No, confidentiality obligations end' },
    ],
    required: true,
    section: 'Settlement Terms',
  },

  // Legal References
  {
    id: 'terminationClauseReference',
    type: 'text',
    label: 'Contract Termination Clause',
    placeholder: 'Reference specific clause number or section',
    required: false,
    section: 'Legal References',
  },
  {
    id: 'governingLaw',
    type: 'text',
    label: 'Governing Law Clause',
    placeholder: 'Reference governing law clause if applicable',
    required: false,
    section: 'Legal References',
  },
  {
    id: 'disputeResolution',
    type: 'text',
    label: 'Dispute Resolution Clause',
    placeholder: 'Reference dispute resolution procedures if applicable',
    required: false,
    section: 'Legal References',
  },

  // Legal Reservations
  {
    id: 'reserveRights',
    type: 'radio',
    label: 'Reserve legal rights?',
    options: [
      { value: true, label: 'Yes, reserve all legal rights' },
      { value: false, label: 'No, do not include reservation clause' },
    ],
    required: true,
    section: 'Legal Rights',
  },
  {
    id: 'legalRightsStatement',
    type: 'textarea',
    label: 'Legal Rights Statement',
    placeholder: 'Specify what legal rights you wish to reserve',
    required: false,
    section: 'Legal Rights',
    conditional: {
      field: 'reserveRights',
      value: [true],
    },
  },

  // Delivery Method
  {
    id: 'deliveryMethod',
    type: 'select',
    label: 'Delivery Method',
    options: [
      { value: 'certified_mail', label: 'Certified mail' },
      { value: 'email', label: 'Email' },
      { value: 'hand_delivery', label: 'Hand delivery' },
      { value: 'regular_mail', label: 'Regular mail' },
      { value: 'courier', label: 'Courier service' },
    ],
    required: true,
    section: 'Delivery',
  },
  {
    id: 'deliveryConfirmation',
    type: 'radio',
    label: 'Request delivery confirmation?',
    options: [
      { value: true, label: 'Yes, request delivery confirmation' },
      { value: false, label: 'No, confirmation not needed' },
    ],
    required: true,
    section: 'Delivery',
  },

  // Professional Tone
  {
    id: 'professionalTone',
    type: 'radio',
    label: 'Letter tone preference',
    options: [
      { value: true, label: 'Professional and diplomatic' },
      { value: false, label: 'Direct and formal' },
    ],
    required: true,
    section: 'Letter Style',
  },
  {
    id: 'futureRelationship',
    type: 'select',
    label: 'Future business relationship',
    options: [
      { value: 'maintain', label: 'Hope to maintain positive relationship' },
      { value: 'neutral', label: 'Neutral, business-only tone' },
      { value: 'severance', label: 'Complete severance of relationship' },
    ],
    required: true,
    section: 'Letter Style',
  },

  // Additional Terms
  {
    id: 'additionalTerms',
    type: 'textarea',
    label: 'Additional Terms',
    placeholder: 'Enter any additional terms or conditions',
    required: false,
    section: 'Additional Terms',
  },
  {
    id: 'specialInstructions',
    type: 'textarea',
    label: 'Special Instructions',
    placeholder: 'Enter any special instructions or requirements',
    required: false,
    section: 'Additional Terms',
  },

  // Signature
  {
    id: 'signatureRequired',
    type: 'radio',
    label: 'Include signature line?',
    options: [
      { value: true, label: 'Yes, include signature line' },
      { value: false, label: 'No, letter only' },
    ],
    required: true,
    section: 'Signature',
  },
  {
    id: 'signerName',
    type: 'text',
    label: 'Signer Name',
    placeholder: 'Name of person signing the letter',
    required: true,
    section: 'Signature',
  },
  {
    id: 'signerTitle',
    type: 'text',
    label: 'Signer Title',
    placeholder: 'Title of person signing',
    required: false,
    section: 'Signature',
  },
  {
    id: 'signatureDate',
    type: 'date',
    label: 'Signature Date',
    required: false,
    section: 'Signature',
    conditional: {
      field: 'signatureRequired',
      value: [true],
    },
  },
];
