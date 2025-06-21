// src/lib/documents/us/oil-gas-lease-agreement/schema.ts
import { z } from 'zod';

export const OilGasLeaseAgreementSchema = z.object({
  // Lessor Information
  lessorName: z.string().min(1, 'Lessor name is required'),
  lessorAddress: z.string().optional(),
  lessorPhone: z.string().optional(),
  lessorEmail: z.string().email().optional(),
  lessorType: z
    .enum(['individual', 'corporation', 'trust', 'estate'])
    .default('individual'),

  // Lessee Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeAddress: z.string().optional(),
  lesseePhone: z.string().optional(),
  lesseeEmail: z.string().email().optional(),
  operatorLicense: z.string().optional(),
  bonding: z.string().optional(),

  // Property Description
  propertyDescription: z.string().optional(),
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  acres: z.string().optional(),
  section: z.string().optional(),
  township: z.string().optional(),
  range: z.string().optional(),

  // Lease Terms
  leaseStartDate: z.string().optional(),
  primaryTerm: z.string().optional(),
  secondaryTerm: z.string().optional(),
  automaticExtension: z.boolean().default(true),
  habendumClause: z.string().optional(),

  // Drilling and Development
  drillingObligation: z.boolean().default(true),
  drillingCommitment: z.string().optional(),
  developmentDeadline: z.string().optional(),
  continuousDrilling: z.boolean().default(false),
  depthClause: z.string().optional(),
  horizontalClause: z.boolean().default(true),

  // Royalty Payments
  royaltyRate: z.string().optional(),
  oilRoyalty: z.string().optional(),
  gasRoyalty: z.string().optional(),
  liquidRoyalty: z.string().optional(),
  royaltyBase: z.enum(['gross', 'net', 'wellhead']).default('gross'),
  deductions: z
    .enum(['none', 'post-production', 'transportation'])
    .default('none'),

  // Bonus and Rental Payments
  bonusPayment: z.string().optional(),
  delayRental: z.string().optional(),
  rentalPaymentDate: z.string().optional(),
  shutinRoyalty: z.string().optional(),
  minimumRoyalty: z.string().optional(),

  // Substances Covered
  oil: z.boolean().default(true),
  gas: z.boolean().default(true),
  naturalGasLiquids: z.boolean().default(true),
  condensate: z.boolean().default(true),
  hydrocarbon: z.boolean().default(true),
  otherSubstances: z.string().optional(),

  // Surface Rights
  surfaceUse: z.boolean().default(true),
  surfaceDamage: z.string().optional(),
  surfaceAccess: z.boolean().default(true),
  roadways: z.boolean().default(true),
  pipelines: z.boolean().default(true),
  facilities: z.boolean().default(true),

  // Environmental Protection
  environmentalCompliance: z.boolean().default(true),
  spillPrevention: z.boolean().default(true),
  restoration: z.boolean().default(true),
  reclamation: z.boolean().default(true),
  bondingRequirement: z.string().optional(),

  // Water Rights
  waterUse: z.boolean().default(true),
  waterSource: z.string().optional(),
  waterDisposal: z.boolean().default(true),
  saltWaterDisposal: z.boolean().default(true),
  waterProtection: z.boolean().default(true),

  // Unitization and Pooling
  unitization: z.boolean().default(true),
  pooling: z.boolean().default(true),
  spacingUnits: z.string().optional(),
  nonparticipation: z.boolean().default(false),
  forcePooling: z.boolean().default(false),

  // Assignment and Transfer
  assignmentRights: z.boolean().default(true),
  transferNotice: z.string().optional(),
  preferentialRights: z.boolean().default(false),
  rightOfFirstRefusal: z.boolean().default(false),
  overridingRoyalty: z.boolean().default(true),

  // Operations and Production
  operationStandards: z.string().optional(),
  productionMethods: z.string().optional(),
  enhancedRecovery: z.boolean().default(true),
  artificialLift: z.boolean().default(true),
  workoverRights: z.boolean().default(true),
  abandonmentRights: z.boolean().default(true),

  // Marketing and Transportation
  gasMarketingRights: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  takeOrPay: z.boolean().default(false),
  transportation: z.boolean().default(true),
  gatheringSystems: z.boolean().default(true),
  dedicationClause: z.boolean().default(false),

  // Regulatory Compliance
  stateRegulations: z.boolean().default(true),
  federalRegulations: z.boolean().default(true),
  localOrdinances: z.boolean().default(true),
  permitsRequired: z.boolean().default(true),
  reportingRequirements: z.boolean().default(true),

  // Accounting and Auditing
  accountingProcedures: z.string().optional(),
  auditRights: z.boolean().default(true),
  recordKeeping: z.boolean().default(true),
  jointAccountin: z.boolean().default(true),
  costSharing: z.string().optional(),

  // Default and Termination
  defaultClauses: z.string().optional(),
  terminationRights: z.boolean().default(true),
  cessation: z.string().optional(),
  abandonment: z.string().optional(),
  equipmentRemoval: z.boolean().default(true),

  // Insurance Requirements
  generalLiability: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  controlOfWell: z.boolean().default(true),
  environmentalLiability: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),
  namedInsured: z.boolean().default(true),

  // Special Clauses
  forcePooled: z.boolean().default(false),
  nonConsent: z.boolean().default(false),
  deepRights: z.boolean().default(false),
  shallowRights: z.boolean().default(false),
  lateralClause: z.string().optional(),

  // Measurement and Delivery
  measurementPoint: z.string().optional(),
  deliveryPoint: z.string().optional(),
  qualitySpecifications: z.string().optional(),
  shrinkageAllowance: z.string().optional(),
  btуAdjustment: z.boolean().default(true),

  // Taxes and Burdens
  severanceTax: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  adValoremTax: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  productionTax: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  windfallProfitTax: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),

  // Rights of Way
  easements: z.boolean().default(true),
  accessRoads: z.boolean().default(true),
  utilityLines: z.boolean().default(true),
  compressorSites: z.boolean().default(true),
  pipelineEasements: z.boolean().default(true),

  // Notice Requirements
  defaultNotice: z.string().optional(),
  operationsNotice: z.string().optional(),
  assignmentNotice: z.string().optional(),
  addressChange: z.boolean().default(true),
  certifiedMail: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('arbitration'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Special Provisions
  communityBenefits: z.boolean().default(false),
  localHiring: z.boolean().default(false),
  roadMaintenance: z.boolean().default(true),
  emergencyResponse: z.boolean().default(true),
  specialConditions: z.string().optional(),

  // Signature Requirements
  lessorSignature: z.boolean().default(true),
  lesseeSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
