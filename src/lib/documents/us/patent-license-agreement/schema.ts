// src/lib/documents/us/patent-license-agreement/schema.ts
import { z } from 'zod';

export const PatentLicenseAgreementSchema = z.object({
  // Licensor Information (Patent Owner)
  licensorName: z.string().min(1, 'Licensor name is required'),
  licensorAddress: z.string().min(1, 'Licensor address is required'),
  licensorType: z.enum([
    'individual',
    'corporation',
    'partnership',
    'llc',
    'other',
  ]),

  // Licensee Information
  licenseeName: z.string().min(1, 'Licensee name is required'),
  licenseeAddress: z.string().min(1, 'Licensee address is required'),
  licenseeType: z.enum([
    'individual',
    'corporation',
    'partnership',
    'llc',
    'other',
  ]),

  // Agreement Details
  licenseDate: z.string().min(1, 'License date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),

  // Patent Information
  patentTitle: z.string().min(1, 'Patent title is required'),
  patentNumber: z.string().optional(),
  applicationNumber: z.string().optional(),
  filingDate: z.string().optional(),
  issuanceDate: z.string().optional(),
  inventorNames: z.array(z.string()).default([]),

  // Multiple Patents
  includeMultiplePatents: z.boolean().default(false),
  additionalPatents: z
    .array(
      z.object({
        title: z.string(),
        number: z.string().optional(),
        applicationNumber: z.string().optional(),
      }),
    )
    .default([]),

  // License Grant
  licenseType: z.enum(['exclusive', 'non-exclusive', 'sole', 'co-exclusive']),
  licenseScope: z.enum([
    'make',
    'use',
    'sell',
    'make-use',
    'make-sell',
    'use-sell',
    'make-use-sell',
    'import',
    'full-rights',
  ]),

  // Field of Use
  hasFieldOfUse: z.boolean().default(false),
  fieldOfUseDescription: z.string().optional(),
  excludedFields: z.array(z.string()).default([]),

  // Territory
  territoryScope: z.enum([
    'worldwide',
    'united-states',
    'specific-countries',
    'specific-regions',
  ]),
  specificTerritory: z.string().optional(),

  // Term and Duration
  termType: z.enum(['life-of-patent', 'fixed-term', 'renewable', 'at-will']),
  termLength: z.string().optional(),
  renewalTerms: z.string().optional(),
  expirationDate: z.string().optional(),

  // Royalties and Financial Terms
  hasRoyalties: z.boolean().default(true),
  royaltyStructure: z
    .enum(['running-royalty', 'lump-sum', 'milestone', 'hybrid'])
    .optional(),
  royaltyRate: z.string().optional(),
  minimumRoyalty: z.string().optional(),
  upfrontPayment: z.string().optional(),

  // Milestone Payments
  hasMilestones: z.boolean().default(false),
  milestonePayments: z
    .array(
      z.object({
        milestone: z.string(),
        amount: z.string(),
        dueDate: z.string().optional(),
      }),
    )
    .default([]),

  // Payment Terms
  paymentFrequency: z
    .enum(['monthly', 'quarterly', 'annually', 'upon-sale'])
    .optional(),
  paymentDueDate: z.string().optional(),
  reportingRequirements: z.boolean().default(true),
  auditRights: z.boolean().default(true),

  // Patent Prosecution and Maintenance
  prosecutionResponsibility: z
    .enum(['licensor', 'licensee', 'shared'])
    .default('licensor'),
  maintenanceResponsibility: z
    .enum(['licensor', 'licensee', 'shared'])
    .default('licensor'),
  prosecutionCosts: z
    .enum(['licensor-pays', 'licensee-pays', 'shared'])
    .default('licensor-pays'),

  // Improvements and Developments
  improvementRights: z
    .enum(['none', 'licensor-owns', 'licensee-owns', 'shared', 'grant-back'])
    .default('none'),
  grantBackProvision: z.boolean().default(false),
  grantBackTerms: z.string().optional(),

  // Technology Transfer
  includeKnowHow: z.boolean().default(false),
  technicalDocumentation: z.boolean().default(false),
  trainingProvided: z.boolean().default(false),
  ongoingSupport: z.boolean().default(false),

  // Manufacturing and Quality
  manufacturingStandards: z.boolean().default(false),
  qualityControlRequirements: z.string().optional(),
  inspectionRights: z.boolean().default(false),

  // Sales and Distribution
  minimumSalesRequirements: z.string().optional(),
  distributionRestrictions: z.string().optional(),
  exportRestrictions: z.boolean().default(false),

  // Sublicensing
  sublicensingAllowed: z.boolean().default(false),
  sublicenseApproval: z.boolean().default(true),
  sublicenseRoyalty: z.string().optional(),

  // Assignment and Transfer
  assignmentAllowed: z.boolean().default(false),
  assignmentConditions: z.string().optional(),
  changeOfControl: z.boolean().default(true),

  // Patent Enforcement
  enforcementRights: z
    .enum(['licensor-only', 'licensee-only', 'both', 'cooperation'])
    .default('licensor-only'),
  infringementNotification: z.boolean().default(true),
  cooperationInEnforcement: z.boolean().default(true),
  enforcementCosts: z
    .enum(['licensor-pays', 'licensee-pays', 'shared', 'recoverer-pays'])
    .default('licensor-pays'),

  // Invalidity and Non-infringement
  invalidityChallenge: z
    .enum(['prohibited', 'allowed', 'terminates-license'])
    .default('allowed'),
  noninfringementRights: z.boolean().default(true),

  // Confidentiality
  confidentialityRequirements: z.boolean().default(true),
  confidentialityTerm: z.string().optional(),

  // Warranties and Representations
  patentValidityWarranty: z.boolean().default(false),
  nonInfringementWarranty: z.boolean().default(false),
  enablementWarranty: z.boolean().default(false),
  authorityWarranty: z.boolean().default(true),

  // Indemnification
  licensorIndemnifies: z.boolean().default(false),
  licenseeIndemnifies: z.boolean().default(true),
  mutualIndemnification: z.boolean().default(false),

  // Termination
  terminationForCause: z.boolean().default(true),
  terminationRights: z.array(z.string()).default([]),
  terminationNotice: z.string().optional(),
  curePeriod: z.string().optional(),

  // Post-Termination
  survivalClauses: z.boolean().default(true),
  postTerminationUse: z.boolean().default(false),
  selloffPeriod: z.string().optional(),
  returnOfMaterials: z.boolean().default(true),

  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Export Control
  exportControlCompliance: z.boolean().default(true),
  exportLicenseRequirements: z.string().optional(),

  // Recordation
  recordWithPTO: z.boolean().default(false),
  recordingResponsibility: z
    .enum(['licensor', 'licensee', 'both'])
    .default('licensee'),

  // Signatures
  requireLicensorSignature: z.boolean().default(true),
  requireLicenseeSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
});
