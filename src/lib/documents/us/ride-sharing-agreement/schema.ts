// src/lib/documents/us/ride-sharing-agreement/schema.ts
import { z } from 'zod';

export const RideSharingAgreementSchema = z.object({
  // Driver Information
  driverName: z.string().min(1, 'Driver name is required'),
  driverAddress: z.string().optional(),
  driverPhone: z.string().optional(),
  driverEmail: z.string().email().optional(),
  driverLicense: z.string().optional(),

  // Passenger Information
  passengerName: z.string().min(1, 'Passenger name is required'),
  passengerAddress: z.string().optional(),
  passengerPhone: z.string().optional(),
  passengerEmail: z.string().email().optional(),
  emergencyContact: z.string().optional(),

  // Vehicle Information
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleColor: z.string().optional(),
  licensePlate: z.string().optional(),

  // Trip Details
  tripType: z
    .enum(['one-time', 'recurring', 'daily-commute', 'occasional'])
    .default('one-time'),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  departureTime: z.string().optional(),
  estimatedDuration: z.string().optional(),
  routeDescription: z.string().optional(),

  // Schedule
  recurringSchedule: z.string().optional(),
  daysOfWeek: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  flexibilityAllowed: z.boolean().default(true),

  // Cost Sharing
  costSharingMethod: z
    .enum(['per-trip', 'weekly', 'monthly', 'per-mile', 'gas-only'])
    .default('per-trip'),
  passengerContribution: z.string().optional(),
  fuelCostSharing: z.boolean().default(true),
  tollSharing: z.boolean().default(true),
  parkingCostSharing: z.boolean().default(false),

  // Payment Terms
  paymentMethod: z
    .enum(['cash', 'venmo', 'paypal', 'split-apps', 'other'])
    .default('cash'),
  paymentSchedule: z
    .enum(['upfront', 'end-of-trip', 'weekly', 'monthly'])
    .default('end-of-trip'),
  paymentDeadline: z.string().optional(),
  latePaymentPolicy: z.string().optional(),

  // Rules and Expectations
  smokingPolicy: z.boolean().default(false),
  musicPolicy: z.string().optional(),
  phonePolicy: z.string().optional(),
  foodDrinkPolicy: z.string().optional(),
  passengerLimitPolicy: z.string().optional(),

  // Safety Requirements
  seatbeltRequired: z.boolean().default(true),
  childSafetySeats: z.boolean().default(false),
  safetyInstructions: z.string().optional(),
  emergencyProcedures: z.string().optional(),

  // Vehicle Requirements
  vehicleInspection: z.boolean().default(false),
  maintenanceStandards: z.string().optional(),
  cleanlinessStandards: z.string().optional(),
  fuelRequirements: z.string().optional(),

  // Insurance and Liability
  driverInsurance: z.boolean().default(true),
  passengerInsurance: z.boolean().default(false),
  liabilityWaiver: z.boolean().default(true),
  accidentProtocol: z.string().optional(),
  insuranceClaims: z.string().optional(),

  // Cancellation Policy
  cancellationNotice: z.string().optional(),
  cancellationFee: z.string().optional(),
  noShowPolicy: z.string().optional(),
  emergencyCancellation: z.string().optional(),
  weatherCancellation: z.string().optional(),

  // Communication
  communicationMethods: z.string().optional(),
  updateNotifications: z.boolean().default(true),
  delayNotifications: z.boolean().default(true),
  emergencyNotification: z.boolean().default(true),

  // Modifications
  routeChanges: z.boolean().default(false),
  scheduleChanges: z.boolean().default(false),
  passengerChanges: z.boolean().default(false),
  approvalRequired: z.boolean().default(true),

  // Environmental Considerations
  carpoolBenefits: z.string().optional(),
  emissionReduction: z.boolean().default(true),
  fuelEfficiency: z.string().optional(),
  sustainabilityGoals: z.string().optional(),

  // Technology Use
  gpsTracking: z.boolean().default(false),
  rideshareApp: z.boolean().default(false),
  paymentApp: z.boolean().default(false),
  communicationApp: z.string().optional(),

  // Personal Belongings
  personalItemsPolicy: z.string().optional(),
  valuableItemsPolicy: z.string().optional(),
  lostItemsPolicy: z.string().optional(),
  storageAreas: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['discussion', 'mediation', 'arbitration'])
    .default('discussion'),
  conflictResolution: z.string().optional(),
  governingLaw: z.string().optional(),

  // Termination
  terminationNotice: z.string().optional(),
  terminationReasons: z.string().optional(),
  finalPaymentObligations: z.string().optional(),
  transitionPeriod: z.string().optional(),

  // Special Circumstances
  weatherPolicy: z.string().optional(),
  trafficPolicy: z.string().optional(),
  mechanicalFailure: z.string().optional(),
  alternativeArrangements: z.string().optional(),

  // Signature Requirements
  requireDriverSignature: z.boolean().default(true),
  requirePassengerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
