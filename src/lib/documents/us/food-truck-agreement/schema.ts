// src/lib/documents/us/food-truck-agreement/schema.ts
import { z } from 'zod';

export const FoodTruckAgreementSchema = z.object({
  // Food Truck Operator Information
  operatorName: z.string().min(1, 'Operator name is required'),
  operatorAddress: z.string().optional(),
  operatorPhone: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  businessName: z.string().optional(),
  businessLicense: z.string().optional(),
  foodHandlersCertification: z.string().optional(),

  // Property Owner/Event Information
  locationOwnerName: z.string().min(1, 'Location owner name is required'),
  locationOwnerAddress: z.string().optional(),
  locationOwnerPhone: z.string().optional(),
  locationOwnerEmail: z.string().email().optional(),
  locationOwnerType: z
    .enum(['private', 'municipal', 'commercial', 'event'])
    .optional(),

  // Location Details
  operatingLocation: z.string().optional(),
  locationDescription: z.string().optional(),
  operatingDays: z.string().optional(),
  operatingHours: z.string().optional(),
  setupTime: z.string().optional(),
  breakdownTime: z.string().optional(),

  // Vehicle and Equipment
  truckDescription: z.string().optional(),
  truckRegistration: z.string().optional(),
  kitchenEquipment: z.string().optional(),
  powerRequirements: z.string().optional(),
  waterConnection: z.string().optional(),
  wasteDisposal: z.string().optional(),

  // Menu and Food Service
  menuDescription: z.string().optional(),
  foodType: z
    .enum([
      'american',
      'mexican',
      'asian',
      'mediterranean',
      'bbq',
      'desserts',
      'mixed',
    ])
    .optional(),
  specialDietaryOptions: z.string().optional(),
  priceRange: z.string().optional(),
  alcoholService: z.boolean().default(false),

  // Financial Terms
  vendorFee: z.string().optional(),
  percentageOfSales: z.string().optional(),
  minimumSales: z.string().optional(),
  paymentSchedule: z
    .enum(['daily', 'weekly', 'monthly', 'per-event'])
    .default('daily'),
  securityDeposit: z.string().optional(),

  // Permits and Licensing
  businessLicenseRequired: z.boolean().default(true),
  foodVendorPermit: z.boolean().default(true),
  healthDepartmentPermit: z.boolean().default(true),
  firePermit: z.boolean().default(false),
  mobilePeddlerLicense: z.boolean().default(true),

  // Health and Safety
  healthInspection: z.boolean().default(true),
  foodSafetyTraining: z.boolean().default(true),
  sanitationRequirements: z.string().optional(),
  temperatureControl: z.boolean().default(true),
  handwashingFacilities: z.boolean().default(true),

  // Insurance Requirements
  generalLiability: z.boolean().default(true),
  productLiability: z.boolean().default(true),
  commercialAutoInsurance: z.boolean().default(true),
  workersCompensation: z.boolean().default(false),
  equipmentInsurance: z.boolean().default(false),

  // Utilities and Services
  electricalConnection: z
    .enum(['self-sufficient', 'provided', 'hookup-available'])
    .default('self-sufficient'),
  waterSupply: z
    .enum(['self-sufficient', 'provided', 'hookup-available'])
    .default('self-sufficient'),
  sewerConnection: z
    .enum(['self-sufficient', 'provided', 'hookup-available'])
    .default('self-sufficient'),
  trashRemoval: z.enum(['operator', 'location', 'shared']).default('operator'),

  // Operational Requirements
  uniformRequirements: z.string().optional(),
  signageRestrictions: z.string().optional(),
  noiseRestrictions: z.string().optional(),
  smokingPolicy: z
    .enum(['prohibited', 'designated-areas', 'permitted'])
    .default('prohibited'),
  musicPolicy: z.string().optional(),

  // Competition and Exclusivity
  exclusivityRadius: z.string().optional(),
  competingVendors: z.boolean().default(true),
  territorialRights: z.string().optional(),
  nonCompeteClause: z.boolean().default(false),

  // Customer Service
  customerServiceStandards: z.string().optional(),
  complaintHandling: z.string().optional(),
  waitTimeStandards: z.string().optional(),
  customerSatisfactionRequirements: z.string().optional(),

  // Marketing and Promotion
  marketingRights: z.boolean().default(true),
  socialMediaPromotion: z.boolean().default(true),
  eventListings: z.boolean().default(true),
  photographyRights: z.boolean().default(true),
  brandingRequirements: z.string().optional(),

  // Environmental Compliance
  wasteManagement: z.string().optional(),
  recyclingRequirements: z.boolean().default(false),
  greyWaterDisposal: z.string().optional(),
  environmentalCleanup: z.boolean().default(true),
  sustainabilityPractices: z.string().optional(),

  // Emergency Procedures
  emergencyContacts: z.string().optional(),
  fireEmergencyPlan: z.string().optional(),
  medicalEmergencyPlan: z.string().optional(),
  evacuationProcedures: z.string().optional(),

  // Weather and Seasonal
  weatherCancellation: z.boolean().default(true),
  seasonalOperation: z.boolean().default(false),
  indoorAlternatives: z.boolean().default(false),
  winterOperations: z.boolean().default(false),

  // Staff and Employment
  staffRequirements: z.string().optional(),
  backgroundChecks: z.boolean().default(false),
  minimumWageCompliance: z.boolean().default(true),
  laborLawCompliance: z.boolean().default(true),
  uniformedStaff: z.boolean().default(false),

  // Special Events
  festivalParticipation: z.boolean().default(true),
  privateEvents: z.boolean().default(true),
  corporateEvents: z.boolean().default(true),
  weddingCatering: z.boolean().default(false),
  specialEventRates: z.string().optional(),

  // Quality Control
  foodQualityStandards: z.string().optional(),
  serviceStandards: z.string().optional(),
  cleanlinesStandards: z.string().optional(),
  inspectionRights: z.boolean().default(true),
  performanceMetrics: z.string().optional(),

  // Technology and Payment
  posSystem: z.boolean().default(true),
  creditCardAcceptance: z.boolean().default(true),
  mobilePayments: z.boolean().default(true),
  cashHandling: z.boolean().default(true),
  salesReporting: z.boolean().default(true),

  // Legal Compliance
  localOrdinanceCompliance: z.boolean().default(true),
  zoningCompliance: z.boolean().default(true),
  adaCompliance: z.boolean().default(true),

  // Termination and Cancellation
  terminationNotice: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
  breachRemedies: z.string().optional(),

  // Indemnification
  indemnificationClause: z.boolean().default(true),
  holdHarmless: z.boolean().default(true),
  thirdPartyLiability: z.boolean().default(true),
  propertyDamage: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Signature Requirements
  operatorSignature: z.boolean().default(true),
  locationOwnerSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
