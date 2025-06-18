// src/lib/documents/us/hotel-agreement/schema.ts
import { z } from 'zod';

export const HotelAgreementSchema = z.object({
  // Primary Party Information
  primaryPartyName: z.string().min(1, 'Primary party name is required'),
  primaryPartyAddress: z.string().optional(),
  primaryPartyPhone: z.string().optional(),
  primaryPartyEmail: z.string().email().optional(),
  primaryPartyRole: z.enum(['owner', 'partner', 'manager', 'investor', 'franchisee']).default('owner'),
  
  // Secondary Party Information
  secondaryPartyName: z.string().min(1, 'Secondary party name is required'),
  secondaryPartyAddress: z.string().optional(),
  secondaryPartyPhone: z.string().optional(),
  secondaryPartyEmail: z.string().email().optional(),
  secondaryPartyRole: z.enum(['owner', 'partner', 'manager', 'investor', 'franchisee']).default('partner'),
  
  // Hotel Information
  hotelName: z.string().min(1, 'Hotel name is required'),
  hotelAddress: z.string().optional(),
  hotelType: z.enum(['budget', 'mid-range', 'luxury', 'boutique', 'resort', 'extended-stay', 'other']).default('mid-range'),
  numberOfRooms: z.string().optional(),
  numberOfFloors: z.string().optional(),
  starRating: z.enum(['1', '2', '3', '4', '5']).optional(),
  
  // Business Structure
  businessEntity: z.enum(['llc', 'corporation', 'partnership', 'sole-proprietorship']).default('llc'),
  businessLicense: z.string().optional(),
  taxIdNumber: z.string().optional(),
  hotelLicense: z.string().optional(),
  
  // Financial Terms
  totalInvestment: z.string().optional(),
  initialCapital: z.string().optional(),
  ownershipPercentage: z.string().optional(),
  profitSharing: z.string().optional(),
  lossSharing: z.string().optional(),
  drawSchedule: z.string().optional(),
  
  // Room Types and Rates
  standardRooms: z.string().optional(),
  deluxeRooms: z.string().optional(),
  suites: z.string().optional(),
  averageDailyRate: z.string().optional(),
  seasonalRates: z.boolean().default(false),
  peakSeasonRates: z.string().optional(),
  
  // Operations Management
  operationsManagement: z.enum(['joint', 'primary-party', 'secondary-party', 'hired-manager']).default('joint'),
  frontDeskManagement: z.enum(['joint', 'primary-party', 'secondary-party', 'hired-manager']).default('joint'),
  housekeepingManagement: z.enum(['joint', 'primary-party', 'secondary-party', 'hired-manager']).default('joint'),
  maintenanceManagement: z.enum(['joint', 'primary-party', 'secondary-party', 'hired-manager']).default('joint'),
  
  // Staffing
  frontDeskStaff: z.string().optional(),
  housekeepingStaff: z.string().optional(),
  maintenanceStaff: z.string().optional(),
  securityStaff: z.boolean().default(false),
  conciergeService: z.boolean().default(false),
  
  // Amenities and Services
  wifiIncluded: z.boolean().default(true),
  parkingAvailable: z.boolean().default(false),
  fitnessCenter: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  businessCenter: z.boolean().default(false),
  restaurant: z.boolean().default(false),
  roomService: z.boolean().default(false),
  
  // Guest Services
  checkinTime: z.string().optional(),
  checkoutTime: z.string().optional(),
  cancellationPolicy: z.enum(['flexible', 'moderate', 'strict', 'super-strict']).default('moderate'),
  petPolicy: z.enum(['no-pets', 'pets-allowed', 'pets-with-fee']).default('no-pets'),
  smokingPolicy: z.enum(['no-smoking', 'smoking-rooms-available', 'designated-areas']).default('no-smoking'),
  
  // Technology Systems
  propertyManagementSystem: z.boolean().default(false),
  onlineBookingSystem: z.boolean().default(false),
  keyCardSystem: z.boolean().default(false),
  securityCameras: z.boolean().default(false),
  
  // Maintenance and Upkeep
  regularMaintenance: z.string().optional(),
  roomRenovations: z.string().optional(),
  commonAreaUpkeep: z.string().optional(),
  equipmentMaintenance: z.string().optional(),
  
  // Marketing and Sales
  marketingStrategy: z.string().optional(),
  onlineMarketingBudget: z.string().optional(),
  travelAgentCommissions: z.string().optional(),
  corporateContracts: z.boolean().default(false),
  groupSalesManagement: z.enum(['joint', 'primary-party', 'secondary-party']).default('joint'),
  
  // Financial Management
  revenueManagement: z.enum(['joint', 'primary-party', 'secondary-party']).default('joint'),
  accountingProcedures: z.string().optional(),
  auditingRequirements: z.boolean().default(false),
  budgetApproval: z.string().optional(),
  
  // Insurance and Liability
  generalLiability: z.boolean().default(true),
  propertyInsurance: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),
  guestLiability: z.boolean().default(true),
  cybersecurityInsurance: z.boolean().default(false),
  
  // Health and Safety
  healthSafetyCompliance: z.boolean().default(true),
  fireDetectionSystems: z.boolean().default(true),
  emergencyProcedures: z.string().optional(),
  accessibilityCompliance: z.boolean().default(true),
  
  // Quality Standards
  cleanlinessStandards: z.string().optional(),
  customerServiceStandards: z.string().optional(),
  roomQualityStandards: z.string().optional(),
  guestSatisfactionTargets: z.string().optional(),
  
  // Food and Beverage
  restaurantOperations: z.boolean().default(false),
  barOperations: z.boolean().default(false),
  cateringServices: z.boolean().default(false),
  minibarService: z.boolean().default(false),
  
  // Event Facilities
  meetingRooms: z.boolean().default(false),
  conferenceCenter: z.boolean().default(false),
  banquetFacilities: z.boolean().default(false),
  weddingServices: z.boolean().default(false),
  
  // Environmental Policies
  sustainabilityPractices: z.boolean().default(false),
  energyEfficiencyMeasures: z.string().optional(),
  wasteManagementPolicy: z.string().optional(),
  greenCertification: z.boolean().default(false),
  
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
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Special Provisions
  franchiseAgreement: z.boolean().default(false),
  brandStandards: z.string().optional(),
  confidentialityRequirements: z.boolean().default(true),
  specialTerms: z.string().optional(),
  
  // Signature Requirements
  requirePrimarySignature: z.boolean().default(true),
  requireSecondarySignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});