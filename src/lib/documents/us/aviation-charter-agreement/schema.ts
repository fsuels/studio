// src/lib/documents/us/aviation-charter-agreement/schema.ts
import { z } from 'zod';

export const AviationCharterAgreementSchema = z.object({
  // Aircraft Operator Information
  operatorName: z.string().min(1, 'Aircraft operator name is required'),
  operatorAddress: z.string().optional(),
  operatorPhone: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  operatorCertificate: z.string().optional(),
  operatingLicense: z.string().optional(),

  // Charterer Information
  chartererName: z.string().min(1, 'Charterer name is required'),
  chartererAddress: z.string().optional(),
  chartererPhone: z.string().optional(),
  chartererEmail: z.string().email().optional(),
  chartererCompany: z.string().optional(),

  // Aircraft Details
  aircraftType: z.string().optional(),
  aircraftModel: z.string().optional(),
  aircraftRegistration: z.string().optional(),
  aircraftCapacity: z.string().optional(),
  aircraftRange: z.string().optional(),
  aircraftAge: z.string().optional(),

  // Flight Details
  departureAirport: z.string().optional(),
  destinationAirport: z.string().optional(),
  departureDate: z.string().optional(),
  departureTime: z.string().optional(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  passengers: z.string().optional(),

  // Charter Type
  charterType: z
    .enum(['one-way', 'round-trip', 'multi-leg', 'time-based'])
    .default('round-trip'),
  flightType: z
    .enum(['domestic', 'international', 'cross-border'])
    .default('domestic'),
  charterPurpose: z
    .enum(['business', 'leisure', 'emergency', 'medical', 'cargo'])
    .default('business'),

  // Financial Terms
  charterFee: z.string().optional(),
  hourlyRate: z.string().optional(),
  fuelSurcharge: z.string().optional(),
  landingFees: z
    .enum(['included', 'additional', 'charterer-pays'])
    .default('additional'),
  overnightFees: z.string().optional(),
  cancellationFee: z.string().optional(),

  // Payment Terms
  paymentMethod: z
    .enum(['cash', 'check', 'wire-transfer', 'credit-card'])
    .default('wire-transfer'),
  paymentSchedule: z
    .enum(['advance', 'upon-completion', 'split'])
    .default('advance'),
  depositRequired: z.boolean().default(true),
  depositAmount: z.string().optional(),

  // Crew and Operations
  crewQualifications: z.string().optional(),
  pilotExperience: z.string().optional(),
  crewRest: z.boolean().default(true),
  dutyTimeCompliance: z.boolean().default(true),
  crewAccommodation: z
    .enum(['operator', 'charterer', 'shared'])
    .default('charterer'),

  // Safety and Compliance
  airworthinessCompliance: z.boolean().default(true),
  insuranceCoverage: z.boolean().default(true),
  liabilityInsurance: z.string().optional(),
  passengerInsurance: z.boolean().default(true),
  safetyRecords: z.boolean().default(true),

  // Weather and Operations
  weatherMinimums: z.string().optional(),
  alternateAirports: z.boolean().default(true),
  opsSpecsCompliance: z.boolean().default(true),
  airTrafficControl: z.boolean().default(true),

  // Passenger Services
  cateringService: z.boolean().default(false),
  groundTransportation: z.boolean().default(false),
  baggageAllowance: z.string().optional(),
  specialRequests: z.string().optional(),
  vipServices: z.boolean().default(false),

  // Cargo and Freight
  cargoWeight: z.string().optional(),
  cargoType: z.string().optional(),
  hazardousMaterials: z.boolean().default(false),
  cargoInsurance: z.boolean().default(false),
  loadingUnloading: z
    .enum(['operator', 'charterer', 'shared'])
    .default('charterer'),

  // International Flights
  customsClearance: z.boolean().default(false),
  overflyPermits: z.boolean().default(false),
  landingPermits: z.boolean().default(false),
  immigrationAssistance: z.boolean().default(false),

  // Scheduling and Changes
  scheduleChanges: z.string().optional(),
  delayProcedures: z.string().optional(),
  weatherDelays: z.string().optional(),
  mechanicalDelays: z.string().optional(),

  // Cancellation Terms
  cancellationPolicy: z.string().optional(),
  cancellationDeadline: z.string().optional(),
  refundPolicy: z.string().optional(),
  forceMAjeureCancellation: z.boolean().default(true),

  // Liability and Risk
  passengerLiability: z.string().optional(),
  cargoLiability: z.string().optional(),
  thirdPartyLiability: z.string().optional(),
  warRisks: z.boolean().default(false),

  // Emergency Procedures
  emergencyContact: z.string().optional(),
  medicalEmergency: z.string().optional(),
  emergencyLanding: z.string().optional(),
  evacuationProcedures: z.string().optional(),

  // Communication
  flightTracking: z.boolean().default(true),
  statusUpdates: z.boolean().default(true),
  communicationMethods: z.string().optional(),
  operationsCenter: z.string().optional(),

  // Environmental
  carbonOffset: z.boolean().default(false),
  fuelEfficiency: z.string().optional(),
  noiseCompliance: z.boolean().default(true),
  emissionStandards: z.boolean().default(true),

  // Legal and Regulatory
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  regulatoryCompliance: z.boolean().default(true),
  farCompliance: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['arbitration', 'mediation', 'court'])
    .default('arbitration'),
  arbitrationRules: z.string().optional(),
  venue: z.string().optional(),

  // Special Provisions
  alcoholService: z.boolean().default(false),
  smokingPolicy: z
    .enum(['prohibited', 'designated-areas', 'permitted'])
    .default('prohibited'),
  petPolicy: z.boolean().default(false),
  entertainmentSystems: z.boolean().default(false),

  // Signature Requirements
  operatorSignature: z.boolean().default(true),
  chartererSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
