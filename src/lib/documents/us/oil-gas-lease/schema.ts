// src/lib/documents/us/oil-gas-lease/schema.ts
import { z } from 'zod';

export const OilGasLeaseSchema = z.object({
  // Lessor Information
  lessorName: z.string().min(1, 'Lessor name is required'),
  lessorAddress: z.string().optional(),
  lessorPhone: z.string().optional(),
  lessorEmail: z.string().email().optional(),
  lessorOwnershipInterest: z.string().optional(),

  // Lessee Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeAddress: z.string().optional(),
  lesseePhone: z.string().optional(),
  lesseeEmail: z.string().email().optional(),
  operatorLicense: z.string().optional(),

  // Property Description
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  totalAcreage: z.string().optional(),
  netMineralAcres: z.string().optional(),
  depthLimitations: z.string().optional(),

  // Lease Terms
  primaryTerm: z.string().optional(),
  secondaryTerm: z.string().optional(),
  holdingClause: z.string().optional(),
  extensionRights: z.boolean().default(false),
  renewalOptions: z.string().optional(),

  // Financial Terms
  bonusPayment: z.string().optional(),
  delayRental: z.string().optional(),
  royaltyRate: z.string().optional(),
  minimumRoyalty: z.string().optional(),
  shutInRoyalty: z.string().optional(),

  // Drilling Obligations
  drillingCommitment: z.string().optional(),
  drillingDeadline: z.string().optional(),
  continuousDrilling: z.string().optional(),
  depthRequirements: z.string().optional(),
  testingObligations: z.string().optional(),

  // Production Terms
  unitization: z.boolean().default(false),
  poolingRights: z.boolean().default(false),
  forcePooling: z.boolean().default(false),
  drillingUnits: z.string().optional(),
  productionAllocations: z.string().optional(),

  // Royalty Payments
  royaltyCalculation: z.string().optional(),
  deductionsAllowed: z.string().optional(),
  gasProcessing: z.string().optional(),
  transportationCosts: z.string().optional(),
  marketingDeductions: z.string().optional(),

  // Surface Rights
  surfaceUse: z.string().optional(),
  surfaceDamage: z.string().optional(),
  roadwayRights: z.string().optional(),
  pipelineEasements: z.boolean().default(false),
  facilityConstruction: z.string().optional(),

  // Environmental Protection
  environmentalCompliance: z.boolean().default(true),
  waterProtection: z.string().optional(),
  airQualityRequirements: z.string().optional(),
  wasteDisposal: z.string().optional(),
  restorationRequirements: z.string().optional(),

  // Operations
  operatingHours: z.string().optional(),
  noiseRestrictions: z.string().optional(),
  lightingRestrictions: z.string().optional(),
  accessRestrictions: z.string().optional(),
  seasonalRestrictions: z.string().optional(),

  // Technology
  frackingRights: z.boolean().default(false),
  horizontalDrilling: z.boolean().default(false),
  enhancedRecovery: z.boolean().default(false),
  waterSourcing: z.string().optional(),
  wasteWaterDisposal: z.string().optional(),

  // Assignment Rights
  assignmentRights: z.boolean().default(true),
  assignmentApproval: z.boolean().default(false),
  operatorQualifications: z.string().optional(),
  depthSeverance: z.boolean().default(false),

  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  suspensionOfOperations: z.string().optional(),
  temporaryCessation: z.string().optional(),
  governmentRegulations: z.boolean().default(true),

  // Termination
  terminationEvents: z.string().optional(),
  cessationOfProduction: z.string().optional(),
  economicLimit: z.string().optional(),
  pluggingObligations: z.string().optional(),

  // Reporting
  productionReporting: z.boolean().default(true),
  royaltyStatements: z.boolean().default(true),
  operationsReports: z.boolean().default(false),
  auditRights: z.boolean().default(true),

  // Insurance and Bonding
  generalLiability: z.string().optional(),
  operatorsInsurance: z.string().optional(),
  bondingRequirements: z.string().optional(),
  environmentalLiability: z.string().optional(),

  // Government Relations
  permitResponsibility: z.enum(['lessor', 'lessee']).default('lessee'),
  regulatoryCompliance: z.boolean().default(true),
  taxObligations: z.string().optional(),
  severanceTax: z.enum(['lessor', 'lessee']).default('lessee'),

  // Special Provisions
  waterRights: z.string().optional(),
  coalbedMethane: z.boolean().default(false),
  carbonSequestration: z.boolean().default(false),
  renewableEnergy: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'court'])
    .default('arbitration'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  expertsConsultation: z.boolean().default(true),

  // Signature Requirements
  requireLessorSignature: z.boolean().default(true),
  requireLesseeSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(true),
  notarizationRequired: z.boolean().default(true),
  electronicSignatureAccepted: z.boolean().default(false),
});
