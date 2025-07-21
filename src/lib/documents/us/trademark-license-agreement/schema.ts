// src/lib/documents/us/trademark-license-agreement/schema.ts
import { z } from 'zod';

export const TrademarkLicenseAgreementSchema = z.object({
  // Licensor Information (Trademark Owner)
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

  // Trademark Information
  trademarkName: z.string().min(1, 'Trademark name is required'),
  trademarkDescription: z.string().min(1, 'Trademark description is required'),
  registrationNumber: z.string().optional(),
  registrationDate: z.string().optional(),
  trademarkClass: z.string().optional(),

  // License Grant
  licenseType: z.enum(['exclusive', 'non-exclusive', 'sole']),
  licenseScope: z.enum([
    'full-rights',
    'limited-use',
    'specific-products',
    'specific-services',
  ]),

  // Territory
  territoryScope: z.enum([
    'worldwide',
    'united-states',
    'specific-states',
    'specific-countries',
    'specific-regions',
  ]),
  specificTerritory: z.string().optional(),

  // Term and Duration
  termType: z.enum(['perpetual', 'fixed-term', 'renewable', 'at-will']),
  termLength: z.string().optional(),
  renewalTerms: z.string().optional(),
  expirationDate: z.string().optional(),

  // Licensed Products/Services
  authorizedProducts: z.array(z.string()).default([]),
  authorizedServices: z.array(z.string()).default([]),
  prohibitedUses: z.array(z.string()).default([]),

  // Royalties and Fees
  hasRoyalties: z.boolean().default(true),
  royaltyType: z
    .enum(['percentage', 'flat-fee', 'minimum-guarantee', 'tiered'])
    .optional(),
  royaltyRate: z.string().optional(),
  minimumRoyalty: z.string().optional(),
  upfrontFee: z.string().optional(),

  // Payment Terms
  paymentFrequency: z
    .enum(['monthly', 'quarterly', 'annually', 'upon-sale'])
    .optional(),
  paymentDueDate: z.string().optional(),
  reportingRequirements: z.boolean().default(true),

  // Quality Control
  qualityStandards: z.boolean().default(true),
  qualityControlDescription: z.string().optional(),
  inspectionRights: z.boolean().default(true),
  approvalRequired: z.boolean().default(true),

  // Advertising and Marketing
  advertisingApproval: z.boolean().default(true),
  marketingGuidelines: z.boolean().default(true),
  brandingRequirements: z.string().optional(),
  promotionalRestrictions: z.string().optional(),

  // Manufacturing and Distribution
  manufacturingStandards: z.boolean().default(false),
  distributionRestrictions: z.string().optional(),
  minimumSalesRequirements: z.string().optional(),
  exclusiveDistribution: z.boolean().default(false),

  // Intellectual Property Protection
  trademarkRegistration: z.boolean().default(true),
  enforcementObligations: z.boolean().default(true),
  infringementNotification: z.boolean().default(true),
  cooperationInEnforcement: z.boolean().default(true),

  // Licensee Obligations
  goodFaithEfforts: z.boolean().default(true),
  noCompetingMarks: z.boolean().default(true),
  protectGoodwill: z.boolean().default(true),
  noticeOfInfringement: z.boolean().default(true),

  // Licensor Obligations
  trademarkMaintenance: z.boolean().default(true),
  defenseOfRights: z.boolean().default(true),
  assistanceToLicensee: z.boolean().default(false),

  // Sublicensing
  sublicensingAllowed: z.boolean().default(false),
  sublicenseApproval: z.boolean().default(true),
  sublicenseTerms: z.string().optional(),

  // Assignment and Transfer
  assignmentAllowed: z.boolean().default(false),
  assignmentConditions: z.string().optional(),
  changeOfControl: z.boolean().default(true),

  // Termination
  terminationForCause: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  curePeriod: z.string().optional(),
  postTerminationUse: z.boolean().default(false),

  // Post-Termination Obligations
  discontinueUse: z.boolean().default(true),
  returnMaterials: z.boolean().default(true),
  destroyInventory: z.boolean().default(false),
  selloffPeriod: z.string().optional(),

  // Indemnification
  licenseeIndemnifies: z.boolean().default(true),
  licensorIndemnifies: z.boolean().default(false),
  mutualIndemnification: z.boolean().default(false),

  // Insurance
  requireInsurance: z.boolean().default(false),
  insuranceAmount: z.string().optional(),
  additionalInsured: z.boolean().default(false),

  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Recordation
  recordWithTrademark: z.boolean().default(false),
  recordingResponsibility: z
    .enum(['licensor', 'licensee', 'both'])
    .default('licensee'),

  // Signatures
  requireLicensorSignature: z.boolean().default(true),
  requireLicenseeSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
});
