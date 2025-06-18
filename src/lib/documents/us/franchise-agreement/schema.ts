// src/lib/documents/us/franchise-agreement/schema.ts
import { z } from 'zod';

export const FranchiseAgreementSchema = z.object({
  // Franchisor Information
  franchisorName: z.string().min(1, 'Franchisor name is required'),
  franchisorAddress: z.string().optional(),
  franchisorPhone: z.string().optional(),
  franchisorEmail: z.string().email().optional(),
  franchisorCorporateStructure: z.enum(['corporation', 'llc', 'partnership']).default('corporation'),
  
  // Franchisee Information
  franchiseeName: z.string().min(1, 'Franchisee name is required'),
  franchiseeAddress: z.string().optional(),
  franchiseePhone: z.string().optional(),
  franchiseeEmail: z.string().email().optional(),
  franchiseeBusinessEntity: z.enum(['corporation', 'llc', 'partnership', 'sole-proprietorship']).default('corporation'),
  
  // Franchise Business Information
  franchiseBrandName: z.string().min(1, 'Franchise brand name is required'),
  businessType: z.string().optional(),
  industryType: z.enum(['food-service', 'retail', 'automotive', 'health-fitness', 'education', 'service', 'other']).default('food-service'),
  territoryDescription: z.string().optional(),
  exclusiveTerritory: z.boolean().default(true),
  
  // Financial Terms
  initialFranchiseFee: z.string().optional(),
  ongoingRoyaltyFee: z.string().optional(),
  royaltyFeePercentage: z.string().optional(),
  advertisingFee: z.string().optional(),
  advertisingFeePercentage: z.string().optional(),
  technologyFee: z.string().optional(),
  
  // Investment Requirements
  totalInvestmentMin: z.string().optional(),
  totalInvestmentMax: z.string().optional(),
  liquidCapitalRequired: z.string().optional(),
  netWorthRequired: z.string().optional(),
  financingOptions: z.boolean().default(false),
  
  // Location and Real Estate
  locationApprovalRequired: z.boolean().default(true),
  realEstateRequirements: z.string().optional(),
  leaseRequirements: z.string().optional(),
  buildOutRequirements: z.string().optional(),
  signageRequirements: z.string().optional(),
  
  // Training and Support
  initialTrainingRequired: z.boolean().default(true),
  trainingDuration: z.string().optional(),
  trainingLocation: z.string().optional(),
  ongoingTraining: z.boolean().default(true),
  operationalSupport: z.string().optional(),
  marketingSupport: z.string().optional(),
  
  // Operations Standards
  hoursOfOperation: z.string().optional(),
  operatingStandards: z.string().optional(),
  qualityStandards: z.string().optional(),
  customerServiceStandards: z.string().optional(),
  uniformsRequired: z.boolean().default(false),
  
  // Products and Services
  approvedProducts: z.string().optional(),
  requiredSuppliers: z.string().optional(),
  exclusiveSuppliers: z.boolean().default(false),
  newProductApproval: z.boolean().default(true),
  pricingControl: z.enum(['franchisor', 'franchisee', 'guidelines']).default('guidelines'),
  
  // Marketing and Advertising
  nationalAdvertising: z.boolean().default(true),
  localAdvertisingRequirements: z.string().optional(),
  cooperativeAdvertising: z.boolean().default(false),
  grandOpeningSupport: z.boolean().default(true),
  digitalMarketingSupport: z.boolean().default(true),
  
  // Technology Requirements
  posSystemRequired: z.boolean().default(true),
  specificSoftware: z.string().optional(),
  technologyUpdates: z.boolean().default(true),
  onlineOrderingSystem: z.boolean().default(false),
  loyaltyProgram: z.boolean().default(false),
  
  // Intellectual Property
  trademarkUsage: z.boolean().default(true),
  trademarkProtection: z.string().optional(),
  proprietaryInformation: z.boolean().default(true),
  tradesecrets: z.boolean().default(true),
  copyrightMaterials: z.boolean().default(true),
  
  // Insurance Requirements
  generalLiabilityInsurance: z.string().optional(),
  propertyInsurance: z.string().optional(),
  workersCompensation: z.boolean().default(true),
  businessInterruption: z.boolean().default(false),
  keyPersonInsurance: z.boolean().default(false),
  
  // Term and Renewal
  initialTerm: z.string().optional(),
  renewalOptions: z.boolean().default(true),
  renewalTerms: z.string().optional(),
  renewalFee: z.string().optional(),
  renewalRequirements: z.string().optional(),
  
  // Performance Standards
  salesTargets: z.string().optional(),
  performanceMetrics: z.string().optional(),
  minimumStandards: z.string().optional(),
  improvementPlans: z.boolean().default(true),
  performanceReviews: z.string().optional(),
  
  // Restrictions and Obligations
  nonCompeteClause: z.boolean().default(true),
  nonCompetePeriod: z.string().optional(),
  nonCompeteRadius: z.string().optional(),
  nonDisclosure: z.boolean().default(true),
  personalGuarantee: z.boolean().default(true),
  
  // Transfer and Assignment
  transferRights: z.boolean().default(false),
  transferApproval: z.boolean().default(true),
  transferFee: z.string().optional(),
  rightOfFirstRefusal: z.boolean().default(true),
  inheritanceRights: z.boolean().default(false),
  
  // Termination
  terminationRights: z.string().optional(),
  terminationNotice: z.string().optional(),
  materialBreach: z.string().optional(),
  curePerod: z.string().optional(),
  postTerminationObligations: z.string().optional(),
  
  // Multi-Unit Development
  multiUnitRights: z.boolean().default(false),
  developmentSchedule: z.string().optional(),
  additionalFees: z.string().optional(),
  territoryProtection: z.boolean().default(true),
  masterFranchiseRights: z.boolean().default(false),
  
  // Reporting Requirements
  financialReporting: z.string().optional(),
  salesReporting: z.string().optional(),
  inventoryReporting: z.boolean().default(false),
  auditRights: z.boolean().default(true),
  recordKeeping: z.string().optional(),
  
  // Legal and Compliance
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('arbitration'),
  regulatoryCompliance: z.boolean().default(true),
  
  // Special Provisions
  exclusivityClauses: z.string().optional(),
  competitorRestrictions: z.string().optional(),
  modificationRights: z.string().optional(),
  forceMajeure: z.boolean().default(true),
  severabilityClause: z.boolean().default(true),
  
  // Signature Requirements
  requireFranchisorSignature: z.boolean().default(true),
  requireFranchiseeSignature: z.boolean().default(true),
  requireGuarantorSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});