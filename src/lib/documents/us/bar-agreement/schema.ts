// src/lib/documents/us/bar-agreement/schema.ts
import { z } from 'zod';

export const BarAgreementSchema = z.object({
  // Primary Party Information
  primaryPartyName: z.string().min(1, 'Primary party name is required'),
  primaryPartyAddress: z.string().optional(),
  primaryPartyPhone: z.string().optional(),
  primaryPartyEmail: z.string().email().optional(),
  primaryPartyRole: z
    .enum(['owner', 'partner', 'manager', 'investor'])
    .default('owner'),

  // Secondary Party Information
  secondaryPartyName: z.string().min(1, 'Secondary party name is required'),
  secondaryPartyAddress: z.string().optional(),
  secondaryPartyPhone: z.string().optional(),
  secondaryPartyEmail: z.string().email().optional(),
  secondaryPartyRole: z
    .enum(['owner', 'partner', 'manager', 'investor'])
    .default('partner'),

  // Bar Information
  barName: z.string().min(1, 'Bar name is required'),
  barAddress: z.string().optional(),
  barType: z
    .enum([
      'sports-bar',
      'cocktail-bar',
      'dive-bar',
      'wine-bar',
      'nightclub',
      'pub',
      'other',
    ])
    .default('sports-bar'),
  seatingCapacity: z.string().optional(),
  barCapacity: z.string().optional(),

  // Business Structure
  businessEntity: z
    .enum(['llc', 'corporation', 'partnership', 'sole-proprietorship'])
    .default('llc'),
  businessLicense: z.string().optional(),
  taxIdNumber: z.string().optional(),

  // Liquor License
  liquorLicense: z.boolean().default(true),
  liquorLicenseNumber: z.string().optional(),
  liquorLicenseExpiration: z.string().optional(),
  beerWineLicense: z.boolean().default(false),
  fullLiquorLicense: z.boolean().default(false),

  // Financial Terms
  totalInvestment: z.string().optional(),
  initialCapital: z.string().optional(),
  ownershipPercentage: z.string().optional(),
  profitSharing: z.string().optional(),
  lossSharing: z.string().optional(),
  drawSchedule: z.string().optional(),

  // Operating Hours
  operatingHours: z.string().optional(),
  happyHourSchedule: z.string().optional(),
  closedDays: z.string().optional(),
  holidayHours: z.string().optional(),
  lastCall: z.string().optional(),

  // Management Responsibilities
  dailyOperations: z
    .enum(['joint', 'primary-party', 'secondary-party', 'manager'])
    .default('joint'),
  staffManagement: z
    .enum(['joint', 'primary-party', 'secondary-party', 'manager'])
    .default('joint'),
  inventoryManagement: z
    .enum(['joint', 'primary-party', 'secondary-party', 'manager'])
    .default('joint'),
  financialManagement: z
    .enum(['joint', 'primary-party', 'secondary-party'])
    .default('joint'),

  // Beverage Program
  drinkMenuControl: z
    .enum(['joint', 'primary-party', 'secondary-party', 'bartender'])
    .default('joint'),
  pricingControl: z
    .enum(['joint', 'primary-party', 'secondary-party'])
    .default('joint'),
  supplierSelection: z
    .enum(['joint', 'primary-party', 'secondary-party'])
    .default('joint'),
  specialtyDrinks: z.string().optional(),

  // Food Service
  foodService: z.boolean().default(false),
  kitchenFacilities: z.boolean().default(false),
  foodMenuControl: z
    .enum(['joint', 'primary-party', 'secondary-party', 'chef'])
    .default('joint'),
  foodServiceHours: z.string().optional(),

  // Entertainment
  liveEntertainment: z.boolean().default(false),
  djServices: z.boolean().default(false),
  karaoke: z.boolean().default(false),
  sportsEvents: z.boolean().default(false),
  entertainmentBudget: z.string().optional(),

  // Staffing
  bartenderRequirements: z.string().optional(),
  securityStaff: z.boolean().default(false),
  minimumStaffing: z.string().optional(),
  staffTraining: z.string().optional(),
  uniformRequirements: z.string().optional(),

  // Equipment and Inventory
  barEquipment: z.string().optional(),
  posSystem: z.boolean().default(false),
  securitySystem: z.boolean().default(false),
  soundSystem: z.boolean().default(false),
  televisions: z.boolean().default(false),

  // Marketing and Promotions
  marketingStrategy: z.string().optional(),
  socialMediaManagement: z
    .enum(['joint', 'primary-party', 'secondary-party'])
    .default('joint'),
  eventPlanning: z.boolean().default(false),
  loyaltyProgram: z.boolean().default(false),

  // Health and Safety
  healthSafetyCompliance: z.boolean().default(true),
  alcoholSafetyTraining: z.boolean().default(true),
  ageVerificationProcedures: z.string().optional(),
  overservingPrevention: z.string().optional(),
  emergencyProcedures: z.string().optional(),

  // Insurance
  generalLiability: z.boolean().default(true),
  liquorLiability: z.boolean().default(true),
  propertyInsurance: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),

  // Legal Compliance
  ageRestrictions: z.boolean().default(true),
  idCheckingPolicy: z.string().optional(),
  noiseOrdinanceCompliance: z.boolean().default(true),
  smokingPolicy: z
    .enum(['no-smoking', 'smoking-allowed', 'designated-area'])
    .default('no-smoking'),

  // Quality Standards
  cleanlinessStandards: z.string().optional(),
  customerServiceStandards: z.string().optional(),
  drinkQualityStandards: z.string().optional(),
  atmosphereStandards: z.string().optional(),

  // Financial Management
  cashHandlingProcedures: z.string().optional(),
  depositProcedures: z.string().optional(),
  expenseApproval: z.string().optional(),
  bookkeepingResponsibilities: z.string().optional(),

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
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Special Provisions
  exclusivityClauses: z.string().optional(),
  confidentialityRequirements: z.boolean().default(true),
  nonDisclosureAgreement: z.boolean().default(true),
  specialTerms: z.string().optional(),

  // Signature Requirements
  requirePrimarySignature: z.boolean().default(true),
  requireSecondarySignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
