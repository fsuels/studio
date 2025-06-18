// src/lib/documents/us/cloud-services-agreement/schema.ts
import { z } from 'zod';

export const CloudServicesAgreementSchema = z.object({
  // Provider Information
  providerName: z.string().min(1, 'Provider name is required'),
  providerAddress: z.string().optional(),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),
  
  // Customer Information
  customerName: z.string().min(1, 'Customer name is required'),
  customerAddress: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  
  // Service Description
  serviceType: z.enum(['iaas', 'paas', 'saas', 'hybrid', 'other']).default('saas'),
  serviceDescription: z.string().optional(),
  computingResources: z.string().optional(),
  storageCapacity: z.string().optional(),
  bandwidthAllocation: z.string().optional(),
  
  // Service Level Agreement
  uptimeGuarantee: z.string().optional(),
  availabilityTarget: z.string().optional(),
  responseTime: z.string().optional(),
  resolutionTime: z.string().optional(),
  maintenanceWindows: z.string().optional(),
  
  // Security
  securityMeasures: z.string().optional(),
  dataEncryption: z.boolean().default(true),
  accessControls: z.string().optional(),
  complianceStandards: z.string().optional(),
  securityAudits: z.boolean().default(false),
  
  // Data Management
  dataLocation: z.string().optional(),
  dataBackup: z.boolean().default(true),
  backupFrequency: z.string().optional(),
  dataRetention: z.string().optional(),
  dataPortability: z.boolean().default(true),
  
  // Pricing and Billing
  pricingModel: z.enum(['fixed', 'usage-based', 'tiered', 'freemium']).default('fixed'),
  monthlyFee: z.string().optional(),
  setupFee: z.string().optional(),
  usageCharges: z.string().optional(),
  billingCycle: z.enum(['monthly', 'quarterly', 'annually']).default('monthly'),
  
  // Support Services
  supportLevel: z.enum(['basic', 'standard', 'premium', '24x7']).default('standard'),
  supportChannels: z.string().optional(),
  technicalSupport: z.boolean().default(true),
  trainingProvided: z.boolean().default(false),
  documentationAccess: z.boolean().default(true),
  
  // Performance Monitoring
  performanceMetrics: z.string().optional(),
  monitoringTools: z.boolean().default(false),
  reportingFrequency: z.string().optional(),
  alertingSystem: z.boolean().default(false),
  
  // Disaster Recovery
  disasterRecovery: z.boolean().default(false),
  recoveryTimeObjective: z.string().optional(),
  recoveryPointObjective: z.string().optional(),
  businessContinuity: z.string().optional(),
  
  // Termination
  terminationNotice: z.string().optional(),
  dataReturnPolicy: z.string().optional(),
  serviceMigration: z.boolean().default(false),
  terminationFees: z.string().optional(),
  
  // Legal and Compliance
  dataProtectionLaws: z.boolean().default(true),
  industryCompliance: z.string().optional(),
  auditRights: z.boolean().default(false),
  governingLaw: z.string().optional(),
  
  // Signature Requirements
  requireProviderSignature: z.boolean().default(true),
  requireCustomerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});