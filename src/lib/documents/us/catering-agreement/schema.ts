// src/lib/documents/us/catering-agreement/schema.ts
import { z } from 'zod';

export const CateringAgreementSchema = z.object({
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientCompany: z.string().optional(),

  // Caterer Information
  catererName: z.string().min(1, 'Caterer name is required'),
  catererBusinessName: z.string().optional(),
  catererAddress: z.string().optional(),
  catererPhone: z.string().optional(),
  catererEmail: z.string().email().optional(),
  catererLicense: z.string().optional(),

  // Event Details
  eventName: z.string().optional(),
  eventType: z
    .enum([
      'wedding',
      'corporate',
      'birthday',
      'anniversary',
      'graduation',
      'holiday',
      'other',
    ])
    .default('other'),
  eventDate: z.string().optional(),
  eventStartTime: z.string().optional(),
  eventEndTime: z.string().optional(),
  eventDuration: z.string().optional(),

  // Venue Information
  venueAddress: z.string().optional(),
  venueName: z.string().optional(),
  venueContact: z.string().optional(),
  venueAccessTime: z.string().optional(),
  venueRestrictions: z.string().optional(),
  kitchenFacilities: z.boolean().default(false),

  // Guest Information
  guestCount: z.string().optional(),
  confirmedGuestCount: z.string().optional(),
  finalCountDeadline: z.string().optional(),
  adultsCount: z.string().optional(),
  childrenCount: z.string().optional(),

  // Menu and Service
  serviceStyle: z
    .enum(['buffet', 'plated', 'family-style', 'cocktail', 'stations', 'other'])
    .default('buffet'),
  menuDescription: z.string().optional(),
  appetizers: z.string().optional(),
  mainCourses: z.string().optional(),
  desserts: z.string().optional(),
  beverages: z.string().optional(),

  // Dietary Requirements
  vegetarianOptions: z.boolean().default(false),
  veganOptions: z.boolean().default(false),
  glutenFreeOptions: z.boolean().default(false),
  allergyAccommodations: z.boolean().default(false),
  allergyDetails: z.string().optional(),
  specialDietaryNeeds: z.string().optional(),

  // Service Details
  serviceHours: z.string().optional(),
  setupTime: z.string().optional(),
  cleanupTime: z.string().optional(),
  staffCount: z.string().optional(),
  serverRatio: z.string().optional(),
  uniformRequirements: z.string().optional(),

  // Equipment and Supplies
  tablesChainsProvided: z.boolean().default(false),
  linensProvided: z.boolean().default(false),
  chinaProvided: z.boolean().default(false),
  glasswareProvided: z.boolean().default(false),
  silverwareProvided: z.boolean().default(false),
  servingEquipment: z.boolean().default(false),

  // Alcohol Service
  alcoholService: z.boolean().default(false),
  barService: z
    .enum([
      'open-bar',
      'cash-bar',
      'wine-beer-only',
      'signature-cocktails',
      'none',
    ])
    .default('none'),
  bartenderProvided: z.boolean().default(false),
  alcoholLicenseRequired: z.boolean().default(false),
  alcoholLiability: z.boolean().default(false),

  // Pricing
  totalCost: z.string().optional(),
  perPersonCost: z.string().optional(),
  serviceFee: z.string().optional(),
  gratuity: z.string().optional(),
  salesTax: z.string().optional(),
  additionalFees: z.string().optional(),

  // Payment Terms
  depositAmount: z.string().optional(),
  depositDueDate: z.string().optional(),
  finalPaymentDue: z.string().optional(),
  paymentMethod: z
    .enum(['cash', 'check', 'credit-card', 'bank-transfer'])
    .default('check'),
  lateFee: z.string().optional(),

  // Cancellation Policy
  cancellationPolicy: z.string().optional(),
  cancellationDeadline: z.string().optional(),
  cancellationFee: z.string().optional(),
  refundPolicy: z.string().optional(),
  forceMajeure: z.boolean().default(true),

  // Menu Changes
  menuChangeDeadline: z.string().optional(),
  menuChangeFee: z.string().optional(),
  substitutionPolicy: z.string().optional(),
  seasonalMenuAdjustments: z.boolean().default(false),

  // Additional Services
  decorativeServices: z.boolean().default(false),
  floralArrangements: z.boolean().default(false),
  entertainmentCoordination: z.boolean().default(false),
  photographyServices: z.boolean().default(false),
  cleanupServices: z.boolean().default(false),

  // Special Requirements
  specialRequests: z.string().optional(),
  culturalRequirements: z.string().optional(),
  religiousRequirements: z.string().optional(),
  presentationRequirements: z.string().optional(),

  // Health and Safety
  foodSafetyCompliance: z.boolean().default(true),
  healthPermits: z.boolean().default(true),
  insuranceCoverage: z.boolean().default(true),
  liabilityInsurance: z.string().optional(),
  workerCompInsurance: z.boolean().default(false),

  // Logistics
  deliveryTime: z.string().optional(),
  pickupTime: z.string().optional(),
  parkingRequirements: z.string().optional(),
  loadingAccess: z.string().optional(),
  electricityNeeds: z.string().optional(),
  waterAccess: z.string().optional(),

  // Quality Standards
  foodQualityGuarantee: z.boolean().default(true),
  serviceStandards: z.string().optional(),
  presentationStandards: z.string().optional(),
  temperatureRequirements: z.string().optional(),

  // Emergency Plans
  contingencyPlanning: z.boolean().default(false),
  weatherBackupPlan: z.string().optional(),
  emergencyContact: z.string().optional(),
  substitutionProtocol: z.string().optional(),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),

  // Signature Requirements
  requireClientSignature: z.boolean().default(true),
  requireCatererSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
