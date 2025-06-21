// src/lib/documents/us/lease-amendment/schema.ts
import { z } from 'zod';

export const LeaseAmendmentSchema = z.object({
  // Original Lease Information
  originalLeaseDate: z.string().min(1, 'Original lease date is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),

  // Landlord Information
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress: z.string().min(1, 'Landlord address is required'),
  landlordPhone: z.string().optional(),
  landlordEmail: z.string().email().optional(),

  // Tenant Information
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantAddress: z.string().optional(),
  tenantPhone: z.string().optional(),
  tenantEmail: z.string().email().optional(),

  // Amendment Details
  amendmentDate: z.string().min(1, 'Amendment date is required'),
  amendmentNumber: z.number().default(1),
  amendmentType: z.enum([
    'rent-change',
    'term-extension',
    'term-modification',
    'add-provision',
    'remove-provision',
    'other',
  ]),

  // Rent Changes
  rentChange: z.boolean().default(false),
  currentRent: z.number().optional(),
  newRent: z.number().optional(),
  rentChangeEffectiveDate: z.string().optional(),
  rentChangeReason: z.string().optional(),

  // Term Changes
  termChange: z.boolean().default(false),
  currentLeaseEndDate: z.string().optional(),
  newLeaseEndDate: z.string().optional(),
  leaseExtension: z.boolean().default(false),
  extensionPeriod: z.string().optional(),

  // Security Deposit Changes
  securityDepositChange: z.boolean().default(false),
  currentSecurityDeposit: z.number().optional(),
  newSecurityDeposit: z.number().optional(),
  additionalDepositRequired: z.number().optional(),
  depositRefundAmount: z.number().optional(),

  // Occupancy Changes
  occupancyChange: z.boolean().default(false),
  additionalOccupants: z.array(z.string()).default([]),
  removedOccupants: z.array(z.string()).default([]),
  occupancyLimitChange: z.number().optional(),

  // Pet Provisions
  petProvisionChange: z.boolean().default(false),
  petsAllowed: z.boolean().optional(),
  petDeposit: z.number().optional(),
  petRent: z.number().optional(),
  petRestrictions: z.string().optional(),

  // Utility Changes
  utilityChange: z.boolean().default(false),
  utilitiesIncluded: z.array(z.string()).default([]),
  utilitiesExcluded: z.array(z.string()).default([]),
  utilityResponsibilityChange: z.string().optional(),

  // Maintenance and Repairs
  maintenanceChange: z.boolean().default(false),
  landlordResponsibilities: z.array(z.string()).default([]),
  tenantResponsibilities: z.array(z.string()).default([]),
  maintenanceDetails: z.string().optional(),

  // Parking Changes
  parkingChange: z.boolean().default(false),
  parkingSpacesIncluded: z.number().optional(),
  parkingFee: z.number().optional(),
  parkingLocation: z.string().optional(),

  // Use and Occupancy
  useChange: z.boolean().default(false),
  permittedUse: z.string().optional(),
  businessUseAllowed: z.boolean().optional(),
  smokingPolicy: z
    .enum(['allowed', 'prohibited', 'designated-areas'])
    .optional(),

  // Late Fee Changes
  lateFeeChange: z.boolean().default(false),
  lateFeeAmount: z.number().optional(),
  lateFeeGracePeriod: z.number().optional(),
  lateFeeStructure: z.string().optional(),

  // Additional Provisions
  addedProvisions: z.array(z.string()).default([]),
  removedProvisions: z.array(z.string()).default([]),
  modifiedProvisions: z
    .array(
      z.object({
        provision: z.string(),
        oldText: z.string(),
        newText: z.string(),
      }),
    )
    .default([]),

  // Special Conditions
  specialConditions: z.string().optional(),
  temporaryChanges: z.boolean().default(false),
  temporaryChangeDuration: z.string().optional(),

  // Legal Provisions
  governingState: z.string().min(1, 'Governing state is required'),
  originalLeaseRemainValid: z.boolean().default(true),
  conflictResolution: z.string().optional(),

  // Effective Date and Duration
  effectiveDate: z.string().min(1, 'Effective date is required'),
  amendmentDuration: z.enum(['permanent', 'temporary']).default('permanent'),
  temporaryEndDate: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  otherChanges: z.string().optional(),

  // Signatures
  landlordSignatureDate: z.string().optional(),
  tenantSignatureDate: z.string().optional(),
  witnessRequired: z.boolean().default(false),
  witnessName: z.string().optional(),
  witnessSignatureDate: z.string().optional(),
});
