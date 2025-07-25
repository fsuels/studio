// src/lib/documents/us/memorandum-of-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const memorandumOfAgreementQuestions: FormQuestion[] = [
  {
    id: 'agreementTitle',
    type: 'text',
    label: 'Agreement Title',
    placeholder: 'e.g., Joint Venture Agreement, Partnership MOA',
    required: true,
    group: 'basic',
  },
  {
    id: 'agreementPurpose',
    type: 'textarea',
    label: 'Purpose of Agreement',
    placeholder: 'Describe the main purpose and goals of this agreement',
    required: true,
    group: 'basic',
  },
  {
    id: 'background',
    type: 'textarea',
    label: 'Background Information',
    placeholder: 'Provide context and background for this agreement',
    required: false,
    group: 'basic',
  },
  {
    id: 'scope',
    type: 'textarea',
    label: 'Scope of Agreement',
    placeholder: 'Define the scope and boundaries of this agreement',
    required: true,
    group: 'basic',
  },
  {
    id: 'party1Name',
    type: 'text',
    label: 'First Party Name',
    placeholder: 'Enter organization or individual name',
    required: true,
    group: 'party1',
  },
  {
    id: 'party1Type',
    type: 'select',
    label: 'First Party Type',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'corporation', label: 'Corporation' },
      { value: 'llc', label: 'LLC' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'government', label: 'Government Agency' },
      { value: 'nonprofit', label: 'Nonprofit Organization' },
    ],
    required: true,
    group: 'party1',
  },
  {
    id: 'party1Address',
    type: 'textarea',
    label: 'First Party Address',
    placeholder: 'Enter complete address',
    required: true,
    group: 'party1',
  },
  {
    id: 'party1Representative',
    type: 'text',
    label: 'First Party Representative',
    placeholder: 'Name of authorized representative',
    required: false,
    group: 'party1',
  },
  {
    id: 'party1Title',
    type: 'text',
    label: 'First Party Representative Title',
    placeholder: 'Title of the representative',
    required: false,
    group: 'party1',
  },
  {
    id: 'party2Name',
    type: 'text',
    label: 'Second Party Name',
    placeholder: 'Enter organization or individual name',
    required: true,
    group: 'party2',
  },
  {
    id: 'party2Type',
    type: 'select',
    label: 'Second Party Type',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'corporation', label: 'Corporation' },
      { value: 'llc', label: 'LLC' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'government', label: 'Government Agency' },
      { value: 'nonprofit', label: 'Nonprofit Organization' },
    ],
    required: true,
    group: 'party2',
  },
  {
    id: 'party2Address',
    type: 'textarea',
    label: 'Second Party Address',
    placeholder: 'Enter complete address',
    required: true,
    group: 'party2',
  },
  {
    id: 'party2Representative',
    type: 'text',
    label: 'Second Party Representative',
    placeholder: 'Name of authorized representative',
    required: false,
    group: 'party2',
  },
  {
    id: 'party2Title',
    type: 'text',
    label: 'Second Party Representative Title',
    placeholder: 'Title of the representative',
    required: false,
    group: 'party2',
  },
  {
    id: 'party1Obligations',
    type: 'textarea',
    label: 'First Party Obligations',
    placeholder: 'List specific obligations and commitments of the first party',
    required: true,
    group: 'obligations',
  },
  {
    id: 'party2Obligations',
    type: 'textarea',
    label: 'Second Party Obligations',
    placeholder:
      'List specific obligations and commitments of the second party',
    required: true,
    group: 'obligations',
  },
  {
    id: 'mutualObligations',
    type: 'textarea',
    label: 'Mutual Obligations',
    placeholder: 'Describe shared responsibilities and mutual commitments',
    required: false,
    group: 'obligations',
  },
  {
    id: 'performanceStandards',
    type: 'textarea',
    label: 'Performance Standards',
    placeholder: 'Define quality standards and performance criteria',
    required: false,
    group: 'obligations',
  },
  {
    id: 'effectiveDate',
    type: 'date',
    label: 'Effective Date',
    required: true,
    group: 'timeline',
  },
  {
    id: 'expirationDate',
    type: 'date',
    label: 'Expiration Date',
    required: false,
    group: 'timeline',
  },
  {
    id: 'duration',
    type: 'text',
    label: 'Duration',
    placeholder: 'e.g., 3 years, indefinite, ongoing',
    required: false,
    group: 'timeline',
  },
  {
    id: 'milestones',
    type: 'textarea',
    label: 'Key Milestones',
    placeholder: 'List important milestones and deadlines',
    required: false,
    group: 'timeline',
  },
  {
    id: 'hasFinancialTerms',
    type: 'checkbox',
    label: 'This agreement involves financial terms',
    required: false,
    group: 'financial',
  },
  {
    id: 'paymentTerms',
    type: 'textarea',
    label: 'Payment Terms',
    placeholder: 'Specify payment obligations and terms',
    required: false,
    group: 'financial',
    dependsOn: 'hasFinancialTerms',
  },
  {
    id: 'financialObligations',
    type: 'textarea',
    label: 'Financial Obligations',
    placeholder: 'Detail financial commitments of each party',
    required: false,
    group: 'financial',
    dependsOn: 'hasFinancialTerms',
  },
  {
    id: 'costSharing',
    type: 'textarea',
    label: 'Cost Sharing Arrangements',
    placeholder: 'Describe how costs will be shared between parties',
    required: false,
    group: 'financial',
    dependsOn: 'hasFinancialTerms',
  },
  {
    id: 'governanceStructure',
    type: 'textarea',
    label: 'Governance Structure',
    placeholder: 'Describe the management and governance structure',
    required: false,
    group: 'governance',
  },
  {
    id: 'decisionMaking',
    type: 'textarea',
    label: 'Decision Making Process',
    placeholder: 'Outline how decisions will be made',
    required: false,
    group: 'governance',
  },
  {
    id: 'communicationProtocol',
    type: 'textarea',
    label: 'Communication Protocol',
    placeholder: 'Specify communication procedures and requirements',
    required: false,
    group: 'governance',
  },
  {
    id: 'reportingRequirements',
    type: 'textarea',
    label: 'Reporting Requirements',
    placeholder: 'Specify any reporting obligations',
    required: false,
    group: 'governance',
  },
  {
    id: 'confidentialityClause',
    type: 'checkbox',
    label: 'Include confidentiality provisions',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'confidentialityTerms',
    type: 'textarea',
    label: 'Confidentiality Terms',
    placeholder: 'Specify confidentiality obligations',
    required: false,
    group: 'confidentiality',
    dependsOn: 'confidentialityClause',
  },
  {
    id: 'ipOwnership',
    type: 'select',
    label: 'Intellectual Property Ownership',
    options: [
      { value: 'party1', label: 'First Party Owns' },
      { value: 'party2', label: 'Second Party Owns' },
      { value: 'shared', label: 'Shared Ownership' },
      { value: 'retained', label: 'Each Party Retains Their Own' },
    ],
    required: false,
    group: 'intellectual',
  },
  {
    id: 'ipLicensing',
    type: 'textarea',
    label: 'IP Licensing Terms',
    placeholder: 'Specify intellectual property licensing arrangements',
    required: false,
    group: 'intellectual',
  },
  {
    id: 'governingLaw',
    type: 'text',
    label: 'Governing Law',
    placeholder: 'e.g., State of California',
    required: false,
    group: 'legal',
  },
  {
    id: 'disputeResolution',
    type: 'select',
    label: 'Dispute Resolution Method',
    options: [
      { value: 'negotiation', label: 'Good Faith Negotiation' },
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
    required: false,
    group: 'legal',
  },
  {
    id: 'complianceRequirements',
    type: 'textarea',
    label: 'Compliance Requirements',
    placeholder: 'Specify any regulatory or compliance obligations',
    required: false,
    group: 'legal',
  },
  {
    id: 'terminationClause',
    type: 'textarea',
    label: 'Termination Conditions',
    placeholder:
      'Specify conditions under which the agreement can be terminated',
    required: false,
    group: 'termination',
  },
  {
    id: 'noticePeriod',
    type: 'text',
    label: 'Notice Period for Termination',
    placeholder: '30 days',
    required: false,
    group: 'termination',
  },
  {
    id: 'breachProvisions',
    type: 'textarea',
    label: 'Breach and Remedy Provisions',
    placeholder: 'Specify what constitutes breach and available remedies',
    required: false,
    group: 'termination',
  },
  {
    id: 'amendmentProcess',
    type: 'textarea',
    label: 'Amendment Process',
    placeholder: 'Describe how the agreement can be amended',
    required: false,
    group: 'additional',
  },
  {
    id: 'additionalTerms',
    type: 'textarea',
    label: 'Additional Terms',
    placeholder: 'Any additional terms or special provisions',
    required: false,
    group: 'additional',
  },
];
