import { z } from 'zod';

export const liabilityWaiverSchema = z.object({
  // Organization Information
  organization: z.object({
    name: z.string().min(1, 'Organization name is required'),
    type: z.enum(['business', 'nonprofit', 'government', 'individual']),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        'Phone must be in format (XXX) XXX-XXXX',
      ),
    email: z.string().email('Invalid email address'),
    website: z.string().url('Invalid URL').optional(),
  }),

  // Activity Information
  activity: z.object({
    name: z.string().min(1, 'Activity name is required'),
    type: z.enum([
      'sports',
      'fitness',
      'adventure',
      'educational',
      'entertainment',
      'medical',
      'other',
    ]),
    description: z
      .string()
      .min(
        50,
        'Please provide a detailed description (at least 50 characters)',
      ),
    location: z.string().min(1, 'Activity location is required'),
    frequency: z.enum(['oneTime', 'recurring', 'membership']),
    dates: z
      .object({
        startDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
          .optional(),
        endDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
          .optional(),
      })
      .optional(),
  }),

  // Participant Information Requirements
  participantInfo: z.object({
    requireFullName: z.boolean().default(true),
    requireDateOfBirth: z.boolean().default(true),
    requireAddress: z.boolean().default(true),
    requirePhone: z.boolean().default(true),
    requireEmail: z.boolean().default(true),
    requireEmergencyContact: z.boolean().default(true),
    requireMedicalInfo: z.boolean(),
    customFields: z
      .array(
        z.object({
          fieldName: z.string(),
          fieldType: z.enum(['text', 'number', 'boolean', 'date']),
          required: z.boolean(),
        }),
      )
      .optional(),
  }),

  // Risks and Hazards
  risks: z.object({
    generalRisks: z
      .array(z.string())
      .min(1, 'Please identify at least one risk'),
    specificHazards: z.array(z.string()).optional(),
    physicalRequirements: z.string().optional(),
    equipmentRisks: z.array(z.string()).optional(),
    environmentalRisks: z.array(z.string()).optional(),
  }),

  // Medical Considerations
  medical: z.object({
    requireMedicalDisclosure: z.boolean(),
    requirePhysicianClearance: z.boolean(),
    firstAidAvailable: z.boolean(),
    medicalPersonnelOnSite: z.boolean(),
    nearestHospital: z.string().optional(),
    emergencyProcedures: z.string().optional(),
  }),

  // Waiver Clauses
  waiverClauses: z.object({
    assumptionOfRisk: z.boolean().default(true),
    releaseOfLiability: z.boolean().default(true),
    indemnificationClause: z.boolean().default(true),
    medicalTreatmentAuth: z.boolean().default(true),
    photoVideoRelease: z.boolean(),
    equipmentResponsibility: z.boolean(),
    rulesAcknowledgment: z.boolean().default(true),
  }),

  // Photo/Video Release
  photoRelease: z
    .object({
      allowPhotography: z.boolean(),
      allowVideoRecording: z.boolean(),
      allowMarketing: z.boolean(),
      allowSocialMedia: z.boolean(),
      requireConsent: z.boolean(),
    })
    .optional(),

  // Minor Provisions
  minorProvisions: z.object({
    allowMinors: z.boolean(),
    minimumAge: z.number().min(0).max(21).optional(),
    parentalConsentRequired: z.boolean().default(true),
    additionalMinorClauses: z.string().optional(),
  }),

  // Insurance Information
  insurance: z.object({
    participantInsuranceRequired: z.boolean(),
    organizationInsured: z.boolean(),
    insuranceCarrier: z.string().optional(),
    policyNumber: z.string().optional(),
    coverageAmount: z.number().positive().optional(),
  }),

  // Additional Terms
  additionalTerms: z.object({
    cancellationPolicy: z.string().optional(),
    refundPolicy: z.string().optional(),
    weatherPolicy: z.string().optional(),
    equipmentRequirements: z.string().optional(),
    behaviorExpectations: z.string().optional(),
    customTerms: z.string().optional(),
  }),

  // Legal Provisions
  legalProvisions: z.object({
    governingState: z.string().min(2, 'Governing state is required'),
    severabilityClause: z.boolean().default(true),
    entireAgreement: z.boolean().default(true),
    venueJurisdiction: z.string(),
  }),

  // Signature Requirements
  signatureRequirements: z.object({
    participantSignature: z.boolean().default(true),
    witnessRequired: z.boolean(),
    notarizationRequired: z.boolean(),
    electronicSignatureAccepted: z.boolean().default(true),
    parentSignatureForMinors: z.boolean().default(true),
  }),
});

export type LiabilityWaiver = z.infer<typeof liabilityWaiverSchema>;
