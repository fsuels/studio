// src/lib/documents/us/cohabitation-agreement/schema.ts
import { z } from 'zod';

export const CohabitationAgreementSchema = z.object({
  // Partner 1 Information
  partner1Name: z.string().min(1, 'Partner 1 name is required'),
  partner1Address: z.string().min(1, 'Partner 1 address is required'),
  partner1Phone: z.string().optional(),
  partner1Email: z.string().email().optional(),
  partner1Occupation: z.string().optional(),
  partner1DateOfBirth: z.string().optional(),

  // Partner 2 Information
  partner2Name: z.string().min(1, 'Partner 2 name is required'),
  partner2Address: z.string().min(1, 'Partner 2 address is required'),
  partner2Phone: z.string().optional(),
  partner2Email: z.string().email().optional(),
  partner2Occupation: z.string().optional(),
  partner2DateOfBirth: z.string().optional(),

  // Relationship Information
  relationshipStartDate: z
    .string()
    .min(1, 'Relationship start date is required'),
  cohabitationStartDate: z
    .string()
    .min(1, 'Cohabitation start date is required'),
  sharedResidenceAddress: z
    .string()
    .min(1, 'Shared residence address is required'),

  // Financial Arrangements
  separateProperty: z.boolean().default(true),
  sharedExpenses: z.boolean().default(true),
  expenseSharingMethod: z
    .enum(['equal', 'proportional-income', 'other'])
    .default('equal'),
  expenseSharingDetails: z.string().optional(),
  jointBankAccount: z.boolean().default(false),
  jointBankAccountDetails: z.string().optional(),

  // Property Ownership
  realEstateOwnership: z
    .enum(['separate', 'joint', 'none'])
    .default('separate'),
  realEstateDetails: z.string().optional(),
  personalPropertySeparate: z.boolean().default(true),
  jointPurchasesHandling: z.string().optional(),

  // Debt Responsibility
  priorDebtsResponsibility: z.enum(['separate', 'shared']).default('separate'),
  futureDebtsResponsibility: z.enum(['separate', 'shared']).default('separate'),
  debtDetails: z.string().optional(),

  // Support and Maintenance
  financialSupport: z.boolean().default(false),
  supportAmount: z.number().optional(),
  supportDuration: z.string().optional(),
  supportDetails: z.string().optional(),

  // Children
  existingChildren: z.boolean().default(false),
  existingChildrenDetails: z.string().optional(),
  futureChildren: z.boolean().default(false),
  futureChildrenDetails: z.string().optional(),
  childSupportArrangements: z.string().optional(),

  // Healthcare and Medical
  healthInsurance: z
    .enum(['separate', 'shared', 'one-covers-both'])
    .default('separate'),
  healthInsuranceDetails: z.string().optional(),
  medicalDecisionMaking: z.boolean().default(false),
  medicalPowerOfAttorney: z.boolean().default(false),

  // Termination of Relationship
  terminationNotice: z.number().default(30),
  terminationProcedure: z.string().optional(),
  propertyDivision: z.string().optional(),
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),

  // Other Provisions
  inheritanceRights: z.boolean().default(false),
  inheritanceDetails: z.string().optional(),
  socialSecurityBenefits: z.boolean().default(false),
  retirementBenefits: z.boolean().default(false),
  beneficiaryDesignations: z.string().optional(),

  // Legal Provisions
  governingState: z.string().min(1, 'Governing state is required'),
  severabilityClause: z.boolean().default(true),
  entireAgreementClause: z.boolean().default(true),
  modificationRequirements: z
    .enum(['written', 'verbal', 'notarized'])
    .default('written'),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialProvisions: z.string().optional(),

  // Signatures
  partner1SignatureDate: z.string().optional(),
  partner2SignatureDate: z.string().optional(),
  witnessRequired: z.boolean().default(false),
  witnessName: z.string().optional(),
  witnessSignatureDate: z.string().optional(),
});
