import { z } from 'zod';

export const indemnityAgreementSchema = z.object({
  // Indemnitee Information (Party being protected)
  indemnitee: z.object({
    type: z.enum(['individual', 'business', 'government']),
    name: z.string().min(1, 'Indemnitee name is required'),
    businessName: z.string().optional(),
    title: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
    email: z.string().email('Invalid email address')
  }),

  // Indemnitor Information (Party providing indemnity)
  indemnitor: z.object({
    type: z.enum(['individual', 'business', 'government']),
    name: z.string().min(1, 'Indemnitor name is required'),
    businessName: z.string().optional(),
    title: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
    email: z.string().email('Invalid email address')
  }),

  // Agreement Context
  context: z.object({
    relationshipType: z.enum(['contractor', 'vendor', 'partner', 'tenant', 'service_provider', 'other']),
    primaryAgreement: z.string().optional(),
    primaryAgreementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    projectDescription: z.string().min(50, 'Please provide a detailed description (at least 50 characters)'),
    effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    terminationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
  }),

  // Scope of Indemnification
  indemnificationScope: z.object({
    coverageType: z.enum(['broad', 'intermediate', 'limited']),
    coveredClaims: z.object({
      thirdPartyClaims: z.boolean().default(true),
      propertyDamage: z.boolean().default(true),
      personalInjury: z.boolean().default(true),
      intellectualProperty: z.boolean(),
      employmentClaims: z.boolean(),
      environmentalClaims: z.boolean(),
      contractualLiability: z.boolean(),
      professionalErrors: z.boolean()
    }),
    specificRisks: z.array(z.string()).optional(),
    geographicScope: z.enum(['worldwide', 'usa', 'state', 'local'])
  }),

  // Financial Terms
  financialTerms: z.object({
    monetaryLimit: z.object({
      hasLimit: z.boolean(),
      limitAmount: z.number().positive().optional(),
      limitType: z.enum(['perOccurrence', 'aggregate', 'both']).optional()
    }),
    deductible: z.object({
      hasDeductible: z.boolean(),
      deductibleAmount: z.number().positive().optional(),
      deductibleType: z.enum(['perClaim', 'aggregate']).optional()
    }),
    paymentTerms: z.string().optional()
  }),

  // Defense Obligations
  defenseObligations: z.object({
    dutyToDefend: z.boolean(),
    rightToDefend: z.boolean(),
    selectionOfCounsel: z.enum(['indemnitor', 'indemnitee', 'mutual']),
    settlementApproval: z.enum(['indemnitor', 'indemnitee', 'mutual', 'none']),
    costAllocation: z.object({
      defenseCosts: z.enum(['included', 'additional', 'shared']),
      expertFees: z.boolean(),
      investigationCosts: z.boolean()
    })
  }),

  // Insurance Requirements
  insuranceRequirements: z.object({
    required: z.boolean(),
    generalLiability: z.object({
      required: z.boolean(),
      minimumAmount: z.number().positive().optional(),
      additionalInsured: z.boolean()
    }),
    professionalLiability: z.object({
      required: z.boolean(),
      minimumAmount: z.number().positive().optional()
    }),
    umbrellaPolicy: z.object({
      required: z.boolean(),
      minimumAmount: z.number().positive().optional()
    }),
    certificateRequired: z.boolean(),
    noticePeriod: z.number().min(0).max(90).optional()
  }),

  // Exclusions
  exclusions: z.object({
    intentionalActs: z.boolean().default(true),
    criminalActs: z.boolean().default(true),
    fraudulentActs: z.boolean().default(true),
    grossNegligence: z.boolean(),
    soleNegligence: z.boolean(),
    punitiveDamages: z.boolean(),
    consequentialDamages: z.boolean(),
    customExclusions: z.array(z.string()).optional()
  }),

  // Notice and Procedures
  procedures: z.object({
    noticeDeadline: z.number().min(1).max(30),
    noticeMethod: z.enum(['written', 'email', 'both']),
    noticeAddress: z.string(),
    cooperationRequired: z.boolean().default(true),
    recordsRetention: z.number().min(1).max(10),
    auditRights: z.boolean()
  }),

  // Additional Provisions
  additionalProvisions: z.object({
    survivalPeriod: z.number().min(0).max(10),
    assignmentAllowed: z.boolean(),
    subrogationWaiver: z.boolean(),
    severability: z.boolean().default(true),
    entireAgreement: z.boolean().default(true),
    amendmentRequirements: z.string().optional()
  }),

  // Governing Law
  governingLaw: z.object({
    state: z.string().min(2, 'Governing state is required'),
    venue: z.string(),
    disputeResolution: z.enum(['litigation', 'arbitration', 'mediation_then_arbitration']),
    attorneyFees: z.enum(['prevailing_party', 'each_party_own', 'indemnitor_pays'])
  }),

  // Execution
  execution: z.object({
    indemnitorSignature: z.string().optional(),
    indemnitorDate: z.string().optional(),
    indemnitorTitle: z.string().optional(),
    indemniteeSignature: z.string().optional(),
    indemniteeDate: z.string().optional(),
    indemniteeTitle: z.string().optional(),
    witnessRequired: z.boolean(),
    notarizationRequired: z.boolean()
  })
});

export type IndemnityAgreement = z.infer<typeof indemnityAgreementSchema>;