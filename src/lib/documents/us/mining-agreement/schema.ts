// src/lib/documents/us/mining-agreement/schema.ts
import { z } from 'zod';

export const MiningAgreementSchema = z.object({
  // Lessor Information
  lessorName: z.string().min(1, 'Lessor name is required'),
  lessorAddress: z.string().optional(),
  lessorPhone: z.string().optional(),
  lessorEmail: z.string().email().optional(),
  
  // Lessee/Mining Company Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeAddress: z.string().optional(),
  lesseePhone: z.string().optional(),
  lesseeEmail: z.string().email().optional(),
  miningLicense: z.string().optional(),
  
  // Property Description
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  totalAcreage: z.string().optional(),
  mineralRights: z.string().optional(),
  surfaceRights: z.enum(['included', 'excluded', 'limited']).default('limited'),
  
  // Minerals Covered
  mineralsIncluded: z.string().optional(),
  oilAndGas: z.boolean().default(false),
  coalMining: z.boolean().default(false),
  metalMining: z.boolean().default(false),
  sandAndGravel: z.boolean().default(false),
  
  // Financial Terms
  upfrontPayment: z.string().optional(),
  royaltyPercentage: z.string().optional(),
  minimumRoyalty: z.string().optional(),
  bonusPayment: z.string().optional(),
  delaydRental: z.string().optional(),
  
  // Lease Duration
  primaryTerm: z.string().optional(),
  extensionOptions: z.boolean().default(false),
  extensionTerms: z.string().optional(),
  continuationClause: z.string().optional(),
  
  // Exploration Rights
  explorationPeriod: z.string().optional(),
  explorationMethods: z.string().optional(),
  drillingRights: z.boolean().default(false),
  samplingRights: z.boolean().default(false),
  accessRights: z.string().optional(),
  
  // Environmental Compliance
  environmentalAssessment: z.boolean().default(true),
  permitRequirements: z.string().optional(),
  waterRights: z.string().optional(),
  airQualityCompliance: z.boolean().default(true),
  wasteManagement: z.string().optional(),
  
  // Restoration Requirements
  landRestoration: z.boolean().default(true),
  restorationBond: z.string().optional(),
  restorationStandards: z.string().optional(),
  timeframeForRestoration: z.string().optional(),
  revegetationRequirements: z.string().optional(),
  
  // Operating Conditions
  operatingHours: z.string().optional(),
  noiseRestrictions: z.string().optional(),
  dustControl: z.string().optional(),
  blastingRestrictions: z.string().optional(),
  accessRoads: z.string().optional(),
  
  // Safety Requirements
  safetyPlan: z.boolean().default(true),
  mineShaftSafety: z.string().optional(),
  emergencyProcedures: z.string().optional(),
  workerSafety: z.boolean().default(true),
  
  // Insurance and Bonding
  generalLiability: z.string().optional(),
  environmentalLiability: z.string().optional(),
  restorationBond: z.string().optional(),
  workersCompensation: z.boolean().default(true),
  
  // Reporting Requirements
  productionReports: z.boolean().default(true),
  royaltyReports: z.boolean().default(true),
  environmentalReports: z.boolean().default(true),
  auditRights: z.boolean().default(true),
  
  // Termination Conditions
  defaultConditions: z.string().optional(),
  remedyPeriod: z.string().optional(),
  forfeiture: z.string().optional(),
  terminationProcedures: z.string().optional(),
  
  // Water Rights
  waterUse: z.boolean().default(false),
  waterSource: z.string().optional(),
  waterTreatment: z.string().optional(),
  drainageRights: z.string().optional(),
  
  // Surface Use
  surfaceAccess: z.string().optional(),
  surfaceDamagePayments: z.boolean().default(false),
  cropDamageCompensation: z.boolean().default(false),
  fencingRequirements: z.string().optional(),
  
  // Government Relations
  permitAssistance: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  regulatoryCompliance: z.boolean().default(true),
  taxResponsibility: z.enum(['lessor', 'lessee', 'shared']).default('lessee'),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'court']).default('arbitration'),
  expertsConsultation: z.boolean().default(true),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Assignment Rights
  assignmentRights: z.boolean().default(false),
  assignmentApproval: z.boolean().default(true),
  assignmentFee: z.string().optional(),
  operatorChanges: z.boolean().default(false),
  
  // Special Provisions
  forceMajeure: z.boolean().default(true),
  warAndSanctions: z.boolean().default(true),
  marketConditions: z.string().optional(),
  technologyRequirements: z.string().optional(),
  
  // Signature Requirements
  requireLessorSignature: z.boolean().default(true),
  requireLesseeSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(true),
  electronicSignatureAccepted: z.boolean().default(false),
});