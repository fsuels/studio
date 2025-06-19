// src/lib/documents/us/water-rights-agreement/schema.ts
import { z } from 'zod';

export const WaterRightsAgreementSchema = z.object({
  // Water Rights Owner Information
  ownerName: z.string().min(1, 'Water rights owner name is required'),
  ownerAddress: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerType: z.enum(['individual', 'corporation', 'municipality', 'irrigation-district']).default('individual'),
  
  // Water Rights User Information
  userName: z.string().min(1, 'Water user name is required'),
  userAddress: z.string().optional(),
  userPhone: z.string().optional(),
  userEmail: z.string().email().optional(),
  userType: z.enum(['individual', 'corporation', 'agricultural', 'municipal', 'industrial']).default('individual'),
  
  // Water Right Details
  waterRightNumber: z.string().optional(),
  priorityDate: z.string().optional(),
  waterSource: z.enum(['surface', 'groundwater', 'spring', 'well', 'river', 'lake']).optional(),
  sourceDescription: z.string().optional(),
  pointOfDiversion: z.string().optional(),
  placeOfUse: z.string().optional(),
  
  // Water Quantity
  annualQuantity: z.string().optional(),
  maxInstantaneousRate: z.string().optional(),
  seasonalLimitations: z.string().optional(),
  measurementUnit: z.enum(['acre-feet', 'gallons', 'cubic-feet', 'liters']).default('acre-feet'),
  dryYearAdjustments: z.boolean().default(false),
  
  // Agreement Type
  agreementType: z.enum(['sale', 'lease', 'transfer', 'exchange', 'sharing']).default('lease'),
  permanentTransfer: z.boolean().default(false),
  temporaryTransfer: z.boolean().default(true),
  partialRights: z.boolean().default(false),
  fullRights: z.boolean().default(false),
  
  // Terms and Duration
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  agreementTerm: z.string().optional(),
  renewalOptions: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  
  // Usage Restrictions
  authorizedUses: z.array(z.enum(['irrigation', 'municipal', 'industrial', 'domestic', 'livestock', 'recreation', 'environmental'])).default(['irrigation']),
  useRestrictions: z.string().optional(),
  seasonalUse: z.boolean().default(false),
  useSeasons: z.string().optional(),
  nonUseForfeiture: z.boolean().default(true),
  
  // Payment Terms
  purchasePrice: z.string().optional(),
  leasePayment: z.string().optional(),
  paymentSchedule: z.enum(['annually', 'semi-annually', 'quarterly', 'monthly', 'lump-sum']).default('annually'),
  paymentDueDate: z.string().optional(),
  securityDeposit: z.string().optional(),
  priceAdjustments: z.boolean().default(false),
  
  // Water Quality
  qualityStandards: z.string().optional(),
  qualityTesting: z.boolean().default(true),
  testingFrequency: z.enum(['monthly', 'quarterly', 'annually']).default('annually'),
  contaminationLiability: z.enum(['owner', 'user', 'shared']).default('user'),
  treatmentRequirements: z.string().optional(),
  
  // Delivery and Infrastructure
  deliveryMethod: z.enum(['canal', 'pipeline', 'ditch', 'natural-flow', 'pumping']).optional(),
  deliveryPoint: z.string().optional(),
  infrastructureMaintenance: z.enum(['owner', 'user', 'shared']).default('user'),
  conveyanceLosses: z.enum(['owner', 'user', 'shared']).default('user'),
  measurementDevices: z.boolean().default(true),
  
  // Environmental Considerations
  environmentalCompliance: z.boolean().default(true),
  endangered Species: z.boolean().default(false),
  instreamFlows: z.boolean().default(false),
  environmentalMitigation: z.string().optional(),
  returnFlowRequirements: z.boolean().default(false),
  
  // Regulatory Compliance
  stateWaterBoard: z.boolean().default(true),
  changeApplicationRequired: z.boolean().default(true),
  permitTransfer: z.boolean().default(true),
  regulatoryApproval: z.boolean().default(true),
  reportingRequirements: z.boolean().default(true),
  
  // Conservation Requirements
  conservationPlan: z.boolean().default(false),
  efficiencyStandards: z.string().optional(),
  wastePrevention: z.boolean().default(true),
  recyclingRequirements: z.boolean().default(false),
  droughtRestrictions: z.boolean().default(true),
  
  // Shortage and Curtailment
  shortageAllocation: z.enum(['proportional', 'priority', 'negotiated']).default('priority'),
  curtailmentRights: z.boolean().default(true),
  droughtProvisions: z.string().optional(),
  alternativeSupplies: z.boolean().default(false),
  emergencyProvisions: z.string().optional(),
  
  // Assignment and Transfer
  assignmentRights: z.boolean().default(true),
  transferApproval: z.boolean().default(true),
  transferNotice: z.string().optional(),
  preemptiveRights: z.boolean().default(false),
  assignmentFees: z.string().optional(),
  
  // Default and Remedies
  defaultNotice: z.string().optional(),
  curePeriod: z.string().optional(),
  remediesAvailable: z.string().optional(),
  waterDeliveryDefault: z.boolean().default(true),
  paymentDefault: z.boolean().default(true),
  
  // Insurance and Bonding
  liabilityInsurance: z.boolean().default(true),
  insuranceAmount: z.string().optional(),
  performanceBond: z.boolean().default(false),
  bondAmount: z.string().optional(),
  additionalInsured: z.boolean().default(true),
  
  // Monitoring and Reporting
  usageMonitoring: z.boolean().default(true),
  waterMeters: z.boolean().default(true),
  monthlyReports: z.boolean().default(true),
  annualReports: z.boolean().default(true),
  auditRights: z.boolean().default(true),
  
  // Special Conditions
  seniorRights: z.boolean().default(false),
  juniorRights: z.boolean().default(false),
  interconnectedRights: z.boolean().default(false),
  conjunctiveUse: z.boolean().default(false),
  specialConditions: z.string().optional(),
  
  // Termination
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  postTerminationObligations: z.string().optional(),
  rightRestoration: z.boolean().default(true),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'water-court']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Third Party Rights
  thirdPartyRights: z.boolean().default(false),
  downstreamUsers: z.boolean().default(false),
  neighboringRights: z.boolean().default(false),
  protectedRights: z.string().optional(),
  
  // Climate Change Provisions
  climateAdaptation: z.boolean().default(false),
  variabilityProvisions: z.string().optional(),
  flexibilityMeasures: z.boolean().default(false),
  contingencyPlans: z.boolean().default(false),
  
  // Signature Requirements
  ownerSignature: z.boolean().default(true),
  userSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});