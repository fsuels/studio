// src/lib/documents/us/data-processing-agreement/schema.ts
import { z } from 'zod';

export const DataProcessingAgreementSchema = z.object({
  // Data Controller Information
  controllerName: z.string().min(1, 'Data controller name is required'),
  controllerAddress: z.string().min(1, 'Controller address is required'),
  controllerContact: z.string().optional(),
  controllerEmail: z.string().email().optional(),
  
  // Data Processor Information
  processorName: z.string().min(1, 'Data processor name is required'),
  processorAddress: z.string().min(1, 'Processor address is required'),
  processorContact: z.string().optional(),
  processorEmail: z.string().email().optional(),
  
  // Data Processing Details
  processingPurpose: z.string().min(1, 'Processing purpose is required'),
  dataCategories: z.array(z.string()).default([]),
  dataSubjects: z.array(z.string()).default([]),
  processingActivities: z.string().optional(),
  retentionPeriod: z.string().optional(),
  
  // Legal Basis
  legalBasis: z.enum(['consent', 'contract', 'legal-obligation', 'vital-interests', 'public-task', 'legitimate-interests']).default('contract'),
  consentRequirements: z.string().optional(),
  lawfulBasisDescription: z.string().optional(),
  
  // Data Types
  personalData: z.boolean().default(true),
  sensitiveData: z.boolean().default(false),
  biometricData: z.boolean().default(false),
  healthData: z.boolean().default(false),
  financialData: z.boolean().default(false),
  locationData: z.boolean().default(false),
  
  // Processing Activities
  collection: z.boolean().default(true),
  storage: z.boolean().default(true),
  analysis: z.boolean().default(false),
  sharing: z.boolean().default(false),
  deletion: z.boolean().default(true),
  modification: z.boolean().default(false),
  
  // Security Measures
  encryptionRequired: z.boolean().default(true),
  accessControls: z.boolean().default(true),
  auditLogging: z.boolean().default(true),
  dataMinimization: z.boolean().default(true),
  pseudonymization: z.boolean().default(false),
  anonymization: z.boolean().default(false),
  
  // Data Transfer
  internationalTransfer: z.boolean().default(false),
  transferMechanisms: z.string().optional(),
  adequacyDecision: z.boolean().default(false),
  standardContractualClauses: z.boolean().default(false),
  bindingCorporateRules: z.boolean().default(false),
  
  // Data Subject Rights
  accessRights: z.boolean().default(true),
  rectificationRights: z.boolean().default(true),
  erasureRights: z.boolean().default(true),
  portabilityRights: z.boolean().default(true),
  objectionRights: z.boolean().default(true),
  restrictionRights: z.boolean().default(true),
  
  // Breach Notification
  breachNotificationRequired: z.boolean().default(true),
  notificationTimeframe: z.string().optional(),
  breachResponsePlan: z.boolean().default(true),
  authorityNotification: z.boolean().default(true),
  
  // Compliance and Auditing
  complianceMonitoring: z.boolean().default(true),
  auditRights: z.boolean().default(true),
  auditFrequency: z.string().optional(),
  complianceReporting: z.boolean().default(true),
  
  // Data Protection Officer
  dpoRequired: z.boolean().default(false),
  dpoContact: z.string().optional(),
  dpoResponsibilities: z.string().optional(),
  
  // Subprocessors
  subprocessorsAllowed: z.boolean().default(false),
  subprocessorList: z.string().optional(),
  subprocessorAgreements: z.boolean().default(false),
  subprocessorApproval: z.boolean().default(true),
  
  // Term and Termination
  agreementTerm: z.string().optional(),
  terminationConditions: z.string().optional(),
  dataReturnRequirements: z.boolean().default(true),
  dataDeletionRequirements: z.boolean().default(true),
  
  // Liability and Indemnification
  liabilityAllocation: z.string().optional(),
  indemnificationClause: z.boolean().default(true),
  insuranceRequirements: z.boolean().default(false),
  liabilityLimitation: z.boolean().default(true),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  confidentialityDuration: z.string().optional(),
  
  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  
  // Signature Requirements
  requireControllerSignature: z.boolean().default(true),
  requireProcessorSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});