// src/lib/documents/us/security-agreement/schema.ts
import { z } from 'zod';

export const SecurityAgreementSchema = z.object({
  // Secured Party Information
  securedPartyName: z.string().min(1, 'Secured party name is required'),
  securedPartyAddress: z.string().min(1, 'Secured party address is required'),
  securedPartyType: z.enum(['individual', 'corporation', 'partnership', 'llc', 'other']),
  
  // Debtor Information
  debtorName: z.string().min(1, 'Debtor name is required'),
  debtorAddress: z.string().min(1, 'Debtor address is required'),
  debtorType: z.enum(['individual', 'corporation', 'partnership', 'llc', 'other']),
  debtorSSN: z.string().optional(),
  debtorEIN: z.string().optional(),
  
  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  
  // Secured Obligation
  securedDebtAmount: z.string().min(1, 'Secured debt amount is required'),
  securedDebtDescription: z.string().min(1, 'Description of secured debt is required'),
  maxSecuredAmount: z.string().optional(),
  interestRate: z.string().optional(),
  
  // Collateral Description
  collateralType: z.enum(['goods', 'equipment', 'inventory', 'accounts', 'instruments', 'documents', 'chattel-paper', 'general-intangibles', 'investment-property', 'other']),
  collateralDescription: z.string().min(1, 'Collateral description is required'),
  collateralLocation: z.string().min(1, 'Collateral location is required'),
  serialNumbers: z.array(z.string()).default([]),
  
  // Future Advances
  futureAdvances: z.boolean().default(false),
  maxFutureAdvances: z.string().optional(),
  
  // After-Acquired Property
  afterAcquiredProperty: z.boolean().default(false),
  afterAcquiredDescription: z.string().optional(),
  
  // Proceeds
  proceedsCoverage: z.boolean().default(true),
  proceedsDescription: z.string().optional(),
  
  // Debtor Covenants
  debtorCovenants: z.object({
    maintainCollateral: z.boolean().default(true),
    insuranceRequired: z.boolean().default(true),
    notifyChanges: z.boolean().default(true),
    prohibitSale: z.boolean().default(true),
    prohibitEncumbrance: z.boolean().default(true),
    allowInspection: z.boolean().default(true),
  }),
  
  // Insurance Requirements
  insuranceAmount: z.string().optional(),
  insuranceBeneficiary: z.string().optional(),
  insuranceType: z.array(z.string()).default([]),
  
  // Default Provisions
  eventsOfDefault: z.array(z.string()).default([]),
  curePeriod: z.string().optional(),
  defaultNotice: z.boolean().default(true),
  
  // Remedies Upon Default
  rightToTake: z.boolean().default(true),
  rightToSell: z.boolean().default(true),
  rightToOperate: z.boolean().default(false),
  commerciallyReasonable: z.boolean().default(true),
  
  // Notice Requirements
  dispositionNotice: z.boolean().default(true),
  noticeMethod: z.enum(['mail', 'email', 'personal-delivery']).default('mail'),
  noticePeriod: z.string().optional(),
  
  // UCC Filing
  uccFilingAuthorized: z.boolean().default(true),
  uccFilingState: z.string().optional(),
  continuationRequired: z.boolean().default(true),
  
  // Transfer and Assignment
  assignmentAllowed: z.boolean().default(true),
  transferRestrictions: z.string().optional(),
  
  // Jurisdiction and Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  waiveJuryTrial: z.boolean().default(false),
  
  // Attorney Fees
  attorneyFees: z.boolean().default(true),
  reasonableExpenses: z.boolean().default(true),
  
  // Miscellaneous
  entireAgreement: z.boolean().default(true),
  severability: z.boolean().default(true),
  bindingEffect: z.boolean().default(true),
  
  // Termination
  terminationConditions: z.string().optional(),
  releaseOfLien: z.boolean().default(true),
  
  // Signatures and Notarization
  requireDebtorSignature: z.boolean().default(true),
  requireSecuredPartySignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
});