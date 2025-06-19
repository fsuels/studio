// src/lib/documents/us/mechanics-lien-waiver/schema.ts
import { z } from 'zod';

export const mechanicslienwaiverSchema = z.object({
  // Waiver Information
  waiverType: z.enum(['partial', 'final', 'conditional', 'unconditional']),
  waiverDate: z.string().min(1, 'Waiver date is required'),
  effectiveDate: z.string().optional(),
  
  // Claimant Information
  claimantName: z.string().min(1, 'Claimant name is required'),
  claimantAddress: z.string().min(1, 'Claimant address is required'),
  claimantPhone: z.string().optional(),
  claimantEmail: z.string().email().optional(),
  claimantCapacity: z.enum(['contractor', 'subcontractor', 'supplier', 'laborer', 'materialman', 'other']),
  claimantLicense: z.string().optional(),
  
  // Property Information
  propertyOwner: z.string().min(1, 'Property owner name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyDescription: z.string().optional(),
  propertyLegalDescription: z.string().optional(),
  
  // Project Information
  projectName: z.string().optional(),
  projectDescription: z.string().optional(),
  workPerformed: z.string().min(1, 'Description of work performed is required'),
  materialsSupplied: z.string().optional(),
  
  // Contract Information
  contractWith: z.string().min(1, 'Contract party name is required'),
  contractDate: z.string().optional(),
  contractAmount: z.string().optional(),
  contractDescription: z.string().optional(),
  
  // Payment Information
  amountDue: z.string().min(1, 'Amount due is required'),
  amountPaid: z.string().min(1, 'Amount paid is required'),
  paymentDate: z.string().optional(),
  paymentMethod: z.enum(['check', 'cash', 'wire-transfer', 'ach', 'credit-card', 'other']).optional(),
  checkNumber: z.string().optional(),
  
  // Work Period
  workStartDate: z.string().optional(),
  workEndDate: z.string().optional(),
  lastWorkDate: z.string().optional(),
  
  // Waiver Scope
  waiverScope: z.enum(['work-to-date', 'specific-period', 'specific-work', 'final-payment']),
  periodFrom: z.string().optional(),
  periodTo: z.string().optional(),
  specificWork: z.string().optional(),
  
  // Lien Rights Being Waived
  mechanicsLienRights: z.boolean().default(true),
  stopNoticeRights: z.boolean().default(false),
  bondClaimRights: z.boolean().default(false),
  otherLienRights: z.array(z.string()).default([]),
  
  // Retention and Future Rights
  retentionAmount: z.string().optional(),
  retentionReleased: z.boolean().default(false),
  futureWorkRights: z.boolean().default(false),
  changeOrderRights: z.boolean().default(false),
  
  // Exceptions and Reservations
  exceptionsToWaiver: z.array(z.string()).default([]),
  reservedRights: z.array(z.string()).default([]),
  unpaidItems: z.array(z.object({
    description: z.string(),
    amount: z.string(),
    dateIncurred: z.string(),
  })).default([]),
  
  // Conditional Waiver Terms
  conditionsPrecedent: z.array(z.string()).default([]),
  paymentConditions: z.string().optional(),
  checkClearanceRequired: z.boolean().default(false),
  
  // Joint Check Provisions
  jointCheckRequired: z.boolean().default(false),
  jointCheckParties: z.array(z.string()).default([]),
  
  // Trust Fund Provisions
  trustFundClaimsWaived: z.boolean().default(false),
  trustFundExceptions: z.string().optional(),
  
  // Subcontractor Provisions
  subcontractorWaivers: z.boolean().default(false),
  subcontractorList: z.array(z.object({
    name: z.string(),
    work: z.string(),
    amount: z.string(),
    waiverReceived: z.boolean().default(false),
  })).default([]),
  
  // Supplier Provisions
  supplierWaivers: z.boolean().default(false),
  supplierList: z.array(z.object({
    name: z.string(),
    materials: z.string(),
    amount: z.string(),
    waiverReceived: z.boolean().default(false),
  })).default([]),
  
  // Notice Requirements
  noticeToOwner: z.boolean().default(false),
  noticeToPrincipal: z.boolean().default(false),
  noticeToLender: z.boolean().default(false),
  
  // Dispute Waivers
  disputeWaiver: z.boolean().default(false),
  litigationWaiver: z.boolean().default(false),
  arbitrationWaiver: z.boolean().default(false),
  
  // Warranty and Representation
  workCompleteWarranty: z.boolean().default(false),
  noUnpaidDebtsWarranty: z.boolean().default(false),
  authorityWarranty: z.boolean().default(true),
  
  // Indemnification
  indemnificationClause: z.boolean().default(false),
  indemnificationScope: z.string().optional(),
  
  // State-Specific Provisions
  stateRequirements: z.array(z.string()).default([]),
  statutoryCompliance: z.boolean().default(true),
  
  // Recording Information
  recordingRequired: z.boolean().default(false),
  recordingOffice: z.string().optional(),
  recordingFee: z.string().optional(),
  
  // Effective Terms
  retroactiveEffect: z.boolean().default(false),
  prospectiveEffect: z.boolean().default(true),
  terminationDate: z.string().optional(),
  
  // Release of Claims
  generalRelease: z.boolean().default(false),
  specificClaims: z.array(z.string()).default([]),
  relatedClaimsWaived: z.boolean().default(false),
  
  // Third Party Rights
  thirdPartyBeneficiaries: z.array(z.string()).default([]),
  assignabilityRights: z.boolean().default(false),
  
  // Modification and Amendment
  modificationRights: z.boolean().default(false),
  amendmentProcedure: z.string().optional(),
  
  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Survival Provisions
  survivingObligations: z.array(z.string()).default([]),
  survivingRights: z.array(z.string()).default([]),
  
  // Acknowledgments
  receiptAcknowledgment: z.boolean().default(true),
  voluntaryExecution: z.boolean().default(true),
  legalAdviceReceived: z.boolean().default(false),
  
  // Corporate Authority
  corporateResolution: z.boolean().default(false),
  officerCapacity: z.string().optional(),
  boardApproval: z.boolean().default(false),
  
  // Signatures
  claimantSignature: z.boolean().default(true),
  claimantSignatureDate: z.string().optional(),
  claimantTitle: z.string().optional(),
  witnessSignature: z.boolean().default(false),
  witnessName: z.string().optional(),
  
  // Notarization
  requireNotarization: z.boolean().default(true),
  notaryState: z.string().optional(),
  notaryCounty: z.string().optional(),
  notaryCommissionExpiration: z.string().optional(),
  
  // Delivery and Notice
  deliveryMethod: z.enum(['hand-delivery', 'certified-mail', 'email', 'regular-mail']).optional(),
  deliveryAddress: z.string().optional(),
  effectiveUponDelivery: z.boolean().default(true),
});