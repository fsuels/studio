// src/lib/documents/us/bid-proposal/schema.ts
import { z } from 'zod';

export const bidproposalSchema = z.object({
  // Bidder Information
  bidderName: z.string().min(1, 'Bidder name is required'),
  bidderAddress: z.string().min(1, 'Bidder address is required'),
  bidderPhone: z.string().min(1, 'Bidder phone is required'),
  bidderEmail: z.string().email().optional(),
  bidderLicense: z.string().min(1, 'Contractor license is required'),
  bidderBond: z.string().optional(),
  
  // Owner/Client Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  
  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectType: z.enum(['residential', 'commercial', 'industrial', 'renovation', 'addition', 'other']),
  
  // Bid Details
  bidDate: z.string().min(1, 'Bid date is required'),
  bidNumber: z.string().optional(),
  bidOpeningDate: z.string().optional(),
  bidValidityPeriod: z.string().optional(),
  
  // Scope of Work
  workScope: z.string().min(1, 'Work scope is required'),
  workItems: z.array(z.object({
    item: z.string(),
    description: z.string(),
    quantity: z.string(),
    unit: z.string(),
    unitPrice: z.string(),
    totalPrice: z.string(),
  })).default([]),
  
  // Pricing Structure
  pricingType: z.enum(['lump-sum', 'unit-price', 'cost-plus', 'time-and-materials']),
  baseBidAmount: z.string().min(1, 'Base bid amount is required'),
  alternateItems: z.array(z.object({
    alternate: z.string(),
    description: z.string(),
    addDeduct: z.enum(['add', 'deduct']),
    amount: z.string(),
  })).default([]),
  
  // Cost Breakdown
  materialsCost: z.string().optional(),
  laborCost: z.string().optional(),
  equipmentCost: z.string().optional(),
  subcontractorCost: z.string().optional(),
  overheadCost: z.string().optional(),
  profitMargin: z.string().optional(),
  
  // Schedule and Timeline
  projectDuration: z.string().optional(),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
  milestones: z.array(z.object({
    milestone: z.string(),
    date: z.string(),
    description: z.string().optional(),
  })).default([]),
  
  // Terms and Conditions
  paymentTerms: z.string().optional(),
  paymentSchedule: z.enum(['monthly-progress', 'milestone-based', 'percentage-completion', 'net-30']).optional(),
  retainagePercentage: z.string().optional(),
  changeOrderProcedure: z.string().optional(),
  
  // Performance Requirements
  performanceBondRequired: z.boolean().default(false),
  performanceBondAmount: z.string().optional(),
  paymentBondRequired: z.boolean().default(false),
  paymentBondAmount: z.string().optional(),
  
  // Insurance Requirements
  generalLiabilityInsurance: z.string().optional(),
  workersCompensationInsurance: z.boolean().default(true),
  builderRiskInsurance: z.boolean().default(false),
  vehicleInsurance: z.boolean().default(false),
  
  // Qualifications and Experience
  yearsInBusiness: z.string().optional(),
  similarProjectsCompleted: z.string().optional(),
  references: z.array(z.object({
    projectName: z.string(),
    clientName: z.string(),
    clientPhone: z.string(),
    projectValue: z.string(),
    completionDate: z.string(),
  })).default([]),
  
  // Technical Specifications
  materialsSpecifications: z.array(z.string()).default([]),
  qualityStandards: z.string().optional(),
  buildingCodes: z.array(z.string()).default([]),
  specialRequirements: z.array(z.string()).default([]),
  
  // Permits and Approvals
  permitsRequired: z.array(z.string()).default([]),
  permitResponsibility: z.enum(['bidder', 'owner', 'shared']).optional(),
  permitCosts: z.enum(['included', 'excluded', 'reimbursable']).optional(),
  
  // Environmental and Safety
  environmentalCompliance: z.boolean().default(true),
  safetyPlan: z.boolean().default(true),
  hazardousMaterials: z.boolean().default(false),
  wasteDisposal: z.string().optional(),
  
  // Warranties
  workmanshipWarranty: z.string().optional(),
  materialWarranties: z.boolean().default(true),
  equipmentWarranties: z.boolean().default(false),
  warrantyExclusions: z.array(z.string()).default([]),
  
  // Exclusions and Assumptions
  workExclusions: z.array(z.string()).default([]),
  bidAssumptions: z.array(z.string()).default([]),
  clarifications: z.array(z.string()).default([]),
  
  // Subcontractors
  subcontractorsListed: z.boolean().default(false),
  majorSubcontractors: z.array(z.object({
    trade: z.string(),
    companyName: z.string(),
    licenseNumber: z.string(),
    workDescription: z.string(),
  })).default([]),
  
  // Equipment and Resources
  equipmentProvided: z.array(z.string()).default([]),
  personnelAssigned: z.array(z.object({
    position: z.string(),
    name: z.string(),
    experience: z.string(),
  })).default([]),
  
  // Risk Factors
  riskFactors: z.array(z.string()).default([]),
  contingencies: z.string().optional(),
  weatherConsiderations: z.boolean().default(false),
  siteConditions: z.string().optional(),
  
  // Additional Services
  additionalServices: z.array(z.object({
    service: z.string(),
    description: z.string(),
    cost: z.string(),
  })).default([]),
  
  // Acceptance Terms
  proposalValidityPeriod: z.string().optional(),
  acceptanceTerms: z.string().optional(),
  modificationRights: z.boolean().default(false),
  
  // Legal Terms
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  governingLaw: z.string().optional(),
  limitationOfLiability: z.boolean().default(false),
  
  // Signatures
  requireBidderSignature: z.boolean().default(true),
  bidderSignatureDate: z.string().optional(),
  requireWitnessSignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
});