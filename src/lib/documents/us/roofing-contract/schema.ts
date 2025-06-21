// src/lib/documents/us/roofing-contract/schema.ts
import { z } from 'zod';

export const RoofingContractSchema = z.object({
  // Property Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().min(1, 'Owner phone is required'),
  ownerEmail: z.string().email().optional(),

  // Roofing Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().min(1, 'Contractor phone is required'),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().min(1, 'Contractor license is required'),
  businessInsurance: z.string().min(1, 'Business insurance is required'),

  // Project Information
  projectAddress: z.string().min(1, 'Project address is required'),
  roofingType: z.enum([
    'repair',
    'replacement',
    'new-installation',
    'partial-replacement',
    'inspection-repair',
  ]),
  roofType: z.enum([
    'asphalt-shingles',
    'metal',
    'tile',
    'slate',
    'flat-roof',
    'wood-shingles',
    'other',
  ]),
  roofSize: z.string().min(1, 'Roof size is required'),
  roofPitch: z.string().optional(),

  // Work Description
  workDescription: z.string().min(1, 'Work description is required'),
  materialsSpecified: z.boolean().default(true),
  materialsList: z.string().optional(),
  workScope: z.string().min(1, 'Work scope is required'),

  // Materials and Specifications
  shingleType: z.string().optional(),
  shingleColor: z.string().optional(),
  shingleWarranty: z.string().optional(),
  underlaymentType: z.string().optional(),
  flashingMaterial: z.string().optional(),
  gutterWork: z.boolean().default(false),
  gutterType: z.string().optional(),

  // Timeline
  contractDate: z.string().min(1, 'Contract date is required'),
  startDate: z.string().min(1, 'Start date is required'),
  completionDate: z.string().min(1, 'Completion date is required'),
  weatherDelayPolicy: z.boolean().default(true),

  // Pricing
  contractPrice: z.string().min(1, 'Contract price is required'),
  priceType: z.enum(['fixed-price', 'per-square', 'time-and-materials']),
  priceIncludes: z.array(z.string()).default([]),
  additionalCosts: z.string().optional(),

  // Payment Terms
  paymentSchedule: z.enum([
    'down-payment-completion',
    'progress-payments',
    'payment-on-completion',
  ]),
  downPayment: z.string().optional(),
  progressPayments: z.string().optional(),
  finalPayment: z.string().optional(),
  paymentMethod: z.enum(['check', 'cash', 'credit-card', 'bank-transfer']),

  // Permits and Inspections
  permitsRequired: z.boolean().default(false),
  permitResponsibility: z.enum(['owner', 'contractor']).optional(),
  permitCosts: z
    .enum(['owner-pays', 'contractor-pays', 'included-in-price'])
    .optional(),
  inspectionRequired: z.boolean().default(false),

  // Cleanup and Waste
  debrisRemoval: z.boolean().default(true),
  debrisDisposal: z.enum([
    'contractor-handles',
    'owner-handles',
    'shared-responsibility',
  ]),
  magneticSweep: z.boolean().default(true),
  propertyProtection: z.boolean().default(true),

  // Insurance and Liability
  liabilityInsurance: z
    .string()
    .min(1, 'Liability insurance amount is required'),
  workersCompensation: z.boolean().default(true),
  bondingInsurance: z.boolean().default(false),
  propertyDamageProtection: z.boolean().default(true),

  // Warranties
  workmanshipWarranty: z.boolean().default(true),
  workmanshipWarrantyPeriod: z.string().optional(),
  materialWarranty: z.boolean().default(true),
  materialWarrantyPeriod: z.string().optional(),
  leakWarranty: z.boolean().default(true),

  // Weather Protection
  weatherProtection: z.boolean().default(true),
  tarpingPolicy: z.boolean().default(true),
  rainDamagePolicy: z.string().optional(),
  seasonalWork: z.boolean().default(false),

  // Safety Requirements
  safetyCompliance: z.boolean().default(true),
  oshaCompliance: z.boolean().default(true),
  safetyEquipment: z.boolean().default(true),
  accidentInsurance: z.boolean().default(true),

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

  // Quality Control
  qualityStandards: z.string().optional(),
  inspectionRights: z.boolean().default(true),
  correctionPolicy: z.boolean().default(true),
  finalInspection: z.boolean().default(true),

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

  // Environmental Considerations
  leadPaintDisclosure: z.boolean().default(false),
  asbestosDisclosure: z.boolean().default(false),
  environmentalCompliance: z.boolean().default(true),

  // Signatures
  ownerSignatureRequired: z.boolean().default(true),
  contractorSignatureRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
});
