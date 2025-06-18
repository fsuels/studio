// src/lib/documents/us/lease-renewal-agreement/schema.ts
import { z } from 'zod';

export const LeaseRenewalAgreementSchema = z.object({
  // Original Lease Information
  originalLeaseDate: z.string().min(1, 'Original lease date is required'),
  originalLeaseEndDate: z.string().min(1, 'Original lease end date is required'),
  
  // Parties
  landlordName: z.string().min(1, 'Landlord name is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  
  // Renewal Terms
  renewalStartDate: z.string().min(1, 'Renewal start date is required'),
  renewalEndDate: z.string().min(1, 'Renewal end date is required'),
  renewalTerm: z.string().min(1, 'Renewal term is required'),
  
  // Financial Terms
  newMonthlyRent: z.number().positive('Monthly rent must be positive'),
  rentIncreaseAmount: z.number().min(0, 'Rent increase cannot be negative'),
  rentIncreasePercentage: z.number().min(0, 'Rent increase percentage cannot be negative'),
  newSecurityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  
  // Terms Changes
  termsRemainSame: z.boolean().default(true),
  modifiedTerms: z.string().optional(),
  additionalTerms: z.string().optional(),
  
  // Signatures
  landlordSignatureDate: z.string().optional(),
  tenantSignatureDate: z.string().optional(),
});