// src/lib/documents/us/agricultural-agreement/schema.ts
import { z } from 'zod';

export const AgriculturalAgreementSchema = z.object({
  // Landowner Information
  landownerName: z.string().min(1, 'Landowner name is required'),
  landownerAddress: z.string().min(1, 'Landowner address is required'),
  landownerPhone: z.string().optional(),
  landownerEmail: z.string().email().optional(),

  // Farmer/Operator Information
  farmerName: z.string().min(1, 'Farmer name is required'),
  farmerAddress: z.string().min(1, 'Farmer address is required'),
  farmerPhone: z.string().optional(),
  farmerEmail: z.string().email().optional(),
  farmingExperience: z.string().optional(),

  // Property Details
  propertyDescription: z.string().min(1, 'Property description is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  totalAcreage: z.string().optional(),
  farmableAcreage: z.string().optional(),
  soilType: z.string().optional(),

  // Agreement Type
  agreementType: z
    .enum([
      'cash-rent',
      'crop-share',
      'livestock-share',
      'custom-farming',
      'grazing',
    ])
    .default('cash-rent'),
  farmingPurpose: z.string().optional(),
  cropsToBeGrown: z.array(z.string()).default([]),
  livestockType: z.string().optional(),

  // Financial Terms
  rentAmount: z.string().optional(),
  paymentSchedule: z
    .enum(['annual', 'semi-annual', 'quarterly', 'monthly'])
    .optional(),
  cropSharePercentage: z.string().optional(),
  expenseSharing: z.string().optional(),

  // Term and Duration
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  leaseTerm: z.string().optional(),
  renewalOptions: z.boolean().default(false),

  // Farming Practices
  organicFarming: z.boolean().default(false),
  pesticideUse: z.boolean().default(false),
  fertilizerUse: z.boolean().default(false),
  cropRotation: z.string().optional(),
  conservationPractices: z.string().optional(),

  // Equipment and Infrastructure
  equipmentProvided: z.boolean().default(false),
  equipmentList: z.string().optional(),
  buildingAccess: z.boolean().default(false),
  irrigationRights: z.boolean().default(false),
  storageRights: z.boolean().default(false),

  // Responsibilities
  farmerResponsibilities: z.string().optional(),
  landownerResponsibilities: z.string().optional(),
  maintenanceResponsibilities: z.string().optional(),
  harvestingRights: z.string().optional(),

  // Insurance and Liability
  cropInsurance: z.boolean().default(false),
  liabilityInsurance: z.boolean().default(false),
  propertyInsurance: z.boolean().default(false),

  // Environmental Compliance
  environmentalRegulations: z.boolean().default(true),
  waterRights: z.string().optional(),
  drainageRights: z.string().optional(),
  erosionControl: z.boolean().default(false),

  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  cropDisposition: z.string().optional(),

  // Signature Requirements
  requireLandownerSignature: z.boolean().default(true),
  requireFarmerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
