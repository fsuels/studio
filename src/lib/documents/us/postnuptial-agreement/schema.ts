// src/lib/documents/us/postnuptial-agreement/schema.ts
import { z } from 'zod';

export const PostnuptialAgreementSchema = z.object({
  // Spouse Information
  spouse1Name: z.string().min(1, 'First spouse name is required'),
  spouse1Address: z.string().optional(),
  spouse1Phone: z.string().optional(),
  spouse1Email: z.string().email().optional(),
  spouse1Occupation: z.string().optional(),
  spouse1Income: z.string().optional(),

  spouse2Name: z.string().min(1, 'Second spouse name is required'),
  spouse2Address: z.string().optional(),
  spouse2Phone: z.string().optional(),
  spouse2Email: z.string().email().optional(),
  spouse2Occupation: z.string().optional(),
  spouse2Income: z.string().optional(),

  // Marriage Information
  marriageDate: z.string().optional(),
  marriageLocation: z.string().optional(),
  marriageCertificateNumber: z.string().optional(),

  // Current Assets
  realEstate: z.string().optional(),
  bankAccounts: z.string().optional(),
  investments: z.string().optional(),
  retirementAccounts: z.string().optional(),
  personalProperty: z.string().optional(),
  vehicles: z.string().optional(),

  // Current Debts
  mortgages: z.string().optional(),
  creditCardDebt: z.string().optional(),
  studentLoans: z.string().optional(),
  otherDebts: z.string().optional(),

  // Property Division
  separateProperty: z.string().optional(),
  maritalProperty: z.string().optional(),
  futureAcquisitions: z
    .enum(['separate', 'marital', 'as-titled'])
    .default('marital'),
  inheritances: z.enum(['separate', 'marital']).default('separate'),
  gifts: z.enum(['separate', 'marital']).default('separate'),

  // Spousal Support
  spousalSupportWaiver: z.boolean().default(false),
  spousalSupportAmount: z.string().optional(),
  spousalSupportDuration: z.string().optional(),
  modificationRights: z.boolean().default(true),

  // Children and Support
  childrenFromMarriage: z.boolean().default(false),
  childrenNames: z.string().optional(),
  childSupportArrangements: z.string().optional(),
  childCustodyArrangements: z.string().optional(),

  // Business Interests
  businessOwnership: z.string().optional(),
  businessValuation: z.string().optional(),
  businessManagement: z.string().optional(),
  businessIncome: z.enum(['separate', 'marital']).default('marital'),

  // Life Insurance
  lifeInsuranceBeneficiaries: z.string().optional(),
  lifeInsuranceAmounts: z.string().optional(),
  lifeInsuranceRequirements: z.boolean().default(false),

  // Retirement Benefits
  retirementBenefits: z.string().optional(),
  pensionRights: z.string().optional(),
  socialSecurityBenefits: z.enum(['separate', 'shared']).default('separate'),

  // Tax Obligations
  taxFilingStatus: z.enum(['joint', 'separate']).default('joint'),
  taxLiabilities: z.enum(['shared', 'separate']).default('shared'),
  taxRefunds: z.enum(['shared', 'separate']).default('shared'),

  // Estate Planning
  willProvisions: z.string().optional(),
  estateBeneficiaries: z.string().optional(),
  trustArrangements: z.string().optional(),
  powerOfAttorney: z.boolean().default(false),

  // Modification and Termination
  modificationRequirements: z.string().optional(),
  terminationConditions: z.string().optional(),
  divorceProcedures: z.string().optional(),

  // Disclosure Requirements
  fullDisclosure: z.boolean().default(true),
  financialStatements: z.boolean().default(true),
  independentCounsel: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Special Provisions
  lifestyle: z.string().optional(),
  personalConduct: z.string().optional(),
  religiousMatters: z.string().optional(),
  socialMedia: z.string().optional(),

  // Legal Representation
  independentLegalCounsel: z.boolean().default(false),
  voluntaryExecution: z.boolean().default(true),
  duressAbsence: z.boolean().default(true),

  // Signature Requirements
  spouse1Signature: z.boolean().default(true),
  spouse2Signature: z.boolean().default(true),
  witnessSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
