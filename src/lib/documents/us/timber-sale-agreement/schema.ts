// src/lib/documents/us/timber-sale-agreement/schema.ts
import { z } from 'zod';

export const TimberSaleAgreementSchema = z.object({
  // Landowner Information
  landownerName: z.string().min(1, 'Landowner name is required'),
  landownerAddress: z.string().optional(),
  landownerPhone: z.string().optional(),
  landownerEmail: z.string().email().optional(),
  landownerType: z.enum(['individual', 'corporation', 'partnership', 'trust']).default('individual'),
  
  // Buyer Information
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerAddress: z.string().optional(),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),
  loggingLicense: z.string().optional(),
  businessLicense: z.string().optional(),
  
  // Property Description
  propertyDescription: z.string().optional(),
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  acres: z.string().optional(),
  timberAcres: z.string().optional(),
  accessDescription: z.string().optional(),
  
  // Timber Description
  timberTypes: z.array(z.enum(['pine', 'oak', 'maple', 'cedar', 'fir', 'poplar', 'walnut', 'cherry', 'ash', 'hickory', 'mixed-hardwood', 'mixed-softwood'])).default(['pine']),
  estimatedVolume: z.string().optional(),
  volumeUnit: z.enum(['board-feet', 'cords', 'tons', 'cubic-feet']).default('board-feet'),
  diameterLimits: z.string().optional(),
  heightRequirements: z.string().optional(),
  qualityGrades: z.string().optional(),
  
  // Sale Terms
  saleType: z.enum(['lump-sum', 'per-unit', 'percentage']).default('lump-sum'),
  totalSalePrice: z.string().optional(),
  unitPrice: z.string().optional(),
  percentageRate: z.string().optional(),
  paymentSchedule: z.enum(['upfront', 'installments', 'upon-delivery', 'completion']).default('installments'),
  
  // Payment Terms
  downPayment: z.string().optional(),
  balancePayment: z.string().optional(),
  paymentDueDates: z.string().optional(),
  lateFee: z.string().optional(),
  performanceBond: z.string().optional(),
  securityDeposit: z.string().optional(),
  
  // Harvesting Period
  harvestStartDate: z.string().optional(),
  harvestEndDate: z.string().optional(),
  harvestingPeriod: z.string().optional(),
  weatherDelays: z.boolean().default(true),
  seasonalRestrictions: z.string().optional(),
  
  // Harvesting Methods
  harvestingMethod: z.enum(['selective-cutting', 'clear-cutting', 'shelterwood', 'seed-tree']).optional(),
  cuttingStandards: z.string().optional(),
  treemarking: z.boolean().default(true),
  stumpHeight: z.string().optional(),
  minimumDiameter: z.string().optional(),
  
  // Environmental Protection
  soilProtection: z.boolean().default(true),
  waterProtection: z.boolean().default(true),
  streamBuffers: z.string().optional(),
  wetlandProtection: z.boolean().default(true),
  wildlifeProtection: z.boolean().default(true),
  seedTreeRetention: z.boolean().default(false),
  
  // Logging Roads and Access
  roadConstruction: z.boolean().default(true),
  roadMaintenance: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  roadReclamation: z.boolean().default(true),
  gateReplacement: z.boolean().default(true),
  bridgeRequirements: z.string().optional(),
  accessLimitations: z.string().optional(),
  
  // Equipment and Operations
  equipmentTypes: z.string().optional(),
  operatingHours: z.string().optional(),
  noiseRestrictions: z.boolean().default(true),
  firePreventionPlan: z.boolean().default(true),
  smokingProhibition: z.boolean().default(true),
  fueltransport: z.boolean().default(true),
  
  // Safety Requirements
  safetyPlan: z.boolean().default(true),
  oshaCompliance: z.boolean().default(true),
  safetyTraining: z.boolean().default(true),
  emergencyContact: z.string().optional(),
  firstAidRequirements: z.boolean().default(true),
  accidentReporting: z.boolean().default(true),
  
  // Insurance Requirements
  generalLiability: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  workersCompensation: z.boolean().default(true),
  propertyDamage: z.boolean().default(true),
  automobileInsurance: z.boolean().default(true),
  additionalInsured: z.boolean().default(true),
  
  // Compliance Requirements
  forestPracticesAct: z.boolean().default(true),
  stateRegulations: z.boolean().default(true),
  localOrdinances: z.boolean().default(true),
  permitsRequired: z.boolean().default(true),
  bestManagementPractices: z.boolean().default(true),
  
  // Scaling and Measurement
  scalingMethod: z.enum(['log-scale', 'weight-scale', 'load-count']).default('log-scale'),
  scalingLocation: z.enum(['woods', 'mill', 'landing']).default('landing'),
  scalingRules: z.string().optional(),
  logGrading: z.boolean().default(true),
  settlementPeriod: z.string().optional(),
  
  // Cleanup and Restoration
  slashDisposal: z.enum(['buyer', 'seller', 'none']).default('buyer'),
  debrisRemoval: z.boolean().default(true),
  roadCleanup: z.boolean().default(true),
  seedingRequirement: z.boolean().default(false),
  restorationPlan: z.string().optional(),
  finalInspection: z.boolean().default(true),
  
  // Title and Ownership
  timberOwnership: z.boolean().default(true),
  titleWarranty: z.boolean().default(true),
  encumbranceDisclosure: z.boolean().default(true),
  rightToSell: z.boolean().default(true),
  boundaryLines: z.boolean().default(true),
  
  // Risk and Liability
  damageToTrees: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  propertyDamageRisk: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  thirdPartyLiability: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  fireRisk: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  weatherRisk: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  
  // Reserved Rights
  reservedTrees: z.string().optional(),
  recreationalRights: z.boolean().default(true),
  huntingRights: z.boolean().default(true),
  mineralRights: z.boolean().default(true),
  futureCuttingRights: z.boolean().default(true),
  
  // Breach and Default
  defaultDefinition: z.string().optional(),
  noticeRequirement: z.string().optional(),
  cureperiod: z.string().optional(),
  liquidatedDamages: z.string().optional(),
  rightToComplete: z.boolean().default(true),
  
  // Assignment and Transfer
  assignmentRights: z.boolean().default(true),
  transferApproval: z.boolean().default(true),
  subcontractorRights: z.boolean().default(true),
  transferNotice: z.string().optional(),
  creditworthiness: z.boolean().default(true),
  
  // Notices and Communication
  noticeMethod: z.enum(['mail', 'email', 'hand-delivery']).default('mail'),
  noticAddress: z.string().optional(),
  emergencyContact: z.string().optional(),
  propertyContact: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(true),
  
  // Special Provisions
  certificationRequirements: z.string().optional(),
  sustainablePractices: z.boolean().default(false),
  thirdPartyCertification: z.boolean().default(false),
  carbonCredits: z.boolean().default(false),
  specialConditions: z.string().optional(),
  
  // Signature Requirements
  landownerSignature: z.boolean().default(true),
  buyerSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});