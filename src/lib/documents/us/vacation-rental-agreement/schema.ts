// src/lib/documents/us/vacation-rental-agreement/schema.ts
import { z } from 'zod';

export const VacationRentalAgreementSchema = z.object({
  // Property Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerLicenseNumber: z.string().optional(),

  // Guest Information
  guestName: z.string().min(1, 'Guest name is required'),
  guestAddress: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email().optional(),
  numberOfGuests: z.string().optional(),
  guestAges: z.string().optional(),

  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z
    .enum(['house', 'apartment', 'condo', 'cabin', 'villa', 'other'])
    .default('house'),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  maxOccupancy: z.string().optional(),
  squareFootage: z.string().optional(),

  // Rental Terms
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  rentalDuration: z.string().optional(),
  minimumStay: z.string().optional(),

  // Pricing
  nightlyRate: z.string().optional(),
  weeklyRate: z.string().optional(),
  monthlyRate: z.string().optional(),
  totalRentalCost: z.string().optional(),
  cleaningFee: z.string().optional(),
  serviceFee: z.string().optional(),
  taxAmount: z.string().optional(),

  // Security and Deposits
  securityDeposit: z.string().optional(),
  petDeposit: z.string().optional(),
  damageDeposit: z.string().optional(),
  keyDeposit: z.string().optional(),
  depositRefundable: z.boolean().default(true),
  depositRefundTime: z.string().optional(),

  // Payment Terms
  paymentSchedule: z
    .enum(['full-upfront', 'deposit-then-balance', 'installments'])
    .default('deposit-then-balance'),
  depositPercentage: z.string().optional(),
  balanceDueDate: z.string().optional(),
  acceptedPaymentMethods: z.string().optional(),
  lateFee: z.string().optional(),

  // Property Rules
  smokingAllowed: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  petRestrictions: z.string().optional(),
  partiesAllowed: z.boolean().default(false),
  noiseRestrictions: z.string().optional(),
  maximumVolume: z.string().optional(),
  quietHours: z.string().optional(),

  // Amenities Included
  wifi: z.boolean().default(false),
  parking: z.boolean().default(false),
  parkingSpaces: z.string().optional(),
  kitchen: z.boolean().default(false),
  laundry: z.boolean().default(false),
  airConditioning: z.boolean().default(false),
  heating: z.boolean().default(false),
  pool: z.boolean().default(false),
  hotTub: z.boolean().default(false),

  // Electronics and Entertainment
  television: z.boolean().default(false),
  cableInternet: z.boolean().default(false),
  stereoSystem: z.boolean().default(false),
  gamingConsole: z.boolean().default(false),
  streamingServices: z.boolean().default(false),

  // Kitchen and Dining
  kitchenFullyEquipped: z.boolean().default(false),
  dishwasher: z.boolean().default(false),
  microwave: z.boolean().default(false),
  coffeemaker: z.boolean().default(false),
  cookware: z.boolean().default(false),
  dinnerware: z.boolean().default(false),

  // Outdoor Amenities
  bbqGrill: z.boolean().default(false),
  outdoorFurniture: z.boolean().default(false),
  garden: z.boolean().default(false),
  beachAccess: z.boolean().default(false),
  skiAccess: z.boolean().default(false),

  // Services
  cleaningServiceIncluded: z.boolean().default(false),
  linenService: z.boolean().default(false),
  conciergeService: z.boolean().default(false),
  maintenanceService: z.boolean().default(false),

  // Access and Security
  keyPickupLocation: z.string().optional(),
  keyDropoffLocation: z.string().optional(),
  keylessEntry: z.boolean().default(false),
  securitySystem: z.boolean().default(false),
  emergencyContacts: z.string().optional(),

  // Guest Responsibilities
  cleaningResponsibilities: z.string().optional(),
  garbageDisposal: z.string().optional(),
  utilitiesResponsibility: z
    .enum(['owner', 'guest', 'shared'])
    .default('owner'),
  maintenanceReporting: z.boolean().default(true),

  // Cancellation Policy
  cancellationPolicy: z
    .enum(['strict', 'moderate', 'flexible', 'super-strict'])
    .default('moderate'),
  cancellationFee: z.string().optional(),
  refundPolicy: z.string().optional(),
  weatherCancellation: z.boolean().default(false),

  // Insurance and Liability
  propertyInsurance: z.boolean().default(true),
  liabilityInsurance: z.boolean().default(true),
  guestInsuranceRequired: z.boolean().default(false),
  damageWaiver: z.boolean().default(false),

  // Local Regulations
  businessLicense: z.string().optional(),
  touristTax: z.boolean().default(false),
  occupancyTax: z.boolean().default(false),
  localRegistrationNumber: z.string().optional(),

  // Emergency Information
  emergencyPhoneNumber: z.string().optional(),
  hospitalNearby: z.string().optional(),
  policeDepartment: z.string().optional(),
  fireDepartment: z.string().optional(),

  // Special Terms
  specialInstructions: z.string().optional(),
  houseRules: z.string().optional(),
  neighborhoodGuidelines: z.string().optional(),
  localAttractions: z.string().optional(),

  // Property Condition
  inventoryList: z.boolean().default(false),
  propertyInspection: z.boolean().default(true),
  preArrivalInspection: z.boolean().default(false),
  postDepartureInspection: z.boolean().default(true),

  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  naturalDisasterPolicy: z.string().optional(),
  governmentRestrictions: z.boolean().default(true),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),

  // Signature Requirements
  requireOwnerSignature: z.boolean().default(true),
  requireGuestSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
