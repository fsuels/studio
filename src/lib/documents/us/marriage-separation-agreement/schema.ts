// src/lib/documents/us/marriage-separation-agreement/schema.ts
import { z } from 'zod';

export const MarriageSeparationAgreementSchema = z.object({
  // Spouse Information
  spouse1Name: z.string().min(1, 'First spouse name is required'),
  spouse1Address: z.string().optional(),
  spouse1Phone: z.string().optional(),
  spouse1Email: z.string().email().optional(),
  spouse1NewAddress: z.string().optional(),

  spouse2Name: z.string().min(1, 'Second spouse name is required'),
  spouse2Address: z.string().optional(),
  spouse2Phone: z.string().optional(),
  spouse2Email: z.string().email().optional(),
  spouse2NewAddress: z.string().optional(),

  // Marriage Information
  marriageDate: z.string().optional(),
  marriageLocation: z.string().optional(),
  separationDate: z.string().optional(),
  separationReason: z.string().optional(),

  // Children Information
  minorChildren: z.boolean().default(false),
  childrenNumber: z.string().optional(),
  childrenNames: z.string().optional(),
  childrenAges: z.string().optional(),
  childrenBirthDates: z.string().optional(),

  // Child Custody
  legalCustody: z.enum(['joint', 'spouse1', 'spouse2']).default('joint'),
  physicalCustody: z.enum(['joint', 'spouse1', 'spouse2']).default('joint'),
  custodySchedule: z.string().optional(),
  holidaySchedule: z.string().optional(),
  vacationSchedule: z.string().optional(),
  schoolDecisions: z.enum(['joint', 'primary-parent']).default('joint'),

  // Child Support
  childSupportPayer: z.enum(['spouse1', 'spouse2', 'none']).optional(),
  childSupportAmount: z.string().optional(),
  childSupportFrequency: z
    .enum(['weekly', 'bi-weekly', 'monthly'])
    .default('monthly'),
  childSupportDuration: z.string().optional(),
  childSupportModification: z.boolean().default(true),

  // Healthcare and Insurance
  healthInsuranceProvider: z.enum(['spouse1', 'spouse2', 'both']).optional(),
  healthInsuranceCosts: z
    .enum(['shared', 'spouse1', 'spouse2'])
    .default('shared'),
  medicalExpenses: z.enum(['shared', 'spouse1', 'spouse2']).default('shared'),
  lifeInsurance: z.boolean().default(false),
  lifeInsuranceBeneficiary: z.string().optional(),

  // Spousal Support
  spousalSupport: z.boolean().default(false),
  spousalSupportPayer: z.enum(['spouse1', 'spouse2']).optional(),
  spousalSupportAmount: z.string().optional(),
  spousalSupportDuration: z.string().optional(),
  spousalSupportModification: z.boolean().default(true),
  spousalSupportTermination: z.string().optional(),

  // Property Division
  maritalHome: z.enum(['spouse1', 'spouse2', 'sell', 'joint']).optional(),
  homeEquity: z.string().optional(),
  householdGoods: z.string().optional(),
  vehicles: z.string().optional(),
  bankAccounts: z.string().optional(),
  investments: z.string().optional(),
  retirementAccounts: z.string().optional(),

  // Debt Division
  jointDebts: z.string().optional(),
  creditCardDebt: z.string().optional(),
  mortgageDebt: z.string().optional(),
  studentLoans: z.string().optional(),
  otherDebts: z.string().optional(),
  debtResponsibility: z
    .enum(['shared', 'separate', 'proportional'])
    .default('separate'),

  // Living Arrangements
  separateResidences: z.boolean().default(true),
  temporaryResidence: z.string().optional(),
  homeOccupancy: z.enum(['spouse1', 'spouse2', 'alternate']).optional(),
  movingExpenses: z.enum(['self', 'shared']).default('self'),

  // Financial Obligations
  jointTaxReturns: z.boolean().default(false),
  taxLiabilities: z.enum(['shared', 'separate']).default('separate'),
  taxRefunds: z.enum(['shared', 'separate']).default('separate'),
  separateAccounts: z.boolean().default(true),
  creditCardClosure: z.boolean().default(true),

  // Communication and Conduct
  nonInterference: z.boolean().default(true),
  communicationMethods: z.string().optional(),
  parentingCommunication: z.string().optional(),
  socialMediaRestrictions: z.boolean().default(false),
  newRelationships: z.boolean().default(true),

  // Legal Matters
  noMolestation: z.boolean().default(true),
  restrainingOrders: z.boolean().default(false),
  legalSeparation: z.boolean().default(false),
  divorceProceedingStay: z.boolean().default(false),

  // Education and Activities
  childEducationCosts: z
    .enum(['shared', 'spouse1', 'spouse2'])
    .default('shared'),
  extracurricularActivities: z
    .enum(['shared', 'spouse1', 'spouse2'])
    .default('shared'),
  collegeExpenses: z
    .enum(['shared', 'spouse1', 'spouse2', 'not-covered'])
    .default('shared'),

  // Modification and Review
  modificationRequirements: z.string().optional(),
  annualReview: z.boolean().default(false),
  mediationRequirement: z.boolean().default(true),
  courtApproval: z.boolean().default(false),

  // Reconciliation
  reconciliationAttempts: z.boolean().default(false),
  counselingRequirement: z.boolean().default(false),
  reconciliationTerms: z.string().optional(),

  // Death and Disability
  deathProvisions: z.string().optional(),
  disabilityProvisions: z.string().optional(),
  estateRights: z.enum(['waived', 'retained']).default('waived'),

  // Business Interests
  businessOwnership: z.string().optional(),
  businessOperation: z.enum(['joint', 'spouse1', 'spouse2']).optional(),
  businessIncome: z.enum(['shared', 'owner']).default('owner'),

  // Pets and Animals
  petCustody: z.string().optional(),
  petExpenses: z.enum(['shared', 'custodian']).default('custodian'),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Legal Representation
  independentCounsel: z.boolean().default(false),
  legalFeesResponsibility: z.enum(['own', 'shared']).default('own'),

  // Signature Requirements
  spouse1Signature: z.boolean().default(true),
  spouse2Signature: z.boolean().default(true),
  witnessSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
