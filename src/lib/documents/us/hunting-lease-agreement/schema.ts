// src/lib/documents/us/hunting-lease-agreement/schema.ts
import { z } from 'zod';

export const HuntingLeaseAgreementSchema = z.object({
  // Landowner Information
  landownerName: z.string().min(1, 'Landowner name is required'),
  landownerAddress: z.string().optional(),
  landownerPhone: z.string().optional(),
  landownerEmail: z.string().email().optional(),
  propertyOwnershipType: z
    .enum(['individual', 'corporation', 'partnership', 'trust'])
    .default('individual'),

  // Hunter/Lessee Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeAddress: z.string().optional(),
  lesseePhone: z.string().optional(),
  lesseeEmail: z.string().email().optional(),
  huntingLicense: z.string().optional(),
  huntingSafetyCertification: z.boolean().default(true),

  // Property Description
  propertyDescription: z.string().optional(),
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  totalAcres: z.string().optional(),
  huntingAcres: z.string().optional(),
  propertyBoundaries: z.string().optional(),

  // Lease Terms
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  leaseTerm: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  renewalNotice: z.string().optional(),
  seasonDates: z.string().optional(),

  // Hunting Rights
  huntingRightsType: z
    .enum(['exclusive', 'non-exclusive', 'shared'])
    .default('exclusive'),
  gameTypes: z
    .array(
      z.enum([
        'deer',
        'turkey',
        'duck',
        'dove',
        'quail',
        'rabbit',
        'squirrel',
        'wild-hog',
        'elk',
        'bear',
        'waterfowl',
      ]),
    )
    .default(['deer']),
  huntingMethods: z
    .array(z.enum(['bow', 'rifle', 'shotgun', 'muzzleloader', 'crossbow']))
    .default(['bow', 'rifle']),
  bagLimits: z.string().optional(),
  trophyRestrictions: z.string().optional(),

  // Payment Terms
  annualFee: z.string().optional(),
  paymentSchedule: z
    .enum(['annual', 'semi-annual', 'seasonal'])
    .default('annual'),
  securityDeposit: z.string().optional(),
  lateFee: z.string().optional(),
  additionalFees: z.string().optional(),

  // Number of Hunters
  maximumHunters: z.string().optional(),
  adultHunters: z.string().optional(),
  youthHunters: z.string().optional(),
  guestPolicy: z.string().optional(),
  hunterRegistration: z.boolean().default(true),

  // Access and Use
  accessHours: z.string().optional(),
  campingAllowed: z.boolean().default(false),
  campingRestrictions: z.string().optional(),
  vehicleAccess: z.boolean().default(true),
  atvUse: z.boolean().default(false),
  roadMaintenance: z.enum(['landowner', 'lessee', 'shared']).default('lessee'),

  // Safety Requirements
  orangeVestRequired: z.boolean().default(true),
  treestandRequirements: z.string().optional(),
  firearmSafety: z.boolean().default(true),
  alcoholProhibition: z.boolean().default(true),
  drugProhibition: z.boolean().default(true),
  emergencyContact: z.string().optional(),

  // Wildlife Management
  feedingAllowed: z.boolean().default(false),
  feedingRestrictions: z.string().optional(),
  foodPlotting: z.boolean().default(false),
  treePlanting: z.boolean().default(false),
  habitatImprovement: z.boolean().default(false),
  managementPlan: z.boolean().default(false),

  // Property Improvements
  blindConstruction: z.boolean().default(true),
  standPlacement: z.boolean().default(true),
  trailMaintenance: z.boolean().default(false),
  fenceRepair: z.boolean().default(false),
  improvementApproval: z.boolean().default(true),
  removaiREquired: z.boolean().default(true),

  // Prohibited Activities
  fishingProhibited: z.boolean().default(false),
  trappingProhibited: z.boolean().default(true),
  cuttingTrees: z.boolean().default(true),
  campfires: z.boolean().default(false),
  litteringProhibited: z.boolean().default(true),
  damageProhibited: z.boolean().default(true),

  // Harvested Game
  gametagging: z.boolean().default(true),
  harvestReporting: z.boolean().default(true),
  gameProcessing: z.enum(['lessee', 'landowner', 'shared']).default('lessee'),
  donationRights: z.boolean().default(true),
  firstRefusal: z.boolean().default(false),

  // Insurance and Liability
  liabilityInsurance: z.boolean().default(true),
  insuranceAmount: z.string().optional(),
  additionalInsured: z.boolean().default(true),
  liabilityWaiver: z.boolean().default(true),
  propertyDamage: z.enum(['lessee', 'landowner', 'shared']).default('lessee'),
  personalInjury: z.enum(['lessee', 'landowner', 'shared']).default('lessee'),

  // Legal Compliance
  huntingLicenseRequired: z.boolean().default(true),
  stateRegulations: z.boolean().default(true),
  localOrdinances: z.boolean().default(true),
  gameWardenAccess: z.boolean().default(true),
  violationConsequences: z.string().optional(),

  // Environmental Protection
  litterRemoval: z.boolean().default(true),
  fireRestrictions: z.boolean().default(true),
  waterSourceProtection: z.boolean().default(true),
  soilConservation: z.boolean().default(true),
  wetlandProtection: z.boolean().default(true),

  // Property Restrictions
  buildingRestrictions: z.string().optional(),
  commercialUseProhibited: z.boolean().default(true),
  resaleProhibited: z.boolean().default(true),
  sublettingProhibited: z.boolean().default(true),
  exclusiveAreas: z.string().optional(),

  // Dispute Resolution
  disputeNotice: z.string().optional(),
  mediationRequired: z.boolean().default(true),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Default and Termination
  defaultDefinition: z.string().optional(),
  noticeRequirement: z.string().optional(),
  curePeriod: z.string().optional(),
  terminationRights: z.boolean().default(true),
  equipmentRemoval: z.boolean().default(true),

  // Communication
  communicationMethod: z.enum(['phone', 'email', 'mail']).default('phone'),
  emergencyNumbers: z.string().optional(),
  landownerContact: z.string().optional(),
  huntingSchedule: z.boolean().default(false),

  // Special Provisions
  weatherCancellation: z.boolean().default(true),
  disasterProvisions: z.string().optional(),
  seasonalRestrictions: z.string().optional(),
  breedingSeasonRestrictions: z.boolean().default(true),
  specialConditions: z.string().optional(),

  // Record Keeping
  huntingLogs: z.boolean().default(true),
  harvestRecords: z.boolean().default(true),
  visitorLogs: z.boolean().default(true),
  incidentReports: z.boolean().default(true),
  photographyRights: z.boolean().default(true),

  // Additional Rights
  scoutingRights: z.boolean().default(true),
  scoutingDates: z.string().optional(),
  photographyRights: z.boolean().default(true),
  videographyRights: z.boolean().default(true),
  guidingRights: z.boolean().default(false),

  // Assignment and Transfer
  assignmentRights: z.boolean().default(false),
  transferApproval: z.boolean().default(true),
  membershipChanges: z.boolean().default(true),
  backgroundChecks: z.boolean().default(false),

  // Equipment and Stands
  equipmentOwnership: z
    .enum(['lessee', 'landowner', 'shared'])
    .default('lessee'),
  standInsurance: z.boolean().default(false),
  standInspection: z.boolean().default(true),
  equipmentMaintenance: z
    .enum(['lessee', 'landowner', 'shared'])
    .default('lessee'),

  // Weather and Natural Disasters
  actOfGod: z.boolean().default(true),
  weatherRefunds: z.boolean().default(false),
  droughtConditions: z.boolean().default(true),
  floodConditions: z.boolean().default(true),
  fireConditions: z.boolean().default(true),

  // Signature Requirements
  landownerSignature: z.boolean().default(true),
  lesseeSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
