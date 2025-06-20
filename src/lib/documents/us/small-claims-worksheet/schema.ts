import { z } from 'zod';

export const smallClaimsWorksheetSchema = z.object({
  // Case Overview
  caseOverview: z.object({
    caseTitle: z.string().min(1, 'Case title is required'),
    caseType: z.enum(['contract_dispute', 'property_damage', 'unpaid_debt', 'landlord_tenant', 'personal_injury', 'warranty_issue', 'service_dispute', 'other']),
    customCaseType: z.string().optional(),
    totalAmountClaimed: z.number().min(0, 'Amount must be positive'),
    courtJurisdiction: z.string().min(1, 'Court jurisdiction is required'),
    filingDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
  }),

  // Plaintiff Information
  plaintiff: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Plaintiff name is required'),
    businessName: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
    email: z.string().email('Invalid email address').optional(),
    occupation: z.string().optional()
  }),

  // Defendant Information
  defendant: z.object({
    type: z.enum(['individual', 'business', 'unknown']),
    name: z.string().min(1, 'Defendant name is required'),
    businessName: z.string().optional(),
    knownAddresses: z.array(z.object({
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      type: z.enum(['home', 'work', 'business', 'mailing'])
    })).min(1, 'At least one address is required'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX').optional(),
    email: z.string().email('Invalid email address').optional(),
    employer: z.string().optional(),
    lastKnownLocation: z.string().optional()
  }),

  // Case Facts
  caseFacts: z.object({
    relationshipToDefendant: z.enum(['customer', 'tenant', 'landlord', 'contractor', 'business_partner', 'neighbor', 'stranger', 'other']),
    relationshipDescription: z.string().optional(),
    incidentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    incidentLocation: z.string().min(1, 'Incident location is required'),
    factualDescription: z.string().min(100, 'Please provide a detailed description (at least 100 characters)'),
    chronologyOfEvents: z.array(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      description: z.string().min(10, 'Description required')
    })).min(1, 'Please provide at least one event'),
    attemptedResolution: z.string().optional(),
    demandLetterSent: z.boolean(),
    demandLetterDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    defendantResponse: z.string().optional()
  }),

  // Legal Basis
  legalBasis: z.object({
    contractExists: z.boolean(),
    contractType: z.enum(['written', 'oral', 'implied']).optional(),
    contractTerms: z.string().optional(),
    breachOfContract: z.string().optional(),
    negligenceAlleged: z.boolean(),
    negligenceDescription: z.string().optional(),
    applicableLaws: z.array(z.string()).optional(),
    statuteOfLimitations: z.object({
      withinTimeLimit: z.boolean(),
      timeLimit: z.string().optional(),
      calculationBasis: z.string().optional()
    })
  }),

  // Damages Calculation
  damages: z.object({
    directDamages: z.array(z.object({
      type: z.string(),
      description: z.string(),
      amount: z.number().min(0),
      documentation: z.string().optional()
    })),
    indirectDamages: z.array(z.object({
      type: z.string(),
      description: z.string(),
      amount: z.number().min(0),
      documentation: z.string().optional()
    })).optional(),
    lostWages: z.object({
      applicable: z.boolean(),
      dailyWage: z.number().min(0).optional(),
      daysLost: z.number().min(0).optional(),
      totalAmount: z.number().min(0).optional()
    }),
    outOfPocketExpenses: z.array(z.object({
      expense: z.string(),
      amount: z.number().min(0),
      receipt: z.boolean()
    })).optional(),
    courtCosts: z.object({
      filingFee: z.number().min(0).optional(),
      serviceFee: z.number().min(0).optional(),
      otherCosts: z.number().min(0).optional()
    }),
    interestRequested: z.boolean(),
    interestRate: z.number().min(0).max(100).optional(),
    interestFromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
  }),

  // Evidence
  evidence: z.object({
    documents: z.array(z.object({
      type: z.string(),
      description: z.string(),
      dateCreated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
      originalAvailable: z.boolean(),
      relevance: z.string()
    })).optional(),
    photographs: z.array(z.object({
      description: z.string(),
      dateTaken: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
      relevance: z.string()
    })).optional(),
    physicalEvidence: z.array(z.object({
      item: z.string(),
      condition: z.string(),
      location: z.string(),
      relevance: z.string()
    })).optional(),
    electronicEvidence: z.array(z.object({
      type: z.enum(['email', 'text', 'social_media', 'website', 'audio', 'video', 'other']),
      description: z.string(),
      dateCreated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
      authenticated: z.boolean()
    })).optional()
  }),

  // Witnesses
  witnesses: z.array(z.object({
    name: z.string().min(1, 'Witness name is required'),
    relationship: z.string(),
    address: z.string().optional(),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX').optional(),
    email: z.string().email('Invalid email address').optional(),
    relevantKnowledge: z.string().min(20, 'Please describe what the witness knows'),
    willTestify: z.enum(['yes', 'no', 'unknown']),
    statementObtained: z.boolean(),
    credibility: z.enum(['excellent', 'good', 'fair', 'poor']).optional()
  })).optional(),

  // Court Preparation
  courtPreparation: z.object({
    courtName: z.string().optional(),
    courtAddress: z.string().optional(),
    judgeAssigned: z.string().optional(),
    hearingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    hearingTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format').optional(),
    estimatedDuration: z.string().optional(),
    presentationOutline: z.string().optional(),
    questionsForDefendant: z.array(z.string()).optional(),
    anticipatedDefenses: z.array(z.string()).optional(),
    responsesToDefenses: z.array(z.string()).optional()
  }),

  // Settlement Considerations
  settlement: z.object({
    willingToSettle: z.boolean(),
    minimumAcceptable: z.number().min(0).optional(),
    settlementTerms: z.string().optional(),
    mediationConsidered: z.boolean(),
    timelineForSettlement: z.string().optional(),
    alternativeResolution: z.string().optional()
  }),

  // Service of Process
  serviceOfProcess: z.object({
    serviceMethod: z.enum(['personal_service', 'substituted_service', 'certified_mail', 'publication', 'other']).optional(),
    serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    serverName: z.string().optional(),
    serviceDetails: z.string().optional(),
    proofOfService: z.boolean().optional()
  }),

  // Follow-up Actions
  followUp: z.object({
    judgmentObtained: z.boolean().optional(),
    judgmentAmount: z.number().min(0).optional(),
    collectionNeeded: z.boolean().optional(),
    collectionMethods: z.array(z.string()).optional(),
    appealConsidered: z.boolean().optional(),
    lessonsLearned: z.string().optional()
  })\n});\n\nexport type SmallClaimsWorksheet = z.infer<typeof smallClaimsWorksheetSchema>;"}]