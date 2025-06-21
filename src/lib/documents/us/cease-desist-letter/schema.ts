import { z } from 'zod';

export const ceaseDesistLetterSchema = z.object({
  // Sender Information
  sender: z.object({
    type: z.enum(['individual', 'business', 'attorney']),
    name: z.string().min(1, 'Sender name is required'),
    title: z.string().optional(),
    businessName: z.string().optional(),
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
    barNumber: z.string().optional(), // For attorneys
  }),

  // Recipient Information
  recipient: z.object({
    type: z.enum(['individual', 'business', 'unknown']),
    name: z.string().min(1, 'Recipient name is required'),
    businessName: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    alternateAddresses: z.array(z.string()).optional(),
  }),

  // Violation Details
  violation: z.object({
    type: z.enum([
      'trademark_infringement',
      'copyright_infringement',
      'patent_infringement',
      'harassment',
      'defamation',
      'breach_of_contract',
      'unfair_competition',
      'trade_secret_theft',
      'privacy_invasion',
      'debt_collection_abuse',
      'other',
    ]),
    customType: z.string().optional(),
    description: z
      .string()
      .min(
        100,
        'Please provide a detailed description (at least 100 characters)',
      ),
    specificActivities: z
      .array(z.string())
      .min(1, 'Please list at least one specific activity'),
    dateFirstOccurred: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
    ongoingViolation: z.boolean(),
    frequency: z
      .enum(['daily', 'weekly', 'monthly', 'sporadic', 'one_time'])
      .optional(),
  }),

  // Legal Basis
  legalBasis: z.object({
    federalLaws: z.array(z.string()).optional(),
    stateLaws: z.array(z.string()).optional(),
    contractualRights: z.string().optional(),
    intellectualPropertyRights: z
      .array(
        z.object({
          type: z.enum(['trademark', 'copyright', 'patent', 'trade_secret']),
          registrationNumber: z.string().optional(),
          description: z.string(),
        }),
      )
      .optional(),
    commonLawRights: z.string().optional(),
  }),

  // Evidence
  evidence: z.object({
    documentsAvailable: z.boolean(),
    photographsAvailable: z.boolean(),
    witnessesAvailable: z.boolean(),
    electronicEvidence: z.boolean(),
    evidenceDescription: z.string().optional(),
    attachmentsIncluded: z.array(z.string()).optional(),
  }),

  // Demands
  demands: z.object({
    immediateActions: z
      .array(z.string())
      .min(1, 'Please specify at least one immediate action required'),
    permanentActions: z.array(z.string()).optional(),
    monetaryDemands: z.object({
      damagesRequested: z.boolean(),
      damageAmount: z.number().min(0).optional(),
      restitutionRequested: z.boolean(),
      restitutionAmount: z.number().min(0).optional(),
      legalFeesRequested: z.boolean(),
    }),
    returnOfProperty: z.array(z.string()).optional(),
    destructionOfMaterials: z.array(z.string()).optional(),
    acknowledgmentRequired: z.boolean(),
  }),

  // Timeline
  timeline: z.object({
    complianceDeadline: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    businessDaysAllowed: z.number().min(1).max(90),
    gracePeriodOffered: z.boolean(),
    gracePeriodDays: z.number().min(0).max(30).optional(),
  }),

  // Consequences
  consequences: z.object({
    legalActionThreatened: z.boolean(),
    specificLegalActions: z.array(z.string()).optional(),
    injunctiveReliefMentioned: z.boolean(),
    monetaryDamagesMentioned: z.boolean(),
    criminalReferralMentioned: z.boolean(),
    regulatoryComplaintMentioned: z.boolean(),
    publicDisclosureThreatened: z.boolean(),
    otherConsequences: z.array(z.string()).optional(),
  }),

  // Communication Preferences
  communication: z.object({
    responseRequired: z.boolean(),
    responseDeadline: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
    preferredContactMethod: z.enum(['email', 'phone', 'mail', 'attorney_only']),
    noDirectContactRequested: z.boolean(),
    representationDisclosure: z.boolean(), // If recipient should only contact through attorney
  }),

  // Delivery Information
  delivery: z.object({
    deliveryMethod: z.enum([
      'certified_mail',
      'personal_service',
      'email',
      'multiple_methods',
    ]),
    trackingNumbers: z.array(z.string()).optional(),
    deliveryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
    witnessesToDelivery: z.array(z.string()).optional(),
  }),

  // Additional Terms
  additionalTerms: z.object({
    reservationOfRights: z.boolean().default(true),
    noWaiverClause: z.boolean().default(true),
    governingLaw: z.string(),
    confidentialityRequest: z.boolean(),
    publicationRestriction: z.boolean(),
    customClauses: z.array(z.string()).optional(),
  }),
});

export type CeaseDesistLetter = z.infer<typeof ceaseDesistLetterSchema>;
