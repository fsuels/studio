// src/lib/documents/us/pet-custody-agreement/schema.ts
import { z } from 'zod';

export const PetCustodyAgreementSchema = z.object({
  // Party A Information
  partyAName: z.string().min(1, 'Party A name is required'),
  partyAAddress: z.string().min(1, 'Party A address is required'),
  partyAPhone: z.string().optional(),

  // Party B Information
  partyBName: z.string().min(1, 'Party B name is required'),
  partyBAddress: z.string().min(1, 'Party B address is required'),
  partyBPhone: z.string().optional(),

  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),

  // Pet Information
  petName: z.string().min(1, 'Pet name is required'),
  petType: z.enum([
    'dog',
    'cat',
    'bird',
    'fish',
    'reptile',
    'small-mammal',
    'horse',
    'other',
  ]),
  petBreed: z.string().optional(),
  petAge: z.string().optional(),
  petGender: z
    .enum(['male', 'female', 'neutered-male', 'spayed-female'])
    .optional(),
  petDescription: z.string().optional(),
  microchipNumber: z.string().optional(),
  registrationNumber: z.string().optional(),

  // Multiple Pets
  hasMultiplePets: z.boolean().default(false),
  additionalPets: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        breed: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .default([]),

  // Custody Arrangement
  custodyType: z.enum([
    'sole-custody',
    'joint-custody',
    'alternating-custody',
    'visitation-schedule',
  ]),
  primaryCustodian: z.enum(['party-a', 'party-b', 'shared']).optional(),

  // Schedule Details
  weekdaySchedule: z.string().optional(),
  weekendSchedule: z.string().optional(),
  holidaySchedule: z.string().optional(),
  vacationSchedule: z.string().optional(),

  // Specific Schedule
  scheduleDetails: z.string().optional(),
  pickupDropoffLocation: z.string().optional(),
  transportationResponsibility: z
    .enum(['party-a', 'party-b', 'alternating', 'mutual'])
    .optional(),

  // Financial Responsibilities
  veterinaryCosts: z.enum(['party-a', 'party-b', 'shared', 'proportional']),
  emergencyVetCosts: z.enum(['party-a', 'party-b', 'shared', 'proportional']),
  foodCosts: z.enum(['party-a', 'party-b', 'shared', 'custodian-pays']),
  groomingCosts: z.enum(['party-a', 'party-b', 'shared', 'custodian-pays']),

  // Pet Care Responsibilities
  feedingResponsibility: z.string().optional(),
  exerciseRequirements: z.string().optional(),
  groomingRequirements: z.string().optional(),
  medicationAdministration: z.string().optional(),

  // Veterinary Care
  primaryVeterinarian: z.string().optional(),
  vetContactInfo: z.string().optional(),
  medicalDecisionMaking: z.enum([
    'party-a',
    'party-b',
    'joint',
    'primary-custodian',
  ]),
  emergencyContact: z.string().optional(),

  // Pet Insurance
  petInsurance: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  insuranceResponsibility: z.enum(['party-a', 'party-b', 'shared']).optional(),

  // Living Conditions
  housingRequirements: z.string().optional(),
  yardRequirements: z.string().optional(),
  otherPetsAllowed: z.boolean().default(true),
  smokingRestrictions: z.boolean().default(false),

  // Travel and Relocation
  travelNotification: z.boolean().default(true),
  travelNotificationPeriod: z.string().optional(),
  relocationNotification: z.boolean().default(true),
  relocationRestrictions: z.string().optional(),

  // Communication
  communicationMethod: z
    .enum(['phone', 'email', 'text', 'app', 'written'])
    .optional(),
  updateRequirements: z.string().optional(),
  photoSharing: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),
  mediatorSelection: z.string().optional(),

  // Modification and Termination
  modificationClause: z.boolean().default(true),
  terminationConditions: z.array(z.string()).default([]),
  petRelinquishment: z
    .enum(['mutual-consent', 'court-decision', 'specified-conditions'])
    .optional(),

  // Emergency Situations
  emergencyProcedures: z.string().optional(),
  emergencyContactInfo: z.string().optional(),
  alternateCaregiver: z.string().optional(),

  // Death or Incapacity
  deathProvisions: z.string().optional(),
  incapacityProvisions: z.string().optional(),
  inheritanceArrangements: z.string().optional(),

  // Breeding and Reproduction
  breedingRestrictions: z.boolean().default(false),
  breedingConsent: z.boolean().default(false),
  offspringOwnership: z
    .enum(['party-a', 'party-b', 'shared', 'breeder'])
    .optional(),

  // Training and Behavior
  trainingRequirements: z.string().optional(),
  behaviorStandards: z.string().optional(),
  trainingCosts: z
    .enum(['party-a', 'party-b', 'shared', 'custodian-pays'])
    .optional(),

  // Legal Compliance
  licensingRequirements: z.boolean().default(true),
  vaccinationRequirements: z.boolean().default(true),
  localLawCompliance: z.boolean().default(true),

  // Additional Provisions
  specificNeeds: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  specialCareInstructions: z.string().optional(),

  // Signatures
  requirePartyASignature: z.boolean().default(true),
  requirePartyBSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
});
