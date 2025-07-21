// src/lib/documents/us/sublease-agreement/schema.ts
import { z } from 'zod';

export const SubleaseAgreementSchema = z.object({
  // Original Landlord Information
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress: z.string().min(1, 'Landlord address is required'),

  // Original Tenant (Sublessor) Information
  sublessorName: z.string().min(1, 'Sublessor name is required'),
  sublessorAddress: z.string().min(1, 'Sublessor address is required'),
  sublessorPhone: z.string().optional(),
  sublessorEmail: z.string().email().optional(),

  // Subtenant Information
  subtenantName: z.string().min(1, 'Subtenant name is required'),
  subtenantAddress: z.string().min(1, 'Subtenant address is required'),
  subtenantPhone: z.string().optional(),
  subtenantEmail: z.string().email().optional(),

  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  unitDescription: z.string().optional(),

  // Original Lease Information
  originalLeaseDate: z.string().min(1, 'Original lease date is required'),
  originalLeaseEndDate: z
    .string()
    .min(1, 'Original lease end date is required'),
  landlordConsent: z.boolean().default(false),

  // Sublease Terms
  subleaseStartDate: z.string().min(1, 'Sublease start date is required'),
  subleaseEndDate: z.string().min(1, 'Sublease end date is required'),

  // Financial Terms
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  utilitiesIncluded: z.boolean().default(false),
  utilitiesDescription: z.string().optional(),
  rentDueDate: z.number().min(1).max(31, 'Rent due date must be between 1-31'),

  // Responsibilities
  maintenanceResponsibility: z.enum(['subtenant', 'sublessor', 'shared']),
  repairResponsibility: z.enum(['subtenant', 'sublessor', 'shared']),

  // Rules and Restrictions
  smokingAllowed: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  sublettingAllowed: z.boolean().default(false),

  // Additional Terms
  furnishedStatus: z.enum(['furnished', 'unfurnished', 'partially-furnished']),
  parkingIncluded: z.boolean().default(false),
  additionalTerms: z.string().optional(),

  // Signatures
  sublessorSignatureDate: z.string().optional(),
  subtenantSignatureDate: z.string().optional(),
});
