// src/lib/documents/us/dog-breeding-agreement/schema.ts
import { z } from 'zod';

export const DogBreedingAgreementSchema = z.object({
  // Stud Owner Information
  studOwnerName: z.string().min(1, 'Stud owner name is required'),
  studOwnerAddress: z.string().optional(),
  studOwnerPhone: z.string().optional(),
  studOwnerEmail: z.string().email().optional(),
  studOwnerKennelName: z.string().optional(),
  
  // Bitch Owner Information
  bitchOwnerName: z.string().min(1, 'Bitch owner name is required'),
  bitchOwnerAddress: z.string().optional(),
  bitchOwnerPhone: z.string().optional(),
  bitchOwnerEmail: z.string().email().optional(),
  bitchOwnerKennelName: z.string().optional(),
  
  // Stud Dog Information
  studName: z.string().min(1, 'Stud name is required'),
  studBreed: z.string().optional(),
  studRegistrationNumber: z.string().optional(),
  studDateOfBirth: z.string().optional(),
  studColor: z.string().optional(),
  studWeight: z.string().optional(),
  studSire: z.string().optional(),
  studDam: z.string().optional(),
  
  // Bitch Information
  bitchName: z.string().min(1, 'Bitch name is required'),
  bitchBreed: z.string().optional(),
  bitchRegistrationNumber: z.string().optional(),
  bitchDateOfBirth: z.string().optional(),
  bitchColor: z.string().optional(),
  bitchWeight: z.string().optional(),
  bitchSire: z.string().optional(),
  bitchDam: z.string().optional(),
  
  // Health Certifications
  studHealthCertificates: z.string().optional(),
  studVaccinations: z.boolean().default(true),
  studHealthGuarantee: z.boolean().default(true),
  bitchHealthCertificates: z.string().optional(),
  bitchVaccinations: z.boolean().default(true),
  bitchHealthGuarantee: z.boolean().default(true),
  
  // Breeding Terms
  breedingMethod: z.enum(['natural', 'artificial-insemination', 'either']).default('natural'),
  numberOfBreedings: z.string().optional(),
  breedingDates: z.string().optional(),
  locationOfBreeding: z.string().optional(),
  supervisionRequired: z.boolean().default(true),
  
  // Financial Terms
  studFee: z.string().optional(),
  paymentTerms: z.enum(['upfront', 'on-confirmation', 'on-whelping', 'pick-of-litter']).default('upfront'),
  additionalCharges: z.string().optional(),
  boardingFees: z.string().optional(),
  veterinaryFees: z.string().optional(),
  
  // Litter Terms
  expectedLitterSize: z.string().optional(),
  pickOfLitter: z.boolean().default(false),
  pickOrder: z.string().optional(),
  litterRegistration: z.boolean().default(true),
  registrationResponsibility: z.enum(['stud-owner', 'bitch-owner', 'shared']).default('bitch-owner'),
  
  // Puppy Distribution
  puppyPricing: z.string().optional(),
  salesRestrictions: z.string().optional(),
  breedingRights: z.enum(['full', 'limited', 'none']).default('limited'),
  spayNeuterRequirements: z.string().optional(),
  
  // Health Guarantees
  puppyHealthGuarantee: z.string().optional(),
  geneticHealthGuarantee: z.string().optional(),
  healthTestingRequired: z.string().optional(),
  replacementPolicy: z.string().optional(),
  healthWarrantyPeriod: z.string().optional(),
  
  // Care Requirements
  pregnancyCare: z.string().optional(),
  whelpingAssistance: z.boolean().default(false),
  veterinaryCare: z.string().optional(),
  nutritionRequirements: z.string().optional(),
  exerciseRestrictions: z.string().optional(),
  
  // Documentation
  pedigreeProvided: z.boolean().default(true),
  registrationPapers: z.boolean().default(true),
  healthRecords: z.boolean().default(true),
  vaccinationRecords: z.boolean().default(true),
  photographyRights: z.boolean().default(false),
  
  // Breeding Rights
  futureBreedingRights: z.boolean().default(false),
  exclusiveBreedingRights: z.boolean().default(false),
  territorialRestrictions: z.string().optional(),
  competitorRestrictions: z.boolean().default(false),
  
  // Insurance and Liability
  breedingInsurance: z.boolean().default(false),
  mortalityInsurance: z.boolean().default(false),
  liabilityInsurance: z.boolean().default(false),
  studOwnerLiability: z.string().optional(),
  bitchOwnerLiability: z.string().optional(),
  
  // Failure to Conceive
  failureToConceivePolicy: z.string().optional(),
  returnService: z.boolean().default(true),
  refundPolicy: z.string().optional(),
  testingForPregnancy: z.string().optional(),
  
  // Show and Competition
  showRequirements: z.string().optional(),
  competitionRestrictions: z.string().optional(),
  titleRequirements: z.string().optional(),
  conformationStandards: z.string().optional(),
  
  // Contract Duration
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  breedingDeadline: z.string().optional(),
  optionPeriod: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['discussion', 'mediation', 'arbitration', 'court']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  expertsConsultation: z.boolean().default(false),
  
  // Special Conditions
  specialRequirements: z.string().optional(),
  environmentalRequirements: z.string().optional(),
  supervisionRequirements: z.string().optional(),
  contingencyPlans: z.string().optional(),
  
  // Signature Requirements
  requireStudOwnerSignature: z.boolean().default(true),
  requireBitchOwnerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});