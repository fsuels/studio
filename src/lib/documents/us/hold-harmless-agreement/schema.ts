import { z } from 'zod';

export const holdHarmlessAgreementSchema = z.object({
  // Indemnitor Information (Party being protected)
  indemnitee: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Indemnitee name is required'),
    businessName: z.string().optional(),
    address: z.string().min(1, 'Indemnitee address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    email: z.string().email('Invalid email address').optional(),
    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        'Phone must be in format (XXX) XXX-XXXX',
      )
      .optional(),
  }),

  // Indemnitor Information (Party assuming risk)
  indemnitor: z.object({
    type: z.enum(['individual', 'business']),
    name: z.string().min(1, 'Indemnitor name is required'),
    businessName: z.string().optional(),
    address: z.string().min(1, 'Indemnitor address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    email: z.string().email('Invalid email address').optional(),
    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        'Phone must be in format (XXX) XXX-XXXX',
      )
      .optional(),
  }),

  // Agreement Details
  agreementType: z.enum(['unilateral', 'mutual']),
  effectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  // Activity/Situation Description
  activityDescription: z
    .string()
    .min(50, 'Please provide a detailed description (at least 50 characters)'),
  location: z.string().optional(),
  duration: z.object({
    type: z.enum(['oneTime', 'ongoing', 'specific']),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
  }),

  // Scope of Protection
  scopeOfProtection: z.object({
    propertyDamage: z.boolean(),
    personalInjury: z.boolean(),
    financialLoss: z.boolean(),
    intellectualProperty: z.boolean(),
    other: z.string().optional(),
  }),

  // Specific Risks
  specificRisks: z
    .array(z.string())
    .min(1, 'Please identify at least one specific risk'),

  // Exclusions
  exclusions: z.object({
    grossNegligence: z.boolean().default(true),
    intentionalMisconduct: z.boolean().default(true),
    criminalActs: z.boolean().default(true),
    other: z.array(z.string()).optional(),
  }),

  // Insurance Requirements
  insuranceRequired: z.boolean(),
  insuranceDetails: z
    .object({
      minimumCoverage: z.number().positive().optional(),
      insuranceType: z.string().optional(),
      additionalInsured: z.boolean().optional(),
    })
    .optional(),

  // Additional Provisions
  additionalProvisions: z.object({
    defendDutyIncluded: z.boolean(),
    attorneyFeesIncluded: z.boolean(),
    survivalClause: z.boolean(),
    severabilityClause: z.boolean(),
  }),

  // Governing Law
  governingState: z.string().min(2, 'Governing state is required'),
  disputeResolution: z.enum(['litigation', 'arbitration', 'mediation']),

  // Signatures
  signatures: z.object({
    indemnitorSignature: z.string().optional(),
    indemnitorDate: z.string().optional(),
    indemniteeSignature: z.string().optional(),
    indemniteeDate: z.string().optional(),
  }),
});

export type HoldHarmlessAgreement = z.infer<typeof holdHarmlessAgreementSchema>;
