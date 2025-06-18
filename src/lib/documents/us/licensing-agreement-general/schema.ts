// src/lib/documents/us/licensing-agreement-general/schema.ts
import { z } from 'zod';

export const LicensingAgreementGeneralSchema = z.object({
  // Licensor Information
  licensorName: z.string().min(1, 'Licensor name is required'),
  licensorAddress: z.string().min(1, 'Licensor address is required'),
  licensorContact: z.string().optional(),
  licensorEmail: z.string().email().optional(),
  
  // Licensee Information
  licenseeName: z.string().min(1, 'Licensee name is required'),
  licenseeAddress: z.string().min(1, 'Licensee address is required'),
  licenseeContact: z.string().optional(),
  licenseeEmail: z.string().email().optional(),
  
  // Licensed Property
  propertyType: z.enum(['patent', 'trademark', 'copyright', 'trade-secret', 'know-how', 'technology']).default('patent'),
  propertyDescription: z.string().min(1, 'Property description is required'),
  propertyIdentification: z.string().optional(),
  registrationNumbers: z.string().optional(),
  
  // License Grant
  licenseType: z.enum(['exclusive', 'non-exclusive', 'sole']).default('non-exclusive'),
  licenseScope: z.string().optional(),
  fieldOfUse: z.string().optional(),
  geographicTerritory: z.string().optional(),
  
  // Rights Granted
  rightToUse: z.boolean().default(true),
  rightToManufacture: z.boolean().default(false),
  rightToSell: z.boolean().default(false),
  rightToModify: z.boolean().default(false),
  rightToSublicense: z.boolean().default(false),
  
  // Term and Duration
  licenseTerm: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  renewalTerms: z.string().optional(),
  
  // Financial Terms
  upfrontFee: z.string().optional(),
  royaltyRate: z.string().optional(),
  minimumRoyalty: z.string().optional(),
  royaltyBase: z.string().optional(),
  paymentSchedule: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  
  // Performance Requirements
  minimumPerformance: z.string().optional(),
  commercializationDeadline: z.string().optional(),
  diligenceRequirements: z.string().optional(),
  reportingRequirements: z.boolean().default(false),
  
  // Quality Control
  qualityStandards: z.string().optional(),
  inspectionRights: z.boolean().default(false),
  approvalRights: z.boolean().default(false),
  brandStandards: z.string().optional(),
  
  // Intellectual Property
  ipOwnership: z.enum(['licensor', 'licensee', 'joint']).default('licensor'),
  improvementRights: z.string().optional(),
  derivativeWorks: z.boolean().default(false),
  patentProsecution: z.enum(['licensor', 'licensee', 'joint']).optional(),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),
  tradeSecretProtection: z.boolean().default(false),
  
  // Warranties and Representations
  ownershipWarranty: z.boolean().default(true),
  validityWarranty: z.boolean().default(true),
  nonInfringementWarranty: z.boolean().default(true),
  performanceWarranty: z.boolean().default(false),
  
  // Indemnification
  licensorIndemnification: z.boolean().default(false),
  licenseeIndemnification: z.boolean().default(false),
  mutualIndemnification: z.boolean().default(false),
  
  // Termination
  terminationConditions: z.array(z.string()).default([]),
  terminationNotice: z.string().optional(),
  effectOfTermination: z.string().optional(),
  survivalClauses: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Miscellaneous
  entireAgreement: z.boolean().default(true),
  amendmentRequirements: z.string().optional(),
  assignmentRights: z.boolean().default(false),
  severability: z.boolean().default(true),
  
  // Signature Requirements
  requireLicensorSignature: z.boolean().default(true),
  requireLicenseeSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});