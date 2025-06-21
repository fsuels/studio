// src/lib/documents/us/pet-addendum/schema.ts
import { z } from 'zod';

export const PetAddendumSchema = z.object({
  // Original Lease Information
  originalLeaseDate: z.string().min(1, 'Original lease date is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),

  // Landlord Information
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress: z.string().min(1, 'Landlord address is required'),

  // Tenant Information
  tenantName: z.string().min(1, 'Tenant name is required'),

  // Pet Information
  petType: z.enum([
    'dog',
    'cat',
    'bird',
    'fish',
    'reptile',
    'small-mammal',
    'other',
  ]),
  petBreed: z.string().optional(),
  petName: z.string().min(1, 'Pet name is required'),
  petAge: z.number().min(0, 'Pet age must be positive'),
  petWeight: z.number().min(0, 'Pet weight must be positive'),
  petColor: z.string().optional(),
  petDescription: z.string().optional(),

  // Pet Documentation
  vaccinationsCurrent: z.boolean().default(false),
  vaccinationExpiryDate: z.string().optional(),
  spayedNeutered: z.boolean().default(false),
  microchipped: z.boolean().default(false),
  microchipNumber: z.string().optional(),

  // Pet Restrictions
  petDeposit: z.number().min(0, 'Pet deposit cannot be negative'),
  petRent: z.number().min(0, 'Pet rent cannot be negative'),
  maximumPets: z.number().default(1),
  petSizeLimit: z.number().optional(),
  restrictedBreeds: z.array(z.string()).default([]),

  // Pet Rules
  petAreas: z.array(z.string()).default([]),
  leashedInCommonAreas: z.boolean().default(true),
  ownerSupervisionRequired: z.boolean().default(true),
  noiseRestrictions: z.string().optional(),
  wasteCleanupRequired: z.boolean().default(true),

  // Liability and Insurance
  petLiabilityInsurance: z.boolean().default(false),
  insuranceAmount: z.number().optional(),
  ownerLiability: z.boolean().default(true),

  // Additional Terms
  petGroomingRequirements: z.string().optional(),
  petDamageResponsibility: z.string().optional(),
  petRemovalClause: z.boolean().default(true),
  additionalPetTerms: z.string().optional(),

  // Legal
  addendumDate: z.string().min(1, 'Addendum date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),

  // Signatures
  landlordSignatureDate: z.string().optional(),
  tenantSignatureDate: z.string().optional(),
});
