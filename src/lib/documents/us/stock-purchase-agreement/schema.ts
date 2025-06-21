import { z } from 'zod';

export const stockPurchaseAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  stateOfIncorporation: z.string().min(1, 'State of incorporation is required'),
  
  // Seller Information
  sellerName: z.string().min(1, 'Seller name is required'),
  sellerAddress: z.string().min(1, 'Seller address is required'),
  sellerType: z.enum(['individual', 'entity']),
  
  // Buyer Information
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerAddress: z.string().min(1, 'Buyer address is required'),
  buyerType: z.enum(['individual', 'entity']),
  
  // Stock Details
  stockDetails: z.object({
    shareClass: z.string().min(1, 'Share class is required'),
    numberOfShares: z.number().min(1, 'Number of shares is required'),
    sharePrice: z.number().min(0, 'Share price must be non-negative'),
    totalPurchasePrice: z.number().min(0, 'Total purchase price must be non-negative'),
    parValue: z.number().min(0).optional(),
    certificateNumbers: z.array(z.string()).optional()
  }),
  
  // Purchase Terms
  purchaseTerms: z.object({
    paymentMethod: z.enum(['cash', 'check', 'wire-transfer', 'installments', 'other']),
    paymentSchedule: z.string().optional(),
    closingDate: z.string().min(1, 'Closing date is required'),
    closingLocation: z.string().min(1, 'Closing location is required'),
  }),
  
  // Representations and Warranties
  sellerRepresentations: z.object({
    ownershipConfirmation: z.boolean().default(true),
    titleClear: z.boolean().default(true),
    authorizationToSell: z.boolean().default(true),
    noLiens: z.boolean().default(true),
    noRestrictions: z.boolean().default(true)
  }),
  
  buyerRepresentations: z.object({
    authorizationToPurchase: z.boolean().default(true),
    sufficientFunds: z.boolean().default(true),
    investmentExperience: z.boolean().default(false),
    accreditedInvestor: z.boolean().default(false)
  }),
  
  // Conditions Precedent
  conditionsPrecedent: z.array(z.string()).default([
    'Completion of due diligence',
    'Board approval',
    'Regulatory approvals (if applicable)'
  ]),
  
  // Covenants
  covenants: z.object({
    nonCompete: z.boolean().default(false),
    nonCompetePeriod: z.string().optional(),
    confidentiality: z.boolean().default(true),
    cooperation: z.boolean().default(true)
  }),
  
  // Indemnification
  indemnification: z.object({
    sellerIndemnity: z.boolean().default(true),
    buyerIndemnity: z.boolean().default(true),
    indemnityPeriod: z.string().default('2 years'),
    indemnityLimit: z.string().optional(),
    escrowAmount: z.string().optional()
  }),
  
  // Dispute Resolution
  disputeResolution: z.object({
    method: z.enum(['arbitration', 'mediation', 'litigation']).default('arbitration'),
    location: z.string().optional(),
    governingLaw: z.string().min(1, 'Governing law is required')
  }),
  
  // Additional Terms
  additionalTerms: z.string().optional(),
  
  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
  notarization: z.boolean().default(true),
});