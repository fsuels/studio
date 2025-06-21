// src/lib/documents/us/mining-lease-agreement/schema.ts
import { z } from 'zod';

export const MiningLeaseAgreementSchema = z.object({
  // Lessor Information
  lessorName: z.string().min(1, 'Lessor name is required'),
  lessorAddress: z.string().optional(),
  lessorPhone: z.string().optional(),
  lessorEmail: z.string().email().optional(),
  lessorType: z
    .enum(['individual', 'corporation', 'government', 'trust'])
    .default('individual'),

  // Lessee Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeAddress: z.string().optional(),
  lesseePhone: z.string().optional(),
  lesseeEmail: z.string().email().optional(),
  lesseeType: z
    .enum(['individual', 'corporation', 'partnership', 'llc'])
    .default('corporation'),
  miningCompanyLicense: z.string().optional(),

  // Property Description
  propertyDescription: z.string().optional(),
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  acres: z.string().optional(),
  countyRecordNumber: z.string().optional(),
  surveyorReport: z.boolean().default(false),

  // Mineral Rights
  mineralTypes: z
    .array(
      z.enum([
        'coal',
        'oil',
        'gas',
        'gold',
        'silver',
        'copper',
        'iron',
        'limestone',
        'gravel',
        'sand',
        'other',
      ]),
    )
    .default(['coal']),
  subsurfaceRights: z.boolean().default(true),
  surfaceRights: z.boolean().default(false),
  waterRights: z.boolean().default(false),
  timberRights: z.boolean().default(false),
  exclusiveRights: z.boolean().default(true),

  // Lease Terms
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  leaseTerm: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  renewalTerm: z.string().optional(),
  renewalNotice: z.string().optional(),

  // Royalty and Payments
  royaltyRate: z.string().optional(),
  minimumRoyalty: z.string().optional(),
  bonusPayment: z.string().optional(),
  rentalPayment: z.string().optional(),
  paymentSchedule: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('quarterly'),
  royaltyCalculationMethod: z
    .enum(['gross-value', 'net-value', 'posted-price'])
    .default('gross-value'),

  // Production Requirements
  minimumProduction: z.string().optional(),
  developmentDeadline: z.string().optional(),
  continuousOperation: z.boolean().default(true),
  productionMaintenance: z.boolean().default(true),
  shutdownNotice: z.string().optional(),

  // Environmental Compliance
  environmentalPermits: z.boolean().default(true),
  reclamationPlan: z.boolean().default(true),
  bonding: z.boolean().default(true),
  bondAmount: z.string().optional(),
  waterProtection: z.boolean().default(true),
  airQualityCompliance: z.boolean().default(true),

  // Restoration and Reclamation
  landRestoration: z.boolean().default(true),
  topsoilPreservation: z.boolean().default(true),
  revegetation: z.boolean().default(true),
  gradeRestoration: z.boolean().default(true),
  reclamationBond: z.string().optional(),
  restorationTimeline: z.string().optional(),

  // Access Rights
  roadAccess: z.boolean().default(true),
  utilityAccess: z.boolean().default(true),
  equipmentAccess: z.boolean().default(true),
  accessLimitations: z.string().optional(),
  accessMaintenance: z.boolean().default(true),

  // Surface Use
  surfaceDisturbanc: z.string().optional(),
  buildingRights: z.boolean().default(true),
  storageFacilities: z.boolean().default(true),
  processingFacilities: z.boolean().default(false),
  wasteDisposal: z.string().optional(),

  // Safety Requirements
  safetyStandards: z.boolean().default(true),
  mshaCompliance: z.boolean().default(true),
  oshaCompliance: z.boolean().default(true),
  safetyTraining: z.boolean().default(true),
  emergencyPlan: z.boolean().default(true),
  accidentReporting: z.boolean().default(true),

  // Insurance Requirements
  generalLiability: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  workersCompensation: z.boolean().default(true),
  environmentalLiability: z.boolean().default(true),
  equipmentInsurance: z.boolean().default(true),
  namedInsured: z.boolean().default(true),

  // Regulatory Compliance
  federalPermits: z.boolean().default(true),
  statePermits: z.boolean().default(true),
  localPermits: z.boolean().default(true),
  miningPlan: z.boolean().default(true),
  regulatoryReporting: z.boolean().default(true),
  inspectionCompliance: z.boolean().default(true),

  // Operations Standards
  miningMethods: z.string().optional(),
  equipmentTypes: z.string().optional(),
  operatingHours: z.string().optional(),
  noiseRestrictions: z.boolean().default(true),
  dustControl: z.boolean().default(true),
  vibrationLimits: z.boolean().default(true),

  // Water Management
  waterDischarge: z.boolean().default(false),
  waterTreatment: z.boolean().default(true),
  sedimentControl: z.boolean().default(true),
  drainageMaintenance: z.boolean().default(true),
  waterQualityMonitoring: z.boolean().default(true),

  // Reporting Requirements
  productionReports: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('quarterly'),
  royaltyReports: z.boolean().default(true),
  environmentalReports: z.boolean().default(true),
  safetyReports: z.boolean().default(true),
  auditRights: z.boolean().default(true),

  // Assignment and Transfer
  assignmentRights: z.boolean().default(true),
  transferApproval: z.boolean().default(true),
  assignmentNotice: z.string().optional(),
  transferFee: z.string().optional(),
  creditworthinessReview: z.boolean().default(true),

  // Default and Remedies
  defaultNotice: z.string().optional(),
  cureperiod: z.string().optional(),
  terminationRights: z.boolean().default(true),
  damagesRecovery: z.boolean().default(true),
  equipmentRemoval: z.boolean().default(true),

  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  forceMajeureEvents: z.string().optional(),
  noticRequirements: z.string().optional(),
  suspensionOfObligations: z.boolean().default(true),

  // Taxes and Assessments
  propertyTaxes: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  severanceTaxes: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  specialAssessments: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  taxReimbursement: z.boolean().default(false),

  // Record Keeping
  recordMaintenance: z.boolean().default(true),
  auditTrail: z.boolean().default(true),
  documentRetention: z.string().optional(),
  electronicRecords: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Special Provisions
  communityAgreements: z.boolean().default(false),
  tribalConsultation: z.boolean().default(false),
  culturalSiteProtection: z.boolean().default(false),
  archaeologicalSurvey: z.boolean().default(false),
  specialConditions: z.string().optional(),

  // Signature Requirements
  lessorSignature: z.boolean().default(true),
  lesseeSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
