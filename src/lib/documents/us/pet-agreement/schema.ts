// src/lib/documents/us/pet-agreement/schema.ts
import { z } from 'zod';

export const PetAgreementSchema = z.object({
  // Parties
  landlordName: z.string().min(1, 'Landlord name is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),

  // Original Lease Information
  originalLeaseDate: z.string().min(1, 'Original lease date is required'),

  // Pet Information
  petName: z.string().min(1, 'Pet name is required'),
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
  petAge: z.string().optional(),
  petWeight: z.string().optional(),
  petColor: z.string().optional(),
  petGender: z.enum(['male', 'female', 'unknown']).optional(),

  // Additional Pets
  hasAdditionalPets: z.boolean().default(false),
  additionalPets: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        breed: z.string().optional(),
        age: z.string().optional(),
      }),
    )
    .default([]),

  // Pet Documentation
  hasVaccinations: z.boolean().default(false),
  hasSpayNeuter: z.boolean().default(false),
  hasLicense: z.boolean().default(false),
  hasMicrochip: z.boolean().default(false),

  // Financial Terms
  petDeposit: z.number().min(0, 'Pet deposit cannot be negative'),
  petFee: z.number().min(0, 'Pet fee cannot be negative'),
  monthlyPetRent: z.number().min(0, 'Monthly pet rent cannot be negative'),

  // Pet Rules
  allowedAreas: z.array(z.string()).default([]),
  restrictedAreas: z.array(z.string()).default([]),
  petCareRequirements: z.string().optional(),
  noiseRestrictions: z.string().optional(),

  // Damage and Liability
  damageResponsibility: z.string().optional(),
  liabilityInsurance: z.boolean().default(false),
  insuranceAmount: z.number().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),

  // Signatures
  landlordSignatureDate: z.string().optional(),
  tenantSignatureDate: z.string().optional(),
});
