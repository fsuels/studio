// src/lib/documents/us/restaurant-agreement/schema.ts
import { z } from 'zod';

export const RestaurantAgreementSchema = z.object({
  // Primary Party Information
  primaryPartyName: z.string().min(1, 'Primary party name is required'),
  primaryPartyAddress: z.string().optional(),
  primaryPartyPhone: z.string().optional(),
  primaryPartyEmail: z.string().email().optional(),
  primaryPartyRole: z
    .enum(['owner', 'partner', 'manager', 'investor', 'franchisee'])
    .default('owner'),

  // Secondary Party Information
  secondaryPartyName: z.string().min(1, 'Secondary party name is required'),
  secondaryPartyAddress: z.string().optional(),
  secondaryPartyPhone: z.string().optional(),
  secondaryPartyEmail: z.string().email().optional(),
  secondaryPartyRole: z
    .enum(['owner', 'partner', 'manager', 'investor', 'franchisee'])
    .default('partner'),

  // Agreement Type
  agreementType: z
    .enum([
      'partnership',
      'management',
      'franchise',
      'lease',
      'supplier',
      'employment',
    ])
    .default('partnership'),
  agreementDescription: z.string().optional(),

  // Restaurant Information
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  restaurantAddress: z.string().optional(),
  restaurantType: z
    .enum([
      'fast-food',
      'casual-dining',
      'fine-dining',
      'cafe',
      'bar',
      'food-truck',
      'other',
    ])
    .default('casual-dining'),
  cuisineType: z.string().optional(),
  seatingCapacity: z.string().optional(),

  // Business Structure
  businessEntity: z
    .enum(['llc', 'corporation', 'partnership', 'sole-proprietorship'])
    .default('llc'),
  businessRegistration: z.string().optional(),
  taxIdNumber: z.string().optional(),
  businessLicense: z.string().optional(),

  // Financial Terms
  totalInvestment: z.string().optional(),
  initialCapital: z.string().optional(),
  ownershipPercentage: z.string().optional(),
  profitSharing: z.string().optional(),
  lossSharing: z.string().optional(),
  drawSchedule: z.string().optional(),

  // Management Responsibilities
  operationalManagement: z.string().optional(),
  financialManagement: z.string().optional(),
  staffManagement: z.string().optional(),
  marketingManagement: z.string().optional(),
  maintenanceResponsibility: z.string().optional(),

  // Operating Terms
  operatingHours: z.string().optional(),
  seasonalOperations: z.boolean().default(false),
  closedDays: z.string().optional(),
  holidaySchedule: z.string().optional(),

  // Menu and Pricing
  menuControl: z
    .enum(['joint', 'primary-party', 'secondary-party', 'chef'])
    .default('joint'),
  pricingControl: z
    .enum(['joint', 'primary-party', 'secondary-party', 'manager'])
    .default('joint'),
  menuChangeApproval: z.boolean().default(true),
  specialMenuItems: z.string().optional(),

  // Staffing
  staffingResponsibility: z
    .enum(['joint', 'primary-party', 'secondary-party', 'manager'])
    .default('joint'),
  minimumStaffLevels: z.string().optional(),
  managementHiring: z.boolean().default(true),
  staffTrainingRequirements: z.string().optional(),

  // Supplier Relationships
  supplierSelection: z
    .enum(['joint', 'primary-party', 'secondary-party', 'manager'])
    .default('joint'),
  foodCostTargets: z.string().optional(),
  inventoryManagement: z.string().optional(),
  qualityStandards: z.string().optional(),

  // Marketing and Branding
  brandingControl: z
    .enum(['joint', 'primary-party', 'secondary-party'])
    .default('joint'),
  marketingBudget: z.string().optional(),
  advertisingStrategy: z.string().optional(),
  socialMediaManagement: z.string().optional(),
  promotionalActivities: z.string().optional(),

  // Financial Management
  bankingArrangements: z.string().optional(),
  expenseApprovalLimits: z.string().optional(),
  accountingProcedures: z.string().optional(),
  financialReporting: z.string().optional(),
  auditingRequirements: z.boolean().default(false),

  // Insurance and Licenses
  generalLiability: z.boolean().default(true),
  propertyInsurance: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),
  liquorLicense: z.boolean().default(false),
  healthPermits: z.boolean().default(true),

  // Quality Control
  healthSafetyStandards: z.string().optional(),
  foodSafetyProtocols: z.string().optional(),
  cleanlinessStandards: z.string().optional(),
  customerServiceStandards: z.string().optional(),
  qualityAssurance: z.string().optional(),

  // Term and Duration
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  agreementTerm: z.string().optional(),
  renewalOptions: z.boolean().default(false),
  renewalTerms: z.string().optional(),

  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  buyoutProvisions: z.string().optional(),
  assetDistribution: z.string().optional(),
  nonCompeteClause: z.boolean().default(false),

  // Dispute Resolution
  disputeResolutionMethod: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),
  mediationProcedures: z.string().optional(),
  governingLaw: z.string().optional(),

  // Intellectual Property
  trademarkOwnership: z
    .enum(['joint', 'primary-party', 'secondary-party'])
    .default('joint'),
  recipeOwnership: z
    .enum(['joint', 'primary-party', 'secondary-party', 'chef'])
    .default('joint'),
  brandProtection: z.boolean().default(true),

  // Expansion and Growth
  expansionRights: z.boolean().default(false),
  franchiseRights: z.boolean().default(false),
  territorialRights: z.string().optional(),
  growthPlanning: z.string().optional(),

  // Compliance
  regulatoryCompliance: z.boolean().default(true),
  healthCodeCompliance: z.boolean().default(true),
  laborLawCompliance: z.boolean().default(true),
  taxCompliance: z.boolean().default(true),

  // Technology
  posSystemManagement: z.string().optional(),
  onlineOrderingSystem: z.boolean().default(false),
  reservationSystem: z.boolean().default(false),
  technologyUpgrades: z.string().optional(),

  // Special Provisions
  exclusivityClauses: z.string().optional(),
  nonDisclosureAgreement: z.boolean().default(true),
  confidentialityRequirements: z.string().optional(),
  specialTerms: z.string().optional(),

  // Signature Requirements
  requirePrimarySignature: z.boolean().default(true),
  requireSecondarySignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
