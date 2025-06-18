// src/lib/documents/us/environmental-agreement/schema.ts
import { z } from 'zod';

export const EnvironmentalAgreementSchema = z.object({
  // Primary Party Information
  primaryPartyName: z.string().min(1, 'Primary party name is required'),
  primaryPartyAddress: z.string().min(1, 'Primary party address is required'),
  primaryPartyContact: z.string().optional(),
  primaryPartyEmail: z.string().email().optional(),
  
  // Secondary Party Information
  secondaryPartyName: z.string().min(1, 'Secondary party name is required'),
  secondaryPartyAddress: z.string().min(1, 'Secondary party address is required'),
  secondaryPartyContact: z.string().optional(),
  secondaryPartyEmail: z.string().email().optional(),
  
  // Project/Agreement Type
  agreementType: z.enum(['compliance', 'conservation', 'remediation', 'sustainability', 'carbon-offset']).default('compliance'),
  projectDescription: z.string().min(1, 'Project description is required'),
  environmentalObjectives: z.string().optional(),
  scopeOfWork: z.string().optional(),
  
  // Location and Property
  projectLocation: z.string().optional(),
  propertyDescription: z.string().optional(),
  coordinates: z.string().optional(),
  affectedArea: z.string().optional(),
  
  // Environmental Compliance
  regulatoryFramework: z.string().optional(),
  permits: z.array(z.string()).default([]),
  complianceStandards: z.string().optional(),
  reportingRequirements: z.boolean().default(false),
  
  // Conservation Terms
  conservationObjectives: z.string().optional(),
  protectedSpecies: z.string().optional(),
  habitatProtection: z.boolean().default(false),
  landUseRestrictions: z.string().optional(),
  
  // Remediation Details
  contaminantTypes: z.string().optional(),
  remediationMethods: z.string().optional(),
  cleanupStandards: z.string().optional(),
  timelineForRemediation: z.string().optional(),
  
  // Carbon Offset/Credits
  carbonOffsetAmount: z.string().optional(),
  offsetMethodology: z.string().optional(),
  verificationStandards: z.string().optional(),
  creditTransfer: z.boolean().default(false),
  
  // Financial Terms
  totalCost: z.string().optional(),
  paymentStructure: z.enum(['lump-sum', 'installments', 'milestone-based']).optional(),
  fundingSource: z.string().optional(),
  incentivePayments: z.boolean().default(false),
  
  // Performance Standards
  performanceMetrics: z.string().optional(),
  monitoringRequirements: z.string().optional(),
  successCriteria: z.string().optional(),
  verificationProcess: z.string().optional(),
  
  // Timeline
  projectStartDate: z.string().optional(),
  projectEndDate: z.string().optional(),
  milestones: z.string().optional(),
  reviewPeriods: z.string().optional(),
  
  // Monitoring and Reporting
  environmentalMonitoring: z.boolean().default(true),
  reportingFrequency: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  dataSharing: z.boolean().default(false),
  auditRights: z.boolean().default(false),
  
  // Risk Management
  environmentalRisks: z.string().optional(),
  riskMitigation: z.string().optional(),
  contingencyPlans: z.string().optional(),
  insuranceRequirements: z.boolean().default(false),
  
  // Liability and Indemnification
  liabilityAllocation: z.string().optional(),
  indemnificationClause: z.boolean().default(false),
  environmentalLiability: z.boolean().default(true),
  
  // Third Party Rights
  thirdPartyBeneficiaries: z.boolean().default(false),
  publicAccess: z.boolean().default(false),
  stakeholderInvolvement: z.string().optional(),
  
  // Termination and Default
  terminationConditions: z.string().optional(),
  defaultRemedies: z.string().optional(),
  postTerminationObligations: z.string().optional(),
  
  // Legal Compliance
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration']).optional(),
  
  // Signature Requirements
  requirePrimaryPartySignature: z.boolean().default(true),
  requireSecondaryPartySignature: z.boolean().default(true),
  requireRegulatoryApproval: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});