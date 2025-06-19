import { z } from 'zod';

export const breachContractNoticeSchema = z.object({
  // Party Information
  notifyingParty: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Notifying party name is required'),
    title: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
    email: z.string().email('Invalid email address')
  }),

  breachingParty: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Breaching party name is required'),
    title: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    contactPerson: z.string().optional(),
    alternateAddresses: z.array(z.string()).optional()
  }),

  // Contract Information
  contractDetails: z.object({
    contractTitle: z.string().min(1, 'Contract title is required'),
    contractDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    contractNumber: z.string().optional(),
    contractValue: z.number().min(0).optional(),
    relevantClauses: z.array(z.string()).optional(),
    amendmentsExist: z.boolean(),
    amendmentDetails: z.string().optional()
  }),

  // Breach Details
  breachDetails: z.object({
    breachType: z.enum([
      'non_payment',
      'failure_to_deliver',
      'defective_performance',
      'delay_in_performance',
      'failure_to_provide_services',
      'breach_of_warranty',
      'violation_of_terms',
      'anticipatory_breach',
      'other'
    ]),
    customBreachType: z.string().optional(),
    
    breachDescription: z.string().min(100, 'Please provide detailed description (at least 100 characters)'),
    
    specificViolations: z.array(z.object({
      clause: z.string(),
      violation: z.string(),
      dateOccurred: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
    })).min(1, 'Please specify at least one violation'),
    
    firstBreachDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    ongoingBreach: z.boolean(),
    materialBreach: z.boolean(),
    
    priorNotifications: z.object({
      previousNoticeGiven: z.boolean(),
      noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
      noticeMethod: z.string().optional(),
      response: z.string().optional()
    })
  }),

  // Impact and Damages
  impact: z.object({
    financialImpact: z.object({
      directDamages: z.number().min(0).optional(),
      indirectDamages: z.number().min(0).optional(),
      lostProfits: z.number().min(0).optional(),
      additionalCosts: z.number().min(0).optional(),
      damageCalculation: z.string().optional()
    }),
    
    operationalImpact: z.object({
      businessDisruption: z.boolean(),
      delayInOtherProjects: z.boolean(),
      reputationalHarm: z.boolean(),
      impactDescription: z.string().optional()
    }),
    
    mitigationEfforts: z.array(z.object({
      effort: z.string(),
      cost: z.number().min(0).optional(),
      effectiveness: z.string()
    })).optional(),
    
    thirdPartyImpact: z.object({
      affectsThirdParties: z.boolean(),
      thirdPartyDetails: z.string().optional(),
      thirdPartyClaims: z.boolean().optional()
    })
  }),

  // Demanded Remedies
  remedies: z.object({
    specificPerformance: z.object({
      demanded: z.boolean(),
      performanceDetails: z.string().optional(),
      performanceDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
    }),
    
    monetaryDamages: z.object({
      demanded: z.boolean(),
      amountDemanded: z.number().min(0).optional(),
      damageBreakdown: z.array(z.object({
        category: z.string(),
        amount: z.number().min(0),
        description: z.string()
      })).optional(),
      paymentDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
    }),
    
    contractModification: z.object({
      requested: z.boolean(),
      modificationDetails: z.string().optional(),
      revisedTerms: z.string().optional()
    }),
    
    otherRemedies: z.array(z.string()).optional(),
    
    alternativeDispute: z.object({
      mediationOffered: z.boolean(),
      arbitrationRequired: z.boolean(),
      negotiationPreferred: z.boolean()
    })
  }),

  // Cure Period
  curePeriod: z.object({
    cureOffered: z.boolean(),
    curePeriodDays: z.number().min(1).max(90).optional(),
    cureDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    cureRequirements: z.string().optional(),
    
    goodFaithEfforts: z.object({
      effortsRequired: z.boolean(),
      effortsDescription: z.string().optional(),
      progressReports: z.boolean()
    }),
    
    partialCure: z.object({
      acceptable: z.boolean(),
      conditions: z.string().optional()
    })
  }),

  // Legal Consequences
  consequences: z.object({
    contractTermination: z.object({
      threatened: z.boolean(),
      terminationConditions: z.string().optional(),
      effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
    }),
    
    legalAction: z.object({
      threatened: z.boolean(),
      specificActions: z.array(z.string()).optional(),
      jurisdiction: z.string().optional(),
      timeframe: z.string().optional()
    }),
    
    withholding: z.object({
      paymentWithholding: z.boolean(),
      performanceWithholding: z.boolean(),
      withholdingDetails: z.string().optional()
    }),
    
    setoff: z.object({
      setoffClaimed: z.boolean(),
      setoffAmount: z.number().min(0).optional(),
      setoffJustification: z.string().optional()
    }),
    
    accelerationClause: z.object({
      applicable: z.boolean(),
      acceleratedObligations: z.string().optional()
    })
  }),

  // Evidence and Documentation
  evidence: z.object({
    documentationAttached: z.boolean(),
    documentList: z.array(z.object({
      document: z.string(),
      description: z.string(),
      relevance: z.string()
    })).optional(),
    
    correspondence: z.object({
      relevantCorrespondence: z.boolean(),
      correspondenceDescription: z.string().optional()
    }),
    
    witnessEvidence: z.object({
      witnessesAvailable: z.boolean(),
      witnessDetails: z.string().optional()
    }),
    
    performanceRecords: z.object({
      recordsAvailable: z.boolean(),
      recordsDescription: z.string().optional()
    })
  }),

  // Notice Requirements
  noticeCompliance: z.object({
    contractNoticeClause: z.object({
      noticeClauseExists: z.boolean(),
      noticeRequirements: z.string().optional(),
      complianceConfirmed: z.boolean()
    }),
    
    deliveryMethod: z.enum(['certified_mail', 'personal_service', 'email', 'fax', 'multiple_methods']),
    deliveryAddress: z.string(),
    
    timing: z.object({
      promptNotice: z.boolean(),
      delayJustification: z.string().optional(),
      noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    })
  }),

  // Future Relationship
  futureRelationship: z.object({
    continuedRelationship: z.object({
      desired: z.boolean(),
      conditions: z.string().optional()
    }),
    
    preserveRights: z.object({
      reserveAllRights: z.boolean().default(true),
      specificReservations: z.array(z.string()).optional(),
      noWaiverStatement: z.boolean().default(true)
    }),
    
    confidentiality: z.object({
      requestConfidentiality: z.boolean(),
      confidentialityScope: z.string().optional()
    })
  }),

  // Communication
  communication: z.object({
    responseRequested: z.boolean(),
    responseDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    
    meetingRequested: z.boolean(),
    meetingPurpose: z.string().optional(),
    meetingTimeframe: z.string().optional(),
    
    ongoingCommunication: z.object({
      preferredMethod: z.enum(['email', 'phone', 'written', 'in_person']),
      contactPerson: z.string().optional(),
      emergencyContact: z.boolean()
    }),
    
    attorneyInvolvement: z.object({
      attorneyRepresented: z.boolean(),
      attorneyContactOnly: z.boolean(),
      attorneyName: z.string().optional(),
      attorneyContact: z.string().optional()
    })
  })
});

export type BreachContractNotice = z.infer<typeof breachContractNoticeSchema>;