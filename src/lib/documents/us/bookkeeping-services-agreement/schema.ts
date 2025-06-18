// src/lib/documents/us/bookkeeping-services-agreement/schema.ts
import { z } from 'zod';

export const BookkeepingServicesAgreementSchema = z.object({
  // Service Provider Information
  providerName: z.string().min(1, 'Service provider name is required'),
  providerBusinessName: z.string().optional(),
  providerAddress: z.string().min(1, 'Provider address is required'),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),
  providerLicense: z.string().optional(),
  providerCredentials: z.string().optional(),
  
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientBusinessName: z.string().optional(),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientEIN: z.string().optional(),
  businessType: z.string().optional(),
  
  // Service Scope
  serviceType: z.enum(['basic-bookkeeping', 'full-service', 'custom-package']).default('basic-bookkeeping'),
  includedServices: z.array(z.string()).default([]),
  excludedServices: z.array(z.string()).default([]),
  recordsToMaintain: z.array(z.string()).default([]),
  reportingFrequency: z.enum(['monthly', 'quarterly', 'annually', 'as-needed']).default('monthly'),
  
  // Bookkeeping Services
  dataEntry: z.boolean().default(true),
  bankReconciliation: z.boolean().default(true),
  invoicing: z.boolean().default(false),
  billPaying: z.boolean().default(false),
  payrollProcessing: z.boolean().default(false),
  taxPreparation: z.boolean().default(false),
  financialReporting: z.boolean().default(true),
  budgetPlanning: z.boolean().default(false),
  
  // Software and Systems
  bookkeepingSoftware: z.string().optional(),
  clientProvidedSoftware: z.boolean().default(false),
  softwareTraining: z.boolean().default(false),
  dataBackup: z.boolean().default(true),
  cloudBasedServices: z.boolean().default(false),
  securityMeasures: z.string().optional(),
  
  // Fee Structure
  feeStructure: z.enum(['monthly-retainer', 'hourly', 'per-transaction', 'project-based']).default('monthly-retainer'),
  monthlyRetainer: z.string().optional(),
  hourlyRate: z.string().optional(),
  perTransactionFee: z.string().optional(),
  minimumMonthlyFee: z.string().optional(),
  additionalServiceFees: z.boolean().default(false),
  expenseReimbursement: z.boolean().default(false),
  
  // Payment Terms
  paymentSchedule: z.enum(['monthly', 'quarterly', 'upon-completion', 'advance']).default('monthly'),
  paymentDueDate: z.string().optional(),
  latePaymentFees: z.boolean().default(false),
  latePaymentRate: z.string().optional(),
  acceptedPaymentMethods: z.array(z.string()).default([]),
  autoPayment: z.boolean().default(false),
  
  // Client Responsibilities
  timelyDocumentProvision: z.boolean().default(true),
  accurateInformation: z.boolean().default(true),
  recordOrganization: z.boolean().default(true),
  promptCommunication: z.boolean().default(true),
  accessToAccounts: z.boolean().default(false),
  softwareAccess: z.boolean().default(false),
  
  // Provider Responsibilities
  timelyService: z.boolean().default(true),
  accurateRecords: z.boolean().default(true),
  confidentialityMaintenance: z.boolean().default(true),
  professionalStandards: z.boolean().default(true),
  regulatoryCompliance: z.boolean().default(true),
  backupServices: z.boolean().default(true),
  
  // Deliverables
  monthlyReports: z.boolean().default(true),
  quarterlyReports: z.boolean().default(false),
  annualReports: z.boolean().default(false),
  customReports: z.boolean().default(false),
  dashboardAccess: z.boolean().default(false),
  reportDeliveryMethod: z.enum(['email', 'portal', 'mail', 'in-person']).default('email'),
  
  // Data Access and Security
  clientDataAccess: z.boolean().default(true),
  dataEncryption: z.boolean().default(true),
  secureTransmission: z.boolean().default(true),
  passwordProtection: z.boolean().default(true),
  dataRetentionPeriod: z.string().optional(),
  dataDestructionPolicy: z.string().optional(),
  
  // Record Keeping
  recordRetentionPeriod: z.string().optional(),
  clientRecordReturn: z.boolean().default(true),
  providerRecordKeeping: z.boolean().default(true),
  digitalRecords: z.boolean().default(true),
  physicalRecords: z.boolean().default(false),
  recordAccessRights: z.string().optional(),
  
  // Communication
  primaryContact: z.string().optional(),
  communicationMethod: z.enum(['phone', 'email', 'portal', 'in-person']).default('email'),
  responseTimeframe: z.string().optional(),
  meetingSchedule: z.enum(['weekly', 'monthly', 'quarterly', 'as-needed']).default('monthly'),
  emergencyContact: z.boolean().default(false),
  
  // Quality Control
  reviewProcedures: z.boolean().default(true),
  errorCorrection: z.boolean().default(true),
  qualityAssurance: z.boolean().default(true),
  clientApproval: z.boolean().default(false),
  changeNotification: z.boolean().default(true),
  
  // Professional Standards
  gaapCompliance: z.boolean().default(true),
  industryStandards: z.boolean().default(true),
  ethicalGuidelines: z.boolean().default(true),
  continuingEducation: z.boolean().default(false),
  professionalInsurance: z.boolean().default(false),
  licensingCompliance: z.boolean().default(true),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  nonDisclosureTerms: z.string().optional(),
  clientPrivilege: z.boolean().default(true),
  thirdPartyDisclosure: z.boolean().default(false),
  governmentDisclosure: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),
  
  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  liabilityScope: z.enum(['negligence', 'errors-omissions', 'full-liability']).default('negligence'),
  insuranceRequirement: z.boolean().default(false),
  insuranceAmount: z.string().optional(),
  mutualIndemnification: z.boolean().default(false),
  clientIndemnification: z.boolean().default(false),
  
  // Technology Requirements
  internetAccess: z.boolean().default(true),
  computerRequirements: z.string().optional(),
  softwareUpdates: z.boolean().default(true),
  technicalSupport: z.boolean().default(false),
  systemIntegration: z.boolean().default(false),
  
  // Term and Termination
  agreementTerm: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  terminationNotice: z.string().optional(),
  terminationClauses: z.array(z.string()).default([]),
  postTerminationServices: z.string().optional(),
  fileTransfer: z.boolean().default(true),
  
  // Special Circumstances
  peakSeasonPricing: z.boolean().default(false),
  holidaySchedule: z.string().optional(),
  backupProvider: z.boolean().default(false),
  emergencyServices: z.boolean().default(false),
  multiLocationServices: z.boolean().default(false),
  
  // Compliance and Regulatory
  taxComplianceSupport: z.boolean().default(false),
  auditSupport: z.boolean().default(false),
  regulatoryReporting: z.boolean().default(false),
  governmentFilings: z.boolean().default(false),
  industrySpecificCompliance: z.boolean().default(false),
  
  // Add-On Services
  payrollSetup: z.boolean().default(false),
  hrServices: z.boolean().default(false),
  businessAdvisory: z.boolean().default(false),
  budgetingServices: z.boolean().default(false),
  cashFlowAnalysis: z.boolean().default(false),
  profitabilityAnalysis: z.boolean().default(false),
  
  // Client Training
  softwareTrainingIncluded: z.boolean().default(false),
  processTraining: z.boolean().default(false),
  ongoingSupport: z.boolean().default(false),
  documentationProvided: z.boolean().default(false),
  trainingMaterials: z.boolean().default(false),
  
  // Performance Metrics
  accuracyStandards: z.string().optional(),
  timelinessStandards: z.string().optional(),
  qualityMetrics: z.string().optional(),
  clientSatisfactionMeasures: z.boolean().default(false),
  performanceReviews: z.boolean().default(false),
  
  // Change Management
  scopeChangeProcess: z.string().optional(),
  feeAdjustmentProcess: z.string().optional(),
  serviceModifications: z.boolean().default(true),
  clientRequestProcedure: z.string().optional(),
  changeNotificationPeriod: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),
  
  // Contract Terms
  entireAgreement: z.boolean().default(true),
  modificationRequirements: z.enum(['written-only', 'mutual-consent', 'email-acceptable']).default('written-only'),
  severabilityClause: z.boolean().default(true),
  assignmentRights: z.boolean().default(false),
  bindingEffect: z.boolean().default(true),
  
  // Signature Requirements
  requireProviderSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});