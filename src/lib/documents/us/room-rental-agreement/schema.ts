// src/lib/documents/us/room-rental-agreement/schema.ts
import { z } from 'zod';

export const RoomRentalAgreementSchema = z.object({
  // Landlord Information
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress: z.string().min(1, 'Landlord address is required'),
  landlordPhone: z.string().optional(),
  landlordEmail: z.string().email().optional(),

  // Tenant Information
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantPhone: z.string().optional(),
  tenantEmail: z.string().email().optional(),

  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  roomDescription: z.string().min(1, 'Room description is required'),
  furnishedStatus: z.enum(['furnished', 'unfurnished', 'partially-furnished']),

  // Lease Terms
  leaseStartDate: z.string().min(1, 'Lease start date is required'),
  leaseEndDate: z.string().optional(),
  monthToMonth: z.boolean().default(false),

  // Financial Terms
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  utilitiesIncluded: z.boolean().default(false),
  utilitiesDescription: z.string().optional(),

  // Shared Areas
  sharedAreas: z.array(z.string()).default([]),
  kitchenAccess: z.boolean().default(true),
  bathroomAccess: z.boolean().default(true),
  livingRoomAccess: z.boolean().default(true),

  // House Rules
  smokingAllowed: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  guestsAllowed: z.boolean().default(true),
  quietHours: z.string().optional(),

  // Additional Terms
  parkingIncluded: z.boolean().default(false),
  internetIncluded: z.boolean().default(false),
  additionalTerms: z.string().optional(),

  // Signatures
  landlordSignatureDate: z.string().optional(),
  tenantSignatureDate: z.string().optional(),
});
