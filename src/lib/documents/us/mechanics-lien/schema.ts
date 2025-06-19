// src/lib/documents/us/mechanics-lien/schema.ts
import { z } from 'zod';

export const MechanicsLienSchema = z.object({
  // Lien Claimant Information
  claimantName: z.string().min(1, 'Claimant name is required'),
  claimantAddress: z.string().min(1, 'Claimant address is required'),
  claimantPhone: z.string().min(1, 'Claimant phone is required'),
  claimantLicense: z.string().optional(),
  
  // Property Owner Information
  ownerName: z.string().min(1, 'Property owner name is required'),
  ownerAddress: z.string().min(1, 'Property owner address is required'),
  
  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyDescription: z.string().min(1, 'Property description is required'),
  propertyTaxId: z.string().optional(),
  legalDescription: z.string().optional(),
  county: z.string().min(1, 'County is required'),
  state: z.string().min(1, 'State is required'),
  
  // Work Performed
  workDescription: z.string().min(1, 'Work description is required'),
  workType: z.enum(['labor', 'materials', 'equipment', 'labor-and-materials', 'professional-services']),
  workStartDate: z.string().min(1, 'Work start date is required'),
  workEndDate: z.string().min(1, 'Work end date is required'),
  lastWorkDate: z.string().min(1, 'Last work performed date is required'),
  
  // Contract Information
  contractorName: z.string().optional(),
  contractDate: z.string().optional(),
  contractAmount: z.string().optional(),
  relationshipToOwner: z.enum(['direct-contract', 'subcontractor', 'sub-subcontractor', 'material-supplier']),
  
  // Financial Information
  totalAmountOwed: z.string().min(1, 'Total amount owed is required'),
  amountPaid: z.string().optional(),
  balanceDue: z.string().min(1, 'Balance due is required'),
  interestRate: z.string().optional(),
  
  // Lien Details
  lienAmount: z.string().min(1, 'Lien amount is required'),
  lienPriority: z.string().optional(),
  firstFurnishedDate: z.string().min(1, 'First furnished date is required'),
  lastFurnishedDate: z.string().min(1, 'Last furnished date is required'),
  
  // Notice Requirements
  preliminaryNoticeServed: z.boolean().default(false),
  preliminaryNoticeDate: z.string().optional(),
  demandForPaymentServed: z.boolean().default(false),
  demandForPaymentDate: z.string().optional(),
  
  // Legal Verification
  verificationStatement: z.boolean().default(true),
  claimantTitle: z.string().min(1, 'Claimant title/capacity is required'),
  notarizedAffidavit: z.boolean().default(true),
  
  // Filing Information
  filingDate: z.string().optional(),
  recordingOffice: z.string().optional(),
  filingFee: z.string().optional(),
  
  // Additional Claims
  additionalCosts: z.string().optional(),
  attorneyFees: z.boolean().default(false),
  courtCosts: z.boolean().default(false),
  prejudgmentInterest: z.boolean().default(false),
  
  // Supporting Documentation
  contractAttached: z.boolean().default(false),
  invoicesAttached: z.boolean().default(false),
  workOrdersAttached: z.boolean().default(false),
  photographsAttached: z.boolean().default(false),
  
  // Enforcement
  demandForPayment: z.boolean().default(true),
  paymentDeadline: z.string().optional(),
  foreclosureRights: z.boolean().default(true),
  
  // State-Specific Requirements
  stateSpecificRequirements: z.string().optional(),
  statuteCompliance: z.boolean().default(true),
  timelyFiling: z.boolean().default(true),
  
  // Signatures
  claimantSignatureRequired: z.boolean().default(true),
  notarizationRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
});