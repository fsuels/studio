import { z } from 'zod';

export const forceMajeureNoticeSchema = z.object({
  // Party Information
  notifyingParty: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Party name is required'),
    title: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
    email: z.string().email('Invalid email address')
  }),

  receivingParty: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Receiving party name is required'),
    title: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    contactPerson: z.string().optional()
  }),

  // Contract Information
  contractInfo: z.object({
    contractTitle: z.string().min(1, 'Contract title is required'),
    contractDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    contractNumber: z.string().optional(),
    relevantSections: z.array(z.string()).optional(),
    forceMajeureClauseExists: z.boolean(),
    clauseText: z.string().optional(),
    noticeRequirements: z.object({
      timeframe: z.string().optional(),
      method: z.string().optional(),
      additionalRequirements: z.string().optional()
    })
  }),

  // Force Majeure Event
  event: z.object({
    eventType: z.enum([
      'natural_disaster',
      'pandemic',
      'government_action',
      'war_terrorism',
      'labor_strike',
      'supply_chain_disruption',
      'cyberattack',
      'infrastructure_failure',
      'other'
    ]),
    customEventType: z.string().optional(),
    eventDescription: z.string().min(100, 'Please provide detailed description (at least 100 characters)'),
    eventStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    eventLocation: z.string(),
    ongoingEvent: z.boolean(),
    estimatedEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    uncertainty: z.boolean(), // Whether end date is uncertain
    officialDeclarations: z.array(z.object({
      authority: z.string(),
      declarationType: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      relevance: z.string()
    })).optional()
  }),

  // Impact on Performance
  performanceImpact: z.object({
    affectedObligations: z.array(z.object({
      obligation: z.string(),
      impactType: z.enum(['complete_impossibility', 'partial_impossibility', 'significant_delay', 'increased_cost']),
      description: z.string(),
      timelineImpact: z.string().optional()
    })).min(1, 'Please specify at least one affected obligation'),
    
    unaffectedObligations: z.array(z.string()).optional(),
    
    causalConnection: z.string().min(50, 'Please explain how the event prevents performance'),
    
    foreseeability: z.object({
      unforeseeable: z.boolean(),
      explanation: z.string().optional()
    }),
    
    controlBeyondParty: z.object({
      beyondControl: z.boolean(),
      explanation: z.string().optional()
    })
  }),

  // Mitigation Efforts
  mitigation: z.object({
    effortsMade: z.array(z.object({
      effort: z.string(),
      dateImplemented: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
      result: z.string()
    })).optional(),
    
    ongoingEfforts: z.array(z.string()).optional(),
    plannedEfforts: z.array(z.object({
      effort: z.string(),
      plannedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
      expectedResult: z.string()
    })).optional(),
    
    alternativePerformance: z.object({
      available: z.boolean(),
      description: z.string().optional(),
      limitations: z.string().optional()
    }),
    
    costOfMitigation: z.object({
      significantCost: z.boolean(),
      explanation: z.string().optional()
    })
  }),

  // Performance Suspension/Modification
  performanceChanges: z.object({
    suspensionRequested: z.boolean(),
    suspensionScope: z.enum(['complete', 'partial']).optional(),
    specificSuspensions: z.array(z.string()).optional(),
    
    modificationRequested: z.boolean(),
    modificationDetails: z.array(z.object({
      originalObligation: z.string(),
      proposedModification: z.string(),
      justification: z.string()
    })).optional(),
    
    timeExtensionRequested: z.boolean(),
    extensionPeriod: z.string().optional(),
    
    suspensionEffectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
  }),

  // Notice Timing
  noticeDetails: z.object({
    noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    daysFromEvent: z.number().min(0),
    timelyNotice: z.boolean(),
    delayExplanation: z.string().optional(),
    
    discoveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    whenImpactRealized: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
  }),

  // Documentation and Evidence
  evidence: z.object({
    documentationAvailable: z.array(z.object({
      type: z.string(),
      description: z.string(),
      source: z.string().optional()
    })).optional(),
    
    mediaReports: z.boolean(),
    governmentNotices: z.boolean(),
    expertReports: z.boolean(),
    photographicEvidence: z.boolean(),
    
    thirdPartyConfirmation: z.array(z.object({
      party: z.string(),
      confirmation: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
    })).optional()
  }),

  // Financial Considerations
  financial: z.object({
    lossIncurred: z.boolean(),
    lossDescription: z.string().optional(),
    lossAmount: z.number().min(0).optional(),
    
    additionalCosts: z.boolean(),
    costDescription: z.string().optional(),
    costAmount: z.number().min(0).optional(),
    
    insuranceCoverage: z.object({
      applicableCoverage: z.boolean(),
      coverageType: z.string().optional(),
      claimFiled: z.boolean().optional(),
      coverageLimit: z.number().min(0).optional()
    }),
    
    compensationSought: z.boolean(),
    compensationDetails: z.string().optional()
  }),

  // Resumption of Performance
  resumption: z.object({
    intendToResume: z.boolean(),
    estimatedResumptionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    conditionsForResumption: z.array(z.string()).optional(),
    
    notificationCommitment: z.object({
      willNotifyWhenAble: z.boolean(),
      notificationTimeframe: z.string().optional(),
      progressUpdates: z.boolean()
    }),
    
    catchUpPlan: z.string().optional(),
    modifiedPerformance: z.string().optional()
  }),

  // Legal Reservations
  legalReservations: z.object({
    reserveAllRights: z.boolean().default(true),
    specificReservations: z.array(z.string()).optional(),
    noWaiverOfRights: z.boolean().default(true),
    rightToAdditionalRelief: z.boolean().default(true),
    rightToModifyNotice: z.boolean().default(true)
  }),

  // Communication and Follow-up
  communication: z.object({
    requestAcknowledgment: z.boolean(),
    requestDiscussion: z.boolean(),
    proposeMeeting: z.boolean(),
    meetingPurpose: z.string().optional(),
    
    ongoingCommunication: z.object({
      regularUpdates: z.boolean(),
      updateFrequency: z.enum(['weekly', 'biweekly', 'monthly', 'as_needed']).optional(),
      communicationMethod: z.enum(['email', 'phone', 'written', 'meetings']).optional()
    }),
    
    emergencyContact: z.object({
      available: z.boolean(),
      contactPerson: z.string().optional(),
      phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX').optional(),
      email: z.string().email('Invalid email address').optional()
    })
  })
});

export type ForceMajeureNotice = z.infer<typeof forceMajeureNoticeSchema>;