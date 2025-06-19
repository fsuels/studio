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
      description: z.string().min(10, 'Description required')\n    })).min(1, 'Please provide at least one event'),\n    attemptedResolution: z.string().optional(),\n    demandLetterSent: z.boolean(),\n    demandLetterDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),\n    defendantResponse: z.string().optional()\n  }),\n\n  // Legal Basis\n  legalBasis: z.object({\n    contractExists: z.boolean(),\n    contractType: z.enum(['written', 'oral', 'implied']).optional(),\n    contractTerms: z.string().optional(),\n    breachOfContract: z.string().optional(),\n    negligenceAlleged: z.boolean(),\n    negligenceDescription: z.string().optional(),\n    applicableLaws: z.array(z.string()).optional(),\n    statuteOfLimitations: z.object({\n      withinTimeLimit: z.boolean(),\n      timeLimit: z.string().optional(),\n      calculationBasis: z.string().optional()\n    })\n  }),\n\n  // Damages Calculation\n  damages: z.object({\n    directDamages: z.array(z.object({\n      type: z.string(),\n      description: z.string(),\n      amount: z.number().min(0),\n      documentation: z.string().optional()\n    })),\n    indirectDamages: z.array(z.object({\n      type: z.string(),\n      description: z.string(),\n      amount: z.number().min(0),\n      documentation: z.string().optional()\n    })).optional(),\n    lostWages: z.object({\n      applicable: z.boolean(),\n      dailyWage: z.number().min(0).optional(),\n      daysLost: z.number().min(0).optional(),\n      totalAmount: z.number().min(0).optional()\n    }),\n    outOfPocketExpenses: z.array(z.object({\n      expense: z.string(),\n      amount: z.number().min(0),\n      receipt: z.boolean()\n    })).optional(),\n    courtCosts: z.object({\n      filingFee: z.number().min(0).optional(),\n      serviceFee: z.number().min(0).optional(),\n      otherCosts: z.number().min(0).optional()\n    }),\n    interestRequested: z.boolean(),\n    interestRate: z.number().min(0).max(100).optional(),\n    interestFromDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()\n  }),\n\n  // Evidence\n  evidence: z.object({\n    documents: z.array(z.object({\n      type: z.string(),\n      description: z.string(),\n      dateCreated: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),\n      originalAvailable: z.boolean(),\n      relevance: z.string()\n    })).optional(),\n    photographs: z.array(z.object({\n      description: z.string(),\n      dateTaken: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),\n      relevance: z.string()\n    })).optional(),\n    physicalEvidence: z.array(z.object({\n      item: z.string(),\n      condition: z.string(),\n      location: z.string(),\n      relevance: z.string()\n    })).optional(),\n    electronicEvidence: z.array(z.object({\n      type: z.enum(['email', 'text', 'social_media', 'website', 'audio', 'video', 'other']),\n      description: z.string(),\n      dateCreated: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),\n      authenticated: z.boolean()\n    })).optional()\n  }),\n\n  // Witnesses\n  witnesses: z.array(z.object({\n    name: z.string().min(1, 'Witness name is required'),\n    relationship: z.string(),\n    address: z.string().optional(),\n    phone: z.string().regex(/^\\(\\d{3}\\) \\d{3}-\\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX').optional(),\n    email: z.string().email('Invalid email address').optional(),\n    relevantKnowledge: z.string().min(20, 'Please describe what the witness knows'),\n    willTestify: z.enum(['yes', 'no', 'unknown']),\n    statementObtained: z.boolean(),\n    credibility: z.enum(['excellent', 'good', 'fair', 'poor']).optional()\n  })).optional(),\n\n  // Court Preparation\n  courtPreparation: z.object({\n    courtName: z.string().optional(),\n    courtAddress: z.string().optional(),\n    judgeAssigned: z.string().optional(),\n    hearingDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),\n    hearingTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format').optional(),\n    estimatedDuration: z.string().optional(),\n    presentationOutline: z.string().optional(),\n    questionsForDefendant: z.array(z.string()).optional(),\n    anticipatedDefenses: z.array(z.string()).optional(),\n    responsesToDefenses: z.array(z.string()).optional()\n  }),\n\n  // Settlement Considerations\n  settlement: z.object({\n    willingToSettle: z.boolean(),\n    minimumAcceptable: z.number().min(0).optional(),\n    settlementTerms: z.string().optional(),\n    mediationConsidered: z.boolean(),\n    timelineForSettlement: z.string().optional(),\n    alternativeResolution: z.string().optional()\n  }),\n\n  // Service of Process\n  serviceOfProcess: z.object({\n    serviceMethod: z.enum(['personal_service', 'substituted_service', 'certified_mail', 'publication', 'other']).optional(),\n    serviceDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),\n    serverName: z.string().optional(),\n    serviceDetails: z.string().optional(),\n    proofOfService: z.boolean().optional()\n  }),\n\n  // Follow-up Actions\n  followUp: z.object({\n    judgmentObtained: z.boolean().optional(),\n    judgmentAmount: z.number().min(0).optional(),\n    collectionNeeded: z.boolean().optional(),\n    collectionMethods: z.array(z.string()).optional(),\n    appealConsidered: z.boolean().optional(),\n    lessonsLearned: z.string().optional()\n  })\n});\n\nexport type SmallClaimsWorksheet = z.infer<typeof smallClaimsWorksheetSchema>;"}]