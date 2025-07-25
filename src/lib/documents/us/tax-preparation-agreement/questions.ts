// src/lib/documents/us/tax-preparation-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const taxPreparationAgreementQuestions: FormQuestion[] = [
  {
    id: 'preparerName',
    type: 'text',
    label: 'Tax Preparer Name',
    placeholder: 'Enter tax preparer full name',
    required: true,
    group: 'preparer',
  },
  {
    id: 'preparerBusinessName',
    type: 'text',
    label: 'Business Name',
    placeholder: 'Enter business or firm name',
    required: false,
    group: 'preparer',
  },
  {
    id: 'preparerAddress',
    type: 'text',
    label: 'Preparer Address',
    placeholder: 'Enter complete business address',
    required: true,
    group: 'preparer',
  },
  {
    id: 'preparerPhone',
    type: 'text',
    label: 'Preparer Phone',
    placeholder: 'Enter phone number',
    required: false,
    group: 'preparer',
  },
  {
    id: 'preparerEmail',
    type: 'email',
    label: 'Preparer Email',
    placeholder: 'Enter email address',
    required: false,
    group: 'preparer',
  },
  {
    id: 'preparerPTIN',
    type: 'text',
    label: 'PTIN Number',
    placeholder: 'Preparer Tax Identification Number',
    required: false,
    group: 'preparer',
  },
  {
    id: 'preparerCredentials',
    type: 'text',
    label: 'Professional Credentials',
    placeholder: 'e.g., CPA, EA, Attorney',
    required: false,
    group: 'preparer',
  },
  {
    id: 'preparerLicenseNumber',
    type: 'text',
    label: 'License Number',
    placeholder: 'Professional license number',
    required: false,
    group: 'preparer',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client full name',
    required: true,
    group: 'client',
  },
  {
    id: 'clientAddress',
    type: 'text',
    label: 'Client Address',
    placeholder: 'Enter complete home address',
    required: true,
    group: 'client',
  },
  {
    id: 'clientPhone',
    type: 'text',
    label: 'Client Phone',
    placeholder: 'Enter phone number',
    required: false,
    group: 'client',
  },
  {
    id: 'clientEmail',
    type: 'email',
    label: 'Client Email',
    placeholder: 'Enter email address',
    required: false,
    group: 'client',
  },
  {
    id: 'spouseName',
    type: 'text',
    label: 'Spouse Name',
    placeholder: 'Enter spouse name if filing jointly',
    required: false,
    group: 'client',
  },
  {
    id: 'taxYear',
    type: 'text',
    label: 'Tax Year',
    placeholder: 'e.g., 2023',
    required: true,
    group: 'service-scope',
  },
  {
    id: 'serviceType',
    type: 'select',
    label: 'Service Type',
    options: [
      { value: 'individual', label: 'Individual Tax Return' },
      { value: 'business', label: 'Business Tax Return' },
      { value: 'both', label: 'Both Individual and Business' },
    ],
    required: true,
    group: 'service-scope',
  },
  {
    id: 'returnTypes',
    type: 'multiselect',
    label: 'Return Types',
    options: [
      { value: '1040', label: 'Form 1040 (Individual)' },
      { value: '1120', label: 'Form 1120 (Corporation)' },
      { value: '1120s', label: 'Form 1120S (S-Corporation)' },
      { value: '1065', label: 'Form 1065 (Partnership)' },
      { value: 'schedule-c', label: 'Schedule C (Sole Proprietorship)' },
      { value: '990', label: 'Form 990 (Non-Profit)' },
      { value: 'state-returns', label: 'State Returns' },
    ],
    required: false,
    group: 'service-scope',
  },
  {
    id: 'businessEntityType',
    type: 'text',
    label: 'Business Entity Type',
    placeholder: 'e.g., LLC, Corporation, Partnership',
    required: false,
    group: 'service-scope',
  },
  {
    id: 'multipleYears',
    type: 'checkbox',
    label: 'Include multiple tax years',
    required: false,
    group: 'service-scope',
  },
  {
    id: 'priorYearAmendments',
    type: 'checkbox',
    label: 'Include prior year amendments',
    required: false,
    group: 'service-scope',
  },
  {
    id: 'includedServices',
    type: 'multiselect',
    label: 'Included Services',
    options: [
      { value: 'tax-preparation', label: 'Tax Return Preparation' },
      { value: 'electronic-filing', label: 'Electronic Filing' },
      { value: 'consultation', label: 'Tax Consultation' },
      { value: 'review-session', label: 'Review Session' },
      { value: 'document-organization', label: 'Document Organization' },
      { value: 'tax-planning', label: 'Basic Tax Planning' },
    ],
    required: false,
    group: 'services',
  },
  {
    id: 'excludedServices',
    type: 'multiselect',
    label: 'Excluded Services',
    options: [
      { value: 'audit-representation', label: 'Audit Representation' },
      { value: 'bookkeeping', label: 'Bookkeeping Services' },
      { value: 'payroll', label: 'Payroll Services' },
      { value: 'business-consulting', label: 'Business Consulting' },
      { value: 'legal-advice', label: 'Legal Advice' },
    ],
    required: false,
    group: 'services',
  },
  {
    id: 'consultationIncluded',
    type: 'checkbox',
    label: 'Include consultation services',
    required: false,
    group: 'services',
  },
  {
    id: 'auditSupport',
    type: 'checkbox',
    label: 'Include audit support',
    required: false,
    group: 'services',
  },
  {
    id: 'bookkeepingServices',
    type: 'checkbox',
    label: 'Include bookkeeping services',
    required: false,
    group: 'services',
  },
  {
    id: 'quarterlyServices',
    type: 'checkbox',
    label: 'Include quarterly services',
    required: false,
    group: 'services',
  },
  {
    id: 'payrollServices',
    type: 'checkbox',
    label: 'Include payroll services',
    required: false,
    group: 'services',
  },
  {
    id: 'feeStructure',
    type: 'select',
    label: 'Fee Structure',
    options: [
      { value: 'flat-fee', label: 'Flat Fee' },
      { value: 'hourly', label: 'Hourly Rate' },
      { value: 'per-form', label: 'Per Form Basis' },
      { value: 'complexity-based', label: 'Complexity Based' },
    ],
    required: true,
    group: 'fees',
  },
  {
    id: 'baseFee',
    type: 'text',
    label: 'Base Fee',
    placeholder: 'Enter base fee amount',
    required: false,
    group: 'fees',
  },
  {
    id: 'hourlyRate',
    type: 'text',
    label: 'Hourly Rate',
    placeholder: 'Enter hourly rate',
    required: false,
    group: 'fees',
    dependsOn: 'feeStructure',
  },
  {
    id: 'additionalFormFees',
    type: 'checkbox',
    label: 'Charge additional fees for extra forms',
    required: false,
    group: 'fees',
  },
  {
    id: 'complexityFactors',
    type: 'multiselect',
    label: 'Complexity Factors',
    options: [
      { value: 'rental-property', label: 'Rental Property' },
      { value: 'business-income', label: 'Business Income' },
      { value: 'foreign-income', label: 'Foreign Income' },
      { value: 'stock-transactions', label: 'Stock Transactions' },
      { value: 'itemized-deductions', label: 'Itemized Deductions' },
      { value: 'multiple-states', label: 'Multiple States' },
    ],
    required: false,
    group: 'fees',
  },
  {
    id: 'paymentSchedule',
    type: 'select',
    label: 'Payment Schedule',
    options: [
      { value: 'upfront', label: 'Payment Due Upfront' },
      { value: 'completion', label: 'Payment Due at Completion' },
      { value: 'split', label: 'Split Payment' },
    ],
    required: true,
    group: 'fees',
  },
  {
    id: 'amendmentFee',
    type: 'text',
    label: 'Amendment Fee',
    placeholder: 'Fee for amended returns',
    required: false,
    group: 'additional-fees',
  },
  {
    id: 'extensionFee',
    type: 'text',
    label: 'Extension Fee',
    placeholder: 'Fee for filing extensions',
    required: false,
    group: 'additional-fees',
  },
  {
    id: 'auditRepresentationFee',
    type: 'text',
    label: 'Audit Representation Fee',
    placeholder: 'Fee for audit representation',
    required: false,
    group: 'additional-fees',
  },
  {
    id: 'consultationFee',
    type: 'text',
    label: 'Consultation Fee',
    placeholder: 'Fee for additional consultations',
    required: false,
    group: 'additional-fees',
  },
  {
    id: 'rushJobFee',
    type: 'text',
    label: 'Rush Job Fee',
    placeholder: 'Fee for rush/expedited service',
    required: false,
    group: 'additional-fees',
  },
  {
    id: 'accurateInformation',
    type: 'checkbox',
    label: 'Client must provide accurate information',
    required: false,
    group: 'client-responsibilities',
  },
  {
    id: 'completeDocuments',
    type: 'checkbox',
    label: 'Client must provide complete documents',
    required: false,
    group: 'client-responsibilities',
  },
  {
    id: 'timelyProvision',
    type: 'checkbox',
    label: 'Client must provide documents timely',
    required: false,
    group: 'client-responsibilities',
  },
  {
    id: 'documentRetention',
    type: 'checkbox',
    label: 'Client responsible for document retention',
    required: false,
    group: 'client-responsibilities',
  },
  {
    id: 'communicateChanges',
    type: 'checkbox',
    label: 'Client must communicate changes',
    required: false,
    group: 'client-responsibilities',
  },
  {
    id: 'reviewBeforeSigning',
    type: 'checkbox',
    label: 'Client must review return before signing',
    required: false,
    group: 'client-responsibilities',
  },
  {
    id: 'requiredDocuments',
    type: 'multiselect',
    label: 'Required Documents',
    options: [
      { value: 'w2-forms', label: 'W-2 Forms' },
      { value: '1099-forms', label: '1099 Forms' },
      { value: 'k1-forms', label: 'Schedule K-1 Forms' },
      { value: 'receipts', label: 'Receipts for Deductions' },
      { value: 'bank-statements', label: 'Bank Statements' },
      { value: 'prior-year-return', label: 'Prior Year Tax Return' },
      { value: 'business-records', label: 'Business Records' },
    ],
    required: false,
    group: 'documents',
  },
  {
    id: 'w2Forms',
    type: 'checkbox',
    label: 'W-2 forms required',
    required: false,
    group: 'documents',
  },
  {
    id: 'form1099',
    type: 'checkbox',
    label: '1099 forms required',
    required: false,
    group: 'documents',
  },
  {
    id: 'scheduleK1',
    type: 'checkbox',
    label: 'Schedule K-1 required',
    required: false,
    group: 'documents',
  },
  {
    id: 'businessRecords',
    type: 'checkbox',
    label: 'Business records required',
    required: false,
    group: 'documents',
  },
  {
    id: 'receiptsRequired',
    type: 'checkbox',
    label: 'Receipts required for deductions',
    required: false,
    group: 'documents',
  },
  {
    id: 'bankStatements',
    type: 'checkbox',
    label: 'Bank statements required',
    required: false,
    group: 'documents',
  },
  {
    id: 'competentPreparation',
    type: 'checkbox',
    label: 'Preparer provides competent preparation',
    required: false,
    group: 'preparer-responsibilities',
  },
  {
    id: 'dueDiligence',
    type: 'checkbox',
    label: 'Preparer exercises due diligence',
    required: false,
    group: 'preparer-responsibilities',
  },
  {
    id: 'accurateCalculations',
    type: 'checkbox',
    label: 'Preparer ensures accurate calculations',
    required: false,
    group: 'preparer-responsibilities',
  },
  {
    id: 'timelyFiling',
    type: 'checkbox',
    label: 'Preparer ensures timely filing',
    required: false,
    group: 'preparer-responsibilities',
  },
  {
    id: 'confidentialityMaintenance',
    type: 'checkbox',
    label: 'Preparer maintains confidentiality',
    required: false,
    group: 'preparer-responsibilities',
  },
  {
    id: 'professionalStandards',
    type: 'checkbox',
    label: 'Preparer follows professional standards',
    required: false,
    group: 'preparer-responsibilities',
  },
  {
    id: 'filingDeadline',
    type: 'text',
    label: 'Filing Deadline',
    placeholder: 'Tax return filing deadline',
    required: false,
    group: 'filing',
  },
  {
    id: 'extensionRequests',
    type: 'checkbox',
    label: 'Allow extension requests',
    required: false,
    group: 'filing',
  },
  {
    id: 'electronicFiling',
    type: 'checkbox',
    label: 'Use electronic filing',
    required: false,
    group: 'filing',
  },
  {
    id: 'paperFiling',
    type: 'checkbox',
    label: 'Allow paper filing',
    required: false,
    group: 'filing',
  },
  {
    id: 'clientApprovalRequired',
    type: 'checkbox',
    label: 'Require client approval before filing',
    required: false,
    group: 'filing',
  },
  {
    id: 'signatureRequirement',
    type: 'checkbox',
    label: 'Require client signature on return',
    required: false,
    group: 'filing',
  },
  {
    id: 'accuracyStandard',
    type: 'select',
    label: 'Accuracy Standard',
    options: [
      { value: 'reasonable-care', label: 'Reasonable Care' },
      { value: 'best-efforts', label: 'Best Efforts' },
      { value: 'professional-standard', label: 'Professional Standard' },
    ],
    required: true,
    group: 'accuracy',
  },
  {
    id: 'clientReviewRequired',
    type: 'checkbox',
    label: 'Require client review of return',
    required: false,
    group: 'accuracy',
  },
  {
    id: 'preparerLiability',
    type: 'select',
    label: 'Preparer Liability',
    options: [
      { value: 'limited', label: 'Limited Liability' },
      { value: 'fee-limitation', label: 'Limited to Fee Amount' },
      { value: 'full-liability', label: 'Full Liability' },
    ],
    required: true,
    group: 'accuracy',
  },
  {
    id: 'errorsOmissionsInsurance',
    type: 'checkbox',
    label: 'Preparer carries E&O insurance',
    required: false,
    group: 'accuracy',
  },
  {
    id: 'liabilityLimitation',
    type: 'text',
    label: 'Liability Limitation',
    placeholder: 'Describe liability limitations',
    required: false,
    group: 'accuracy',
  },
  {
    id: 'penaltyResponsibility',
    type: 'select',
    label: 'Penalty Responsibility',
    options: [
      { value: 'client', label: 'Client Responsible' },
      { value: 'preparer', label: 'Preparer Responsible' },
      { value: 'case-by-case', label: 'Case by Case Basis' },
    ],
    required: true,
    group: 'penalties',
  },
  {
    id: 'interestResponsibility',
    type: 'select',
    label: 'Interest Responsibility',
    options: [
      { value: 'client', label: 'Client Responsible' },
      { value: 'preparer', label: 'Preparer Responsible' },
      { value: 'case-by-case', label: 'Case by Case Basis' },
    ],
    required: true,
    group: 'penalties',
  },
  {
    id: 'preparerPenaltyProtection',
    type: 'checkbox',
    label: 'Preparer penalty protection included',
    required: false,
    group: 'penalties',
  },
  {
    id: 'confidentialityClause',
    type: 'checkbox',
    label: 'Include confidentiality clause',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'clientPrivilege',
    type: 'checkbox',
    label: 'Include client privilege protection',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'thirdPartyDisclosure',
    type: 'checkbox',
    label: 'Allow third-party disclosure',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'irsDisclosure',
    type: 'checkbox',
    label: 'Allow IRS disclosure as required',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'recordRetentionPeriod',
    type: 'text',
    label: 'Record Retention Period',
    placeholder: 'How long records will be kept',
    required: false,
    group: 'records',
  },
  {
    id: 'clientRecordReturn',
    type: 'checkbox',
    label: 'Return client records upon request',
    required: false,
    group: 'records',
  },
  {
    id: 'preparerRecordKeeping',
    type: 'checkbox',
    label: 'Preparer maintains records',
    required: false,
    group: 'records',
  },
  {
    id: 'digitalRecords',
    type: 'checkbox',
    label: 'Allow digital record keeping',
    required: false,
    group: 'records',
  },
  {
    id: 'backupProcedures',
    type: 'checkbox',
    label: 'Include backup procedures',
    required: false,
    group: 'records',
  },
  {
    id: 'preferredCommunication',
    type: 'select',
    label: 'Preferred Communication Method',
    options: [
      { value: 'phone', label: 'Phone' },
      { value: 'email', label: 'Email' },
      { value: 'in-person', label: 'In-Person' },
      { value: 'portal', label: 'Client Portal' },
    ],
    required: true,
    group: 'communication',
  },
  {
    id: 'responseTimeframe',
    type: 'text',
    label: 'Response Timeframe',
    placeholder: 'Expected response time for communications',
    required: false,
    group: 'communication',
  },
  {
    id: 'emergencyContact',
    type: 'checkbox',
    label: 'Provide emergency contact option',
    required: false,
    group: 'communication',
  },
  {
    id: 'clientPortalAccess',
    type: 'checkbox',
    label: 'Provide client portal access',
    required: false,
    group: 'communication',
  },
  {
    id: 'auditAssistance',
    type: 'checkbox',
    label: 'Provide audit assistance',
    required: false,
    group: 'audit-support',
  },
  {
    id: 'auditRepresentation',
    type: 'checkbox',
    label: 'Provide audit representation',
    required: false,
    group: 'audit-support',
  },
  {
    id: 'auditPreparation',
    type: 'checkbox',
    label: 'Provide audit preparation',
    required: false,
    group: 'audit-support',
  },
  {
    id: 'correspondenceHandling',
    type: 'checkbox',
    label: 'Handle IRS correspondence',
    required: false,
    group: 'audit-support',
  },
  {
    id: 'auditFees',
    type: 'text',
    label: 'Audit Support Fees',
    placeholder: 'Fees for audit support services',
    required: false,
    group: 'audit-support',
  },
  {
    id: 'softwareUsed',
    type: 'text',
    label: 'Tax Software Used',
    placeholder: 'Name of tax preparation software',
    required: false,
    group: 'technology',
  },
  {
    id: 'dataEncryption',
    type: 'checkbox',
    label: 'Use data encryption',
    required: false,
    group: 'technology',
  },
  {
    id: 'secureTransmission',
    type: 'checkbox',
    label: 'Use secure data transmission',
    required: false,
    group: 'technology',
  },
  {
    id: 'cloudStorage',
    type: 'checkbox',
    label: 'Use cloud storage',
    required: false,
    group: 'technology',
  },
  {
    id: 'dataBackup',
    type: 'checkbox',
    label: 'Maintain data backups',
    required: false,
    group: 'technology',
  },
  {
    id: 'terminationRights',
    type: 'checkbox',
    label: 'Include termination rights',
    required: false,
    group: 'termination',
  },
  {
    id: 'terminationNotice',
    type: 'text',
    label: 'Termination Notice',
    placeholder: 'Required notice for termination',
    required: false,
    group: 'termination',
  },
  {
    id: 'completedWorkPayment',
    type: 'checkbox',
    label: 'Payment due for completed work',
    required: false,
    group: 'termination',
  },
  {
    id: 'fileTransfer',
    type: 'checkbox',
    label: 'Transfer files upon termination',
    required: false,
    group: 'termination',
  },
  {
    id: 'disputeResolution',
    type: 'select',
    label: 'Dispute Resolution Method',
    options: [
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
    required: false,
    group: 'legal',
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
    id: 'jurisdiction',
    type: 'text',
    label: 'Jurisdiction',
    placeholder: 'Where disputes will be resolved',
    required: false,
    group: 'legal',
  },
  {
    id: 'attorneyFees',
    type: 'checkbox',
    label: 'Include attorney fees clause',
    required: false,
    group: 'legal',
  },
  {
    id: 'requirePreparerSignature',
    type: 'checkbox',
    label: 'Require preparer signature',
    required: false,
    group: 'signatures',
  },
  {
    id: 'requireClientSignature',
    type: 'checkbox',
    label: 'Require client signature',
    required: false,
    group: 'signatures',
  },
  {
    id: 'electronicSignatureAccepted',
    type: 'checkbox',
    label: 'Accept electronic signatures',
    required: false,
    group: 'signatures',
  },
  {
    id: 'witnessRequired',
    type: 'checkbox',
    label: 'Require witness',
    required: false,
    group: 'signatures',
  },
  {
    id: 'notarizationRequired',
    type: 'checkbox',
    label: 'Require notarization',
    required: false,
    group: 'signatures',
  },
];
