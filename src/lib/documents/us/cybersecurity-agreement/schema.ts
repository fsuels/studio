// src/lib/documents/us/cybersecurity-agreement/schema.ts
import { z } from 'zod';

export const CybersecurityAgreementSchema = z.object({
  // Service Provider Information
  providerName: z.string().min(1, 'Provider name is required'),
  providerAddress: z.string().optional(),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),
  providerCertifications: z.string().optional(),
  
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  industryType: z.string().optional(),
  
  // Scope of Services
  servicesProvided: z.string().optional(),
  securityAssessment: z.boolean().default(true),
  penetrationTesting: z.boolean().default(false),
  vulnerabilityScanning: z.boolean().default(true),
  securityMonitoring: z.boolean().default(false),
  incidentResponse: z.boolean().default(false),
  
  // Security Frameworks
  complianceFrameworks: z.string().optional(),
  niistCompliance: z.boolean().default(false),
  iso27001Compliance: z.boolean().default(false),
  socCompliance: z.boolean().default(false),
  hipaaCompliance: z.boolean().default(false),
  
  // Assessment and Testing
  assessmentFrequency: z.string().optional(),
  testingSchedule: z.string().optional(),
  reportingTimeline: z.string().optional(),
  remediationTimeline: z.string().optional(),
  retestingPolicy: z.string().optional(),
  
  // Monitoring Services
  continuousMonitoring: z.boolean().default(false),
  alertingSystem: z.boolean().default(false),
  logAnalysis: z.boolean().default(false),
  threatIntelligence: z.boolean().default(false),
  securityDashboard: z.boolean().default(false),
  
  // Incident Response
  incidentResponsePlan: z.boolean().default(false),
  responseTimeTarget: z.string().optional(),
  escalationProcedures: z.string().optional(),
  forensicServices: z.boolean().default(false),
  communicationProtocol: z.string().optional(),
  
  // Data Protection
  dataClassification: z.string().optional(),
  dataHandlingProcedures: z.string().optional(),
  dataRetentionPolicy: z.string().optional(),
  dataDestructionPolicy: z.string().optional(),
  confidentialityLevel: z.enum(['public', 'internal', 'confidential', 'restricted']).default('confidential'),
  
  // Access Control
  accessManagement: z.boolean().default(false),
  identityManagement: z.boolean().default(false),
  privilegedAccess: z.boolean().default(false),
  multifactorAuth: z.boolean().default(false),
  
  // Training and Awareness
  securityTraining: z.boolean().default(false),
  awarenessProgram: z.boolean().default(false),
  phishingSimulation: z.boolean().default(false),
  trainingFrequency: z.string().optional(),
  
  // Financial Terms
  totalCost: z.string().optional(),
  paymentStructure: z.enum(['fixed', 'hourly', 'retainer', 'project-based']).default('fixed'),
  hourlyRate: z.string().optional(),
  retainerAmount: z.string().optional(),
  expenseReimbursement: z.boolean().default(false),
  
  // Service Level Agreement
  availabilityTarget: z.string().optional(),
  responseTime: z.string().optional(),
  resolutionTime: z.string().optional(),
  supportHours: z.string().optional(),
  escalationMatrix: z.string().optional(),
  
  // Reporting and Documentation
  reportingFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']).default('monthly'),
  executiveSummaries: z.boolean().default(true),
  technicalReports: z.boolean().default(true),
  complianceReports: z.boolean().default(false),
  customReporting: z.boolean().default(false),
  
  // Risk Management
  riskAssessment: z.boolean().default(true),
  riskMitigation: z.string().optional(),
  threatModeling: z.boolean().default(false),
  businessImpact: z.boolean().default(false),
  
  // Technology and Tools
  securityTools: z.string().optional(),
  softwareLicensing: z.enum(['client', 'provider', 'shared']).default('provider'),
  toolIntegration: z.boolean().default(false),
  customTooling: z.boolean().default(false),
  
  // Quality Assurance
  qualityControl: z.string().optional(),
  peerReview: z.boolean().default(true),
  methodologyStandards: z.string().optional(),
  continuousImprovement: z.boolean().default(true),
  
  // Legal and Compliance
  regulatoryCompliance: z.boolean().default(true),
  auditSupport: z.boolean().default(false),
  legalDiscovery: z.boolean().default(false),
  dataBreachNotification: z.boolean().default(true),
  
  // Termination
  terminationNotice: z.string().optional(),
  dataReturn: z.boolean().default(true),
  toolTransition: z.string().optional(),
  knowledgeTransfer: z.boolean().default(true),
  
  // Insurance and Liability
  professionalLiability: z.string().optional(),
  cybersecurityInsurance: z.string().optional(),
  limitationOfLiability: z.boolean().default(true),
  indemnification: z.boolean().default(true),
  
  // Intellectual Property
  workProductOwnership: z.enum(['client', 'provider', 'shared']).default('client'),
  preexistingIP: z.string().optional(),
  toolOwnership: z.enum(['client', 'provider', 'licensed']).default('provider'),
  
  // Confidentiality
  nondisclosureTerms: z.boolean().default(true),
  confidentialityPeriod: z.string().optional(),
  securityClearance: z.boolean().default(false),
  backgroundChecks: z.boolean().default(false),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'court']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Signature Requirements
  requireProviderSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});