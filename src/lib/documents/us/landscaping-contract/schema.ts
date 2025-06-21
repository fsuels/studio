// src/lib/documents/us/landscaping-contract/schema.ts
import { z } from 'zod';

export const LandscapingContractSchema = z.object({
  // Property Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().min(1, 'Owner phone is required'),
  ownerEmail: z.string().email().optional(),

  // Landscaping Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().min(1, 'Contractor phone is required'),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().optional(),
  businessInsurance: z.string().min(1, 'Business insurance is required'),

  // Project Information
  projectAddress: z.string().min(1, 'Project address is required'),
  serviceType: z.enum([
    'design-installation',
    'installation-only',
    'maintenance',
    'one-time-service',
    'seasonal-maintenance',
  ]),
  projectDescription: z.string().min(1, 'Project description is required'),
  propertySize: z.string().optional(),

  // Services Included
  servicesIncluded: z.array(z.string()).default([]),
  designServices: z.boolean().default(false),
  plantInstallation: z.boolean().default(false),
  sodInstallation: z.boolean().default(false),
  seedingServices: z.boolean().default(false),
  irrigationInstall: z.boolean().default(false),
  drainageWork: z.boolean().default(false),
  hardscaping: z.boolean().default(false),
  treePlanting: z.boolean().default(false),
  shrubPlanting: z.boolean().default(false),
  mulching: z.boolean().default(false),

  // Materials and Plants
  materialsIncluded: z.boolean().default(true),
  plantSelection: z.enum([
    'contractor-selects',
    'owner-selects',
    'joint-selection',
  ]),
  plantWarranty: z.boolean().default(false),
  plantWarrantyPeriod: z.string().optional(),
  materialsList: z.string().optional(),

  // Timeline
  contractDate: z.string().min(1, 'Contract date is required'),
  startDate: z.string().min(1, 'Start date is required'),
  completionDate: z.string().min(1, 'Completion date is required'),
  seasonalSchedule: z.string().optional(),
  weatherDelayPolicy: z.boolean().default(true),

  // Pricing
  contractPrice: z.string().min(1, 'Contract price is required'),
  priceType: z.enum([
    'fixed-price',
    'hourly-rate',
    'per-square-foot',
    'per-plant',
  ]),
  hourlyRate: z.string().optional(),
  additionalServices: z.string().optional(),

  // Payment Terms
  paymentSchedule: z.enum([
    'upfront',
    'progress-payments',
    'monthly',
    'seasonal',
    'completion',
  ]),
  downPayment: z.string().optional(),
  paymentMethod: z.enum(['check', 'cash', 'credit-card', 'bank-transfer']),
  latePaymentFee: z.string().optional(),

  // Maintenance Services
  maintenanceIncluded: z.boolean().default(false),
  maintenanceSchedule: z.string().optional(),
  maintenanceDuration: z.string().optional(),
  seasonalCleanup: z.boolean().default(false),
  winterProtection: z.boolean().default(false),

  // Site Preparation
  sitePreparation: z.boolean().default(true),
  soilTesting: z.boolean().default(false),
  soilAmendment: z.boolean().default(false),
  grading: z.boolean().default(false),
  excavation: z.boolean().default(false),

  // Permits and Utilities
  permitsRequired: z.boolean().default(false),
  permitResponsibility: z.enum(['owner', 'contractor']).optional(),
  utilityMarkingRequired: z.boolean().default(false),
  utilityMarkingResponsibility: z.enum(['owner', 'contractor']).optional(),

  // Cleanup and Waste
  cleanupIncluded: z.boolean().default(true),
  debrisRemoval: z.boolean().default(true),
  soilDisposal: z.boolean().default(false),
  propertyRestoration: z.boolean().default(true),

  // Insurance and Liability
  liabilityInsurance: z
    .string()
    .min(1, 'Liability insurance amount is required'),
  workersCompensation: z.boolean().default(true),
  propertyDamageProtection: z.boolean().default(true),
  vehicleInsurance: z.boolean().default(true),

  // Equipment and Tools
  equipmentProvided: z.boolean().default(true),
  equipmentMaintenance: z.boolean().default(true),
  specialEquipment: z.string().optional(),
  fuelCosts: z.enum(['contractor-pays', 'owner-pays', 'included-in-price']),

  // Water and Irrigation
  waterSource: z
    .enum(['owner-provides', 'contractor-provides', 'municipal'])
    .optional(),
  waterCosts: z
    .enum(['owner-pays', 'contractor-pays', 'included-in-price'])
    .optional(),
  irrigationMaintenance: z.boolean().default(false),
  droughtProtection: z.boolean().default(false),

  // Chemical Applications
  fertilizationIncluded: z.boolean().default(false),
  pestControlIncluded: z.boolean().default(false),
  herbicideApplication: z.boolean().default(false),
  organicMethods: z.boolean().default(false),
  chemicalNotification: z.boolean().default(true),

  // Quality Standards
  qualityStandards: z.string().optional(),
  inspectionRights: z.boolean().default(true),
  correctionPolicy: z.boolean().default(true),
  satisfactionGuarantee: z.boolean().default(false),

  // Environmental Considerations
  environmentalCompliance: z.boolean().default(true),
  nativePlants: z.boolean().default(false),
  waterConservation: z.boolean().default(false),
  sustainablePractices: z.boolean().default(false),

  // Access and Storage
  propertyAccess: z.boolean().default(true),
  storageSpace: z.boolean().default(false),
  parkingPermission: z.boolean().default(true),
  gateAccess: z.boolean().default(false),

  // Subcontractors
  subcontractorsAllowed: z.boolean().default(true),
  subcontractorApproval: z.boolean().default(false),
  subcontractorInsurance: z.boolean().default(true),

  // Change Orders
  changeOrderProcess: z.boolean().default(true),
  changeOrderApproval: z.enum([
    'written-only',
    'owner-approval',
    'contractor-discretion',
  ]),
  additionalWorkPricing: z.string().optional(),

  // Weather and Seasonal
  weatherProtection: z.boolean().default(true),
  seasonalLimitations: z.string().optional(),
  winterShutdown: z.boolean().default(false),
  springStartup: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z.enum([
    'negotiation',
    'mediation',
    'arbitration',
    'litigation',
  ]),
  governingLaw: z.string().optional(),

  // Termination
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationPayment: z.string().optional(),

  // Signatures
  ownerSignatureRequired: z.boolean().default(true),
  contractorSignatureRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
});
