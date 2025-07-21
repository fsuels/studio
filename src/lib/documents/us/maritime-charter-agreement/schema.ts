// src/lib/documents/us/maritime-charter-agreement/schema.ts
import { z } from 'zod';

export const MaritimeCharterAgreementSchema = z.object({
  // Vessel Owner Information
  ownerName: z.string().min(1, 'Vessel owner name is required'),
  ownerAddress: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerLicense: z.string().optional(),

  // Charterer Information
  chartererName: z.string().min(1, 'Charterer name is required'),
  chartererAddress: z.string().optional(),
  chartererPhone: z.string().optional(),
  chartererEmail: z.string().email().optional(),

  // Vessel Details
  vesselName: z.string().optional(),
  vesselType: z
    .enum([
      'cargo',
      'tanker',
      'container',
      'bulk-carrier',
      'yacht',
      'fishing',
      'passenger',
    ])
    .optional(),
  vesselRegistration: z.string().optional(),
  vesselFlag: z.string().optional(),
  vesselLength: z.string().optional(),
  vesselCapacity: z.string().optional(),
  vesselAge: z.string().optional(),

  // Charter Type
  charterType: z
    .enum(['bareboat', 'time-charter', 'voyage-charter', 'demise-charter'])
    .default('time-charter'),
  charterPeriod: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deliveryPort: z.string().optional(),
  redeliveryPort: z.string().optional(),

  // Financial Terms
  charterRate: z.string().optional(),
  paymentTerms: z
    .enum(['daily', 'monthly', 'lump-sum', 'per-voyage'])
    .default('monthly'),
  currency: z.enum(['usd', 'eur', 'gbp']).default('usd'),
  fuelCosts: z.enum(['owner', 'charterer', 'shared']).default('charterer'),
  portCharges: z.enum(['owner', 'charterer', 'shared']).default('charterer'),

  // Crew and Manning
  crewProvision: z.enum(['owner', 'charterer', 'shared']).default('owner'),
  crewQualifications: z.string().optional(),
  masterSelection: z.enum(['owner', 'charterer', 'mutual']).default('owner'),
  crewInsurance: z.boolean().default(true),

  // Insurance and Liability
  hullInsurance: z.boolean().default(true),
  protectionIndemnity: z.boolean().default(true),
  cargoInsurance: z.boolean().default(false),
  warRisks: z.boolean().default(false),

  // Operational Terms
  tradingLimits: z.string().optional(),
  cargoTypes: z.string().optional(),
  prohibitedTrades: z.string().optional(),
  speedConsumption: z.string().optional(),
  bunkerSpecs: z.string().optional(),

  // Maintenance and Repairs
  maintenanceResponsibility: z
    .enum(['owner', 'charterer', 'shared'])
    .default('owner'),
  dryDockSchedule: z.string().optional(),
  emergencyRepairs: z.enum(['owner', 'charterer', 'shared']).default('owner'),
  classificationSociety: z.string().optional(),

  // Performance Standards
  deliveryCondition: z.string().optional(),
  redeliveryCondition: z.string().optional(),
  performanceGuarantees: z.string().optional(),
  offHireEvents: z.string().optional(),

  // Legal and Regulatory
  flagStateCompliance: z.boolean().default(true),
  portStateCompliance: z.boolean().default(true),
  ismCode: z.boolean().default(true),
  ispsCode: z.boolean().default(true),

  // Environmental
  pollutionPrevention: z.boolean().default(true),
  ballastWaterManagement: z.boolean().default(true),
  emissionStandards: z.string().optional(),
  environmentalCompliance: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['arbitration', 'court', 'mediation'])
    .default('arbitration'),
  arbitrationRules: z.string().optional(),
  arbitrationLocation: z.string().optional(),
  governingLaw: z.string().optional(),

  // Force Majeure
  weatherConditions: z.boolean().default(true),
  piracy: z.boolean().default(true),
  war: z.boolean().default(true),
  governmentActions: z.boolean().default(true),

  // Termination
  terminationClauses: z.string().optional(),
  totalLoss: z.boolean().default(true),
  breachRemedies: z.string().optional(),
  noticePeriods: z.string().optional(),

  // Special Clauses
  iceClause: z.boolean().default(false),
  warClause: z.boolean().default(true),
  substitutionClause: z.boolean().default(false),
  cancellationClause: z.boolean().default(false),

  // Signature Requirements
  ownerSignature: z.boolean().default(true),
  chartererSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});
