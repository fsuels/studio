// src/lib/documents/us/service-level-agreement/schema.ts
import { z } from 'zod';

export const ServiceLevelAgreementSchema = z.object({
  // Parties
  serviceProvider: z.string().min(1, 'Service provider name is required'),
  serviceProviderAddress: z.string().min(1, 'Service provider address is required'),
  serviceProviderContact: z.string().optional(),
  
  client: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientContact: z.string().optional(),
  
  // Service Details
  serviceDescription: z.string().min(1, 'Service description is required'),
  serviceType: z.enum(['it-support', 'cloud-services', 'managed-services', 'consulting', 'maintenance', 'other']),
  serviceScope: z.string().min(1, 'Service scope is required'),
  deliverables: z.string().optional(),
  
  // Performance Standards
  availabilityTarget: z.string().optional(),
  uptimeRequirement: z.string().optional(),
  responseTimeTargets: z.string().optional(),
  resolutionTimeTargets: z.string().optional(),
  performanceMetrics: z.string().optional(),
  qualityStandards: z.string().optional(),
  
  // Service Hours
  serviceHours: z.string().optional(),
  businessHours: z.string().optional(),
  afterHoursSupport: z.boolean().default(false),
  holidaySupport: z.boolean().default(false),
  escalationProcedure: z.string().optional(),
  
  // Monitoring and Reporting
  monitoringRequirements: z.string().optional(),
  reportingFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']).optional(),
  reportingFormat: z.string().optional(),
  performanceReports: z.string().optional(),
  auditRequirements: z.string().optional(),
  
  // Penalties and Incentives
  penaltyStructure: z.string().optional(),
  serviceCreditTerms: z.string().optional(),
  performanceIncentives: z.string().optional(),
  breachConsequences: z.string().optional(),
  
  // Timeline
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expirationDate: z.string().optional(),
  termLength: z.string().optional(),
  renewalTerms: z.string().optional(),
  
  // Financial Terms
  serviceFees: z.string().optional(),
  paymentTerms: z.string().optional(),
  billingSchedule: z.enum(['monthly', 'quarterly', 'annually', 'milestone-based']).optional(),
  lateFees: z.string().optional(),
  
  // Responsibilities
  providerResponsibilities: z.string().min(1, 'Provider responsibilities are required'),
  clientResponsibilities: z.string().min(1, 'Client responsibilities are required'),
  mutualResponsibilities: z.string().optional(),
  resourceProvision: z.string().optional(),
  
  // Change Management
  changeRequestProcess: z.string().optional(),
  approvalProcedure: z.string().optional(),
  implementationProcess: z.string().optional(),
  impactAssessment: z.string().optional(),
  
  // Risk and Security
  securityRequirements: z.string().optional(),
  dataProtection: z.string().optional(),
  backupRequirements: z.string().optional(),
  disasterRecovery: z.string().optional(),
  riskManagement: z.string().optional(),
  
  // Compliance
  regulatoryCompliance: z.string().optional(),
  industryStandards: z.string().optional(),
  certificationRequirements: z.string().optional(),
  auditCompliance: z.string().optional(),
  
  // Termination
  terminationClause: z.string().optional(),
  noticePeriod: z.string().default('30 days'),
  terminationReasons: z.string().optional(),
  dataReturnProcedure: z.string().optional(),
  transitionPlan: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  escalationMatrix: z.string().optional(),
  governingLaw: z.string().optional(),
  
  // Additional Terms
  forceMainjeure: z.string().optional(),
  limitationOfLiability: z.string().optional(),
  indemnificationClause: z.string().optional(),
  confidentialityClause: z.boolean().default(false),
  additionalTerms: z.string().optional(),
  
  // Signatures
  providerSignatureDate: z.string().optional(),
  clientSignatureDate: z.string().optional(),
});