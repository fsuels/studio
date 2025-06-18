// src/lib/documents/us/donation-agreement/schema.ts
import { z } from 'zod';

export const DonationAgreementSchema = z.object({
  // Donor Information
  donorName: z.string().min(1, 'Donor name is required'),
  donorAddress: z.string().optional(),
  donorPhone: z.string().optional(),
  donorEmail: z.string().email().optional(),
  donorType: z.enum(['individual', 'corporation', 'foundation', 'trust', 'estate']).default('individual'),
  
  // Recipient Information
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAddress: z.string().optional(),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  recipientType: z.enum(['charity', 'nonprofit', 'educational', 'religious', 'individual', 'other']).default('charity'),
  recipientTaxId: z.string().optional(),
  
  // Donation Details
  donationType: z.enum(['cash', 'property', 'securities', 'real-estate', 'in-kind', 'pledge']).default('cash'),
  donationAmount: z.string().optional(),
  donationDescription: z.string().optional(),
  fairMarketValue: z.string().optional(),
  valuationMethod: z.string().optional(),
  
  // Cash Donation
  cashAmount: z.string().optional(),
  paymentMethod: z.enum(['check', 'wire-transfer', 'credit-card', 'cash', 'other']).default('check'),
  paymentSchedule: z.enum(['one-time', 'installments', 'monthly', 'quarterly', 'annual']).default('one-time'),
  
  // Property Donation
  propertyDescription: z.string().optional(),
  propertyCondition: z.string().optional(),
  propertyLocation: z.string().optional(),
  titleTransfer: z.boolean().default(false),
  
  // Securities Donation
  securitiesType: z.string().optional(),
  numberOfShares: z.string().optional(),
  stockSymbol: z.string().optional(),
  brokerageAccount: z.string().optional(),
  
  // Real Estate Donation
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  deedType: z.string().optional(),
  encumbrances: z.string().optional(),
  
  // Purpose and Restrictions
  donationPurpose: z.string().optional(),
  useRestrictions: z.boolean().default(false),
  restrictionDetails: z.string().optional(),
  endowmentFund: z.boolean().default(false),
  namingRights: z.boolean().default(false),
  
  // Tax Considerations
  taxDeductible: z.boolean().default(false),
  taxReceiptRequired: z.boolean().default(true),
  appraisalRequired: z.boolean().default(false),
  irs8283Required: z.boolean().default(false),
  
  // Recognition
  donorRecognition: z.boolean().default(false),
  recognitionLevel: z.string().optional(),
  anonymousDonation: z.boolean().default(false),
  publicityRights: z.boolean().default(false),
  
  // Pledge Details
  pledgeAmount: z.string().optional(),
  pledgePeriod: z.string().optional(),
  paymentScheduleDetails: z.string().optional(),
  pledgeReminders: z.boolean().default(false),
  
  // Conditions
  donationConditions: z.string().optional(),
  matchingGift: z.boolean().default(false),
  matchingGiftDetails: z.string().optional(),
  contingentDonation: z.boolean().default(false),
  
  // Reporting
  annualReporting: z.boolean().default(false),
  impactReporting: z.boolean().default(false),
  financialReporting: z.boolean().default(false),
  reportingFrequency: z.enum(['quarterly', 'semi-annual', 'annual', 'none']).default('annual'),
  
  // Legal Terms
  revocability: z.enum(['revocable', 'irrevocable']).default('irrevocable'),
  effectiveDate: z.string().optional(),
  governingLaw: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),
  
  // Special Provisions
  estatePlanning: z.boolean().default(false),
  charitableRemainder: z.boolean().default(false),
  lifeIncome: z.boolean().default(false),
  specialInstructions: z.string().optional(),
  
  // Signature Requirements
  requireDonorSignature: z.boolean().default(true),
  requireRecipientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});