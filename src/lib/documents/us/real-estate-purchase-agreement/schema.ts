// src/lib/documents/us/real-estate-purchase-agreement/schema.ts
import { z } from 'zod';

export const RealEstatePurchaseAgreementSchema = z.object({
  // Buyer Information
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerAddress: z.string().optional(),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),
  
  // Seller Information
  sellerName: z.string().min(1, 'Seller name is required'),
  sellerAddress: z.string().optional(),
  sellerPhone: z.string().optional(),
  sellerEmail: z.string().email().optional(),
  
  // Property Details
  propertyAddress: z.string().min(1, 'Property address is required'),
  legalDescription: z.string().optional(),
  propertyType: z.enum(['single-family', 'condo', 'townhouse', 'multi-family', 'vacant-land', 'commercial']).default('single-family'),
  squareFootage: z.string().optional(),
  lotSize: z.string().optional(),
  yearBuilt: z.string().optional(),
  
  // Purchase Terms
  purchasePrice: z.string().optional(),
  earnestMoney: z.string().optional(),
  downPayment: z.string().optional(),
  loanAmount: z.string().optional(),
  cashPurchase: z.boolean().default(false),
  
  // Financing
  financingContingency: z.boolean().default(true),
  loanType: z.enum(['conventional', 'fha', 'va', 'usda', 'other']).optional(),
  preApprovalRequired: z.boolean().default(true),
  interestRateLimit: z.string().optional(),
  loanCommitmentDeadline: z.string().optional(),
  
  // Inspections
  inspectionContingency: z.boolean().default(true),
  inspectionDeadline: z.string().optional(),
  inspectionCost: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  repairs: z.enum(['as-is', 'seller-repairs', 'buyer-credit', 'negotiated']).default('negotiated'),
  
  // Appraisal
  appraisalContingency: z.boolean().default(true),
  appraisalDeadline: z.string().optional(),
  appraisalShortfall: z.enum(['buyer-covers', 'renegotiate', 'cancel']).default('renegotiate'),
  
  // Title and Survey
  titleInsurance: z.boolean().default(true),
  titleCompany: z.string().optional(),
  surveyRequired: z.boolean().default(false),
  surveyCost: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  
  // Closing Details
  closingDate: z.string().optional(),
  closingCosts: z.string().optional(),
  prorations: z.string().optional(),
  possessionDate: z.string().optional(),
  
  // Inclusions
  personalPropertyIncluded: z.string().optional(),
  fixturesIncluded: z.string().optional(),
  appliancesIncluded: z.string().optional(),
  exclusions: z.string().optional(),
  
  // Disclosures
  sellerDisclosures: z.boolean().default(true),
  leadPaintDisclosure: z.boolean().default(false),
  floodZoneDisclosure: z.boolean().default(false),
  environmentalHazards: z.boolean().default(false),
  
  // Utilities
  waterSource: z.enum(['public', 'private-well', 'shared', 'other']).optional(),
  sewerSystem: z.enum(['public', 'septic', 'shared', 'other']).optional(),
  utilities: z.string().optional(),
  
  // Warranties
  homeWarranty: z.boolean().default(false),
  warrantyProvider: z.string().optional(),
  warrantyCost: z.enum(['buyer', 'seller']).optional(),
  warrantyTerm: z.string().optional(),
  
  // Contingencies
  saleOfCurrentHome: z.boolean().default(false),
  hoa Approval: z.boolean().default(false),
  attorneyReview: z.boolean().default(false),
  otherContingencies: z.string().optional(),
  
  // HOA Information
  hoaRequired: z.boolean().default(false),
  hoaFees: z.string().optional(),
  hoaDocuments: z.boolean().default(false),
  hoaApproval: z.boolean().default(false),
  
  // Default and Remedies
  defaultRemedies: z.string().optional(),
  liquidatedDamages: z.string().optional(),
  specificPerformance: z.boolean().default(true),
  attorneyFees: z.boolean().default(false),
  
  // Closing Costs
  buyerClosingCosts: z.string().optional(),
  sellerClosingCosts: z.string().optional(),
  titleInsuranceCost: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  recordingFees: z.enum(['buyer', 'seller', 'shared']).default('buyer),
  
  // Risk of Loss
  riskOfLoss: z.enum(['buyer', 'seller', 'insurance']).default('seller'),
  propertyInsurance: z.boolean().default(true),
  maintenanceResponsibility: z.enum(['buyer', 'seller']).default('seller'),
  
  // Special Provisions
  specialProvisions: z.string().optional(),
  additionalTerms: z.string().optional(),
  amendments: z.string().optional(),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('mediation'),
  
  // Signature Requirements
  requireBuyerSignature: z.boolean().default(true),
  requireSellerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(true),
  electronicSignatureAccepted: z.boolean().default(false),
});