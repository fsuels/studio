// src/lib/documents/us/payment-bond/schema.ts
import { z } from 'zod';

export const paymentbondSchema = z.object({
  // Bond Information
  bondNumber: z.string().min(1, 'Bond number is required'),
  bondDate: z.string().min(1, 'Bond date is required'),
  bondAmount: z.string().min(1, 'Bond amount is required'),
  bondAmountWords: z.string().min(1, 'Bond amount in words is required'),

  // Principal (Contractor) Information
  principalName: z.string().min(1, 'Principal name is required'),
  principalAddress: z.string().min(1, 'Principal address is required'),
  principalPhone: z.string().optional(),
  principalEmail: z.string().email().optional(),
  principalLicense: z.string().optional(),

  // Obligee (Owner/Beneficiary) Information
  obligeeName: z.string().min(1, 'Obligee name is required'),
  obligeeAddress: z.string().min(1, 'Obligee address is required'),
  obligeePhone: z.string().optional(),
  obligeeEmail: z.string().email().optional(),

  // Surety Company Information
  suretyName: z.string().min(1, 'Surety company name is required'),
  suretyAddress: z.string().min(1, 'Surety company address is required'),
  suretyLicense: z.string().optional(),
  suretyAMBestRating: z.string().optional(),

  // Construction Contract Information
  contractDate: z.string().min(1, 'Contract date is required'),
  contractAmount: z.string().min(1, 'Contract amount is required'),
  contractDescription: z.string().min(1, 'Contract description is required'),

  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().optional(),
  projectType: z.enum([
    'residential',
    'commercial',
    'industrial',
    'public',
    'private',
    'other',
  ]),

  // Bond Terms and Conditions
  bondEffectiveDate: z.string().min(1, 'Bond effective date is required'),
  bondExpirationDate: z.string().optional(),
  bondTermination: z.enum([
    'project-completion',
    'specific-date',
    'payment-completion',
    'other',
  ]),

  // Coverage Details
  coverageScope: z
    .array(
      z.enum([
        'labor-costs',
        'material-costs',
        'equipment-costs',
        'subcontractor-payments',
        'supplier-payments',
        'other-costs',
      ]),
    )
    .min(1, 'At least one coverage type is required'),

  // Claim Procedures
  claimNotificationPeriod: z.string().optional(),
  claimProcedure: z.string().optional(),
  claimDocumentation: z.array(z.string()).default([]),

  // Payment Protection Coverage
  laborProtection: z.boolean().default(true),
  materialProtection: z.boolean().default(true),
  equipmentProtection: z.boolean().default(false),
  subcontractorProtection: z.boolean().default(true),
  supplierProtection: z.boolean().default(true),

  // Covered Parties
  coveredParties: z
    .array(
      z.object({
        partyType: z.enum([
          'subcontractor',
          'supplier',
          'laborer',
          'materialman',
          'other',
        ]),
        partyName: z.string(),
        partyAddress: z.string(),
        contractAmount: z.string().optional(),
      }),
    )
    .default([]),

  // Exclusions
  exclusions: z.array(z.string()).default([]),
  generalExclusions: z.boolean().default(true),
  designExclusions: z.boolean().default(true),
  environmentalExclusions: z.boolean().default(false),

  // Bond Conditions
  bondConditions: z.array(z.string()).default([]),
  principalObligations: z.array(z.string()).default([]),
  suretyObligations: z.array(z.string()).default([]),

  // Performance Requirements
  paymentTerms: z.string().optional(),
  retainageHandling: z.string().optional(),
  progressPaymentRequirements: z.string().optional(),

  // Statutory Requirements
  millerActCompliance: z.boolean().default(false),
  littleMillerActCompliance: z.boolean().default(false),
  stateStatuteCompliance: z.boolean().default(true),
  localOrdinanceCompliance: z.boolean().default(false),

  // Notice Requirements
  noticeToSurety: z.boolean().default(true),
  noticeToPrincipal: z.boolean().default(true),
  noticeToObligee: z.boolean().default(false),
  noticeMethod: z
    .enum(['certified-mail', 'registered-mail', 'personal-service', 'email'])
    .optional(),

  // Joint Venture Provisions
  jointVenture: z.boolean().default(false),
  jointVenturePartners: z
    .array(
      z.object({
        partnerName: z.string(),
        partnerAddress: z.string(),
        partnerPercentage: z.string(),
      }),
    )
    .default([]),

  // Assignment and Transfer
  bondAssignable: z.boolean().default(false),
  assignmentConditions: z.string().optional(),
  transferRestrictions: z.string().optional(),

  // Modification and Amendment
  modificationRights: z.boolean().default(false),
  amendmentProcedure: z.string().optional(),
  consentToChanges: z.boolean().default(true),

  // Default and Remedies
  defaultConditions: z.array(z.string()).default([]),
  suretyRemedies: z.array(z.string()).default([]),
  obligeeRemedies: z.array(z.string()).default([]),

  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Additional Provisions
  additionalProvisions: z.array(z.string()).default([]),
  specialConditions: z.string().optional(),

  // Attachments and Exhibits
  contractAttached: z.boolean().default(true),
  plansAttached: z.boolean().default(false),
  specificationsAttached: z.boolean().default(false),

  // Certifications
  principalCertification: z.boolean().default(true),
  suretyCertification: z.boolean().default(true),
  notaryAcknowledgment: z.boolean().default(true),

  // Signatures
  principalSignature: z.boolean().default(true),
  principalSignatureDate: z.string().optional(),
  suretySignature: z.boolean().default(true),
  suretySignatureDate: z.string().optional(),
  obligeeSignature: z.boolean().default(false),
  attorneyInFactSignature: z.boolean().default(false),

  // Notarization
  requireNotarization: z.boolean().default(true),
  notaryState: z.string().optional(),
  notaryCounty: z.string().optional(),
  notaryCommissionExpiration: z.string().optional(),
});
