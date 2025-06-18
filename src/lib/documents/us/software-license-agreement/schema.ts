// src/lib/documents/us/software-license-agreement/schema.ts
import { z } from 'zod';

export const SoftwareLicenseAgreementSchema = z.object({
  // Licensor Information
  licensorName: z.string().min(1, 'Licensor name is required'),
  licensorAddress: z.string().min(1, 'Licensor address is required'),
  licensorEmail: z.string().email().optional(),
  licensorWebsite: z.string().optional(),
  
  // Licensee Information
  licenseeName: z.string().min(1, 'Licensee name is required'),
  licenseeAddress: z.string().min(1, 'Licensee address is required'),
  licenseeEmail: z.string().email().optional(),
  organizationType: z.enum(['individual', 'business', 'non-profit', 'government']).default('individual'),
  
  // Software Details
  softwareName: z.string().min(1, 'Software name is required'),
  softwareVersion: z.string().optional(),
  softwareDescription: z.string().min(1, 'Software description is required'),
  systemRequirements: z.string().optional(),
  documentationIncluded: z.boolean().default(true),
  
  // License Type
  licenseType: z.enum(['perpetual', 'subscription', 'trial', 'educational', 'enterprise']).default('perpetual'),
  licenseScope: z.enum(['single-user', 'multi-user', 'site-license', 'enterprise']).default('single-user'),
  numberOfUsers: z.string().optional(),
  numberOfInstallations: z.string().optional(),
  concurrentUsers: z.string().optional(),
  
  // License Terms
  licenseStartDate: z.string().optional(),
  licenseEndDate: z.string().optional(),
  licenseDuration: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  renewalTerms: z.string().optional(),
  
  // Payment Terms
  licenseFee: z.string().optional(),
  paymentSchedule: z.enum(['one-time', 'monthly', 'annual', 'quarterly']).default('one-time'),
  maintenanceFee: z.string().optional(),
  supportFee: z.string().optional(),
  paymentMethod: z.enum(['credit-card', 'check', 'wire-transfer', 'purchase-order']).default('credit-card'),
  
  // Usage Rights
  commercialUse: z.boolean().default(true),
  modificationAllowed: z.boolean().default(false),
  redistributionAllowed: z.boolean().default(false),
  reverseEngineeringAllowed: z.boolean().default(false),
  sourceCodeAccess: z.boolean().default(false),
  
  // Restrictions
  geographicRestrictions: z.string().optional(),
  industryRestrictions: z.string().optional(),
  competitorRestrictions: z.boolean().default(false),
  transferRestrictions: z.boolean().default(true),
  
  // Support and Maintenance
  technicalSupport: z.boolean().default(true),
  supportLevel: z.enum(['basic', 'standard', 'premium', 'enterprise']).optional(),
  supportHours: z.string().optional(),
  updateProvision: z.boolean().default(true),
  upgradePath: z.boolean().default(false),
  
  // Intellectual Property
  copyrightOwnership: z.enum(['licensor', 'licensee', 'shared']).default('licensor'),
  trademarkRights: z.boolean().default(false),
  patentRights: z.boolean().default(false),
  derivativeWorks: z.boolean().default(false),
  
  // Warranty and Liability
  warrantyProvided: z.boolean().default(true),
  warrantyPeriod: z.string().optional(),
  warrantyDisclaimer: z.boolean().default(false),
  liabilityLimitation: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  
  // Data and Privacy
  dataCollection: z.boolean().default(false),
  privacyPolicy: z.boolean().default(true),
  dataProcessing: z.string().optional(),
  dataRetention: z.string().optional(),
  gdprCompliance: z.boolean().default(false),
  
  // Termination
  terminationConditions: z.array(z.string()).default([]),
  terminationNotice: z.string().optional(),
  effectOfTermination: z.string().optional(),
  dataReturnRequirements: z.boolean().default(false),
  
  // Security Requirements
  securityStandards: z.string().optional(),
  accessControls: z.boolean().default(false),
  encryptionRequired: z.boolean().default(false),
  auditRights: z.boolean().default(false),
  
  // Compliance
  exportControls: z.boolean().default(true),
  regulatoryCompliance: z.string().optional(),
  industryStandards: z.string().optional(),
  certificationRequirements: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Special Provisions
  escrowAgreement: z.boolean().default(false),
  sourceCodeEscrow: z.boolean().default(false),
  benchmarkingRights: z.boolean().default(false),
  publicityRights: z.boolean().default(false),
  
  // Signature Requirements
  requireLicensorSignature: z.boolean().default(true),
  requireLicenseeSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});