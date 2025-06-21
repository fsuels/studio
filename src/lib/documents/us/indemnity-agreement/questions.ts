import { DocumentQuestion } from '@/types/documents';

export const indemnityAgreementQuestions: DocumentQuestion[] = [
  // Context
  {
    id: 'context.relationshipType',
    text: 'What is the relationship between the parties?',
    type: 'select',
    required: true,
    options: [
      { value: 'contractor', label: 'Contractor/Subcontractor' },
      { value: 'vendor', label: 'Vendor/Supplier' },
      { value: 'partner', label: 'Business Partner' },
      { value: 'tenant', label: 'Tenant/Landlord' },
      { value: 'service_provider', label: 'Service Provider' },
      { value: 'other', label: 'Other' },
    ],
  },

  // Indemnitee Information
  {
    id: 'indemnitee.type',
    text: 'Who is being protected (Indemnitee)?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business' },
      { value: 'government', label: 'Government Entity' },
    ],
  },
  {
    id: 'indemnitee.name',
    text: 'Full legal name of the protected party',
    type: 'text',
    required: true,
    placeholder: 'ABC Corporation or John Smith',
  },
  {
    id: 'indemnitee.address',
    text: 'Street address',
    type: 'text',
    required: true,
    placeholder: '123 Main Street',
  },
  {
    id: 'indemnitee.city',
    text: 'City',
    type: 'text',
    required: true,
  },
  {
    id: 'indemnitee.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'indemnitee.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345',
  },
  {
    id: 'indemnitee.phone',
    text: 'Phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567',
  },
  {
    id: 'indemnitee.email',
    text: 'Email address',
    type: 'email',
    required: true,
    placeholder: 'contact@example.com',
  },

  // Indemnitor Information
  {
    id: 'indemnitor.type',
    text: 'Who is providing indemnity (Indemnitor)?',
    type: 'select',
    required: true,
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business' },
      { value: 'government', label: 'Government Entity' },
    ],
  },
  {
    id: 'indemnitor.name',
    text: 'Full legal name of the indemnifying party',
    type: 'text',
    required: true,
    placeholder: 'XYZ Services, LLC or Jane Doe',
  },
  {
    id: 'indemnitor.address',
    text: 'Street address',
    type: 'text',
    required: true,
    placeholder: '456 Oak Avenue',
  },
  {
    id: 'indemnitor.city',
    text: 'City',
    type: 'text',
    required: true,
  },
  {
    id: 'indemnitor.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'indemnitor.zipCode',
    text: 'ZIP Code',
    type: 'text',
    required: true,
    placeholder: '12345',
  },
  {
    id: 'indemnitor.phone',
    text: 'Phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 987-6543',
  },
  {
    id: 'indemnitor.email',
    text: 'Email address',
    type: 'email',
    required: true,
    placeholder: 'info@example.com',
  },

  // Agreement Details
  {
    id: 'context.projectDescription',
    text: 'Describe the project, activity, or situation covered by this indemnity',
    type: 'textarea',
    required: true,
    placeholder:
      'Provide a detailed description of the work, project, or activities that this indemnity agreement covers...',
    minLength: 50,
  },
  {
    id: 'context.effectiveDate',
    text: 'When does this agreement become effective?',
    type: 'date',
    required: true,
  },
  {
    id: 'context.terminationDate',
    text: 'When does this agreement end? (Optional)',
    type: 'date',
    required: false,
    helpText: 'Leave blank if ongoing',
  },

  // Scope of Indemnification
  {
    id: 'indemnificationScope.coverageType',
    text: 'How broad should the indemnification coverage be?',
    type: 'select',
    required: true,
    options: [
      {
        value: 'broad',
        label: 'Broad Form - Covers all claims regardless of fault',
      },
      {
        value: 'intermediate',
        label: 'Intermediate Form - Covers shared and indemnitee fault',
      },
      {
        value: 'limited',
        label: 'Limited Form - Covers only indemnitor fault',
      },
    ],
    helpText:
      'Broad form provides maximum protection but may not be enforceable in all states',
  },
  {
    id: 'indemnificationScope.coveredClaims',
    text: 'What types of claims should be covered?',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'thirdPartyClaims', label: 'Third-party claims' },
      { value: 'propertyDamage', label: 'Property damage' },
      { value: 'personalInjury', label: 'Personal injury/bodily injury' },
      { value: 'intellectualProperty', label: 'Intellectual property claims' },
      { value: 'employmentClaims', label: 'Employment-related claims' },
      { value: 'environmentalClaims', label: 'Environmental claims' },
      { value: 'contractualLiability', label: 'Contractual liability' },
      { value: 'professionalErrors', label: 'Professional errors & omissions' },
    ],
  },

  // Financial Limits
  {
    id: 'financialTerms.monetaryLimit.hasLimit',
    text: 'Do you want to set a monetary limit on indemnification?',
    type: 'boolean',
    required: true,
    helpText: "Setting limits caps the indemnitor's financial exposure",
  },
  {
    id: 'financialTerms.monetaryLimit.limitAmount',
    text: 'Maximum indemnification amount',
    type: 'number',
    required: false,
    placeholder: '1000000',
    conditionalOn: {
      field: 'financialTerms.monetaryLimit.hasLimit',
      value: true,
    },
    helpText: 'Enter amount in dollars',
  },

  // Defense Obligations
  {
    id: 'defenseObligations.dutyToDefend',
    text: 'Should the indemnitor have a duty to defend claims?',
    type: 'boolean',
    required: true,
    helpText: 'This requires the indemnitor to provide legal defense',
  },
  {
    id: 'defenseObligations.selectionOfCounsel',
    text: 'Who selects the defense attorney?',
    type: 'select',
    required: true,
    options: [
      { value: 'indemnitor', label: 'Indemnitor chooses' },
      { value: 'indemnitee', label: 'Indemnitee chooses' },
      { value: 'mutual', label: 'Mutual agreement required' },
    ],
  },

  // Insurance Requirements
  {
    id: 'insuranceRequirements.required',
    text: 'Require the indemnitor to maintain insurance?',
    type: 'boolean',
    required: true,
    helpText: 'Insurance backing strengthens indemnification',
  },
  {
    id: 'insuranceRequirements.generalLiability.minimumAmount',
    text: 'Minimum general liability insurance amount',
    type: 'number',
    required: false,
    placeholder: '1000000',
    conditionalOn: { field: 'insuranceRequirements.required', value: true },
    helpText: 'Enter amount in dollars',
  },

  // Key Exclusions
  {
    id: 'exclusions.grossNegligence',
    text: 'Exclude gross negligence from indemnification?',
    type: 'boolean',
    required: true,
    helpText:
      'Recommended - indemnification for gross negligence may not be enforceable',
  },
  {
    id: 'exclusions.soleNegligence',
    text: 'Exclude sole negligence of indemnitee?',
    type: 'boolean',
    required: true,
    helpText: 'Some states require this exclusion',
  },

  // Notice Requirements
  {
    id: 'procedures.noticeDeadline',
    text: 'How many days does the indemnitee have to provide notice of a claim?',
    type: 'number',
    required: true,
    placeholder: '30',
    helpText: 'Typical range is 10-30 days',
  },
  {
    id: 'procedures.noticeAddress',
    text: 'Address for claim notices',
    type: 'text',
    required: true,
    placeholder: 'Same as indemnitor address or specify different address',
  },

  // Governing Law
  {
    id: 'governingLaw.state',
    text: "Which state's laws will govern this agreement?",
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'governingLaw.venue',
    text: 'County/city for legal venue',
    type: 'text',
    required: true,
    placeholder: 'County or city name',
  },
  {
    id: 'governingLaw.disputeResolution',
    text: 'How should disputes be resolved?',
    type: 'select',
    required: true,
    options: [
      { value: 'litigation', label: 'Court litigation' },
      { value: 'arbitration', label: 'Binding arbitration' },
      {
        value: 'mediation_then_arbitration',
        label: 'Mediation, then arbitration',
      },
    ],
  },
];
