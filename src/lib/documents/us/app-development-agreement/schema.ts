// src/lib/documents/us/app-development-agreement/schema.ts
import { z } from 'zod';

export const AppDevelopmentAgreementSchema = z.object({
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientCompany: z.string().optional(),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),

  // Developer Information
  developerName: z.string().min(1, 'Developer name is required'),
  developerCompany: z.string().optional(),
  developerAddress: z.string().optional(),
  developerPhone: z.string().optional(),
  developerEmail: z.string().email().optional(),

  // Project Overview
  projectName: z.string().min(1, 'Project name is required'),
  projectDescription: z.string().optional(),
  appType: z
    .enum([
      'mobile-ios',
      'mobile-android',
      'mobile-cross-platform',
      'web-app',
      'progressive-web-app',
    ])
    .default('mobile-cross-platform'),
  targetPlatforms: z.string().optional(),
  targetAudience: z.string().optional(),

  // Technical Specifications
  technicalRequirements: z.string().optional(),
  functionalRequirements: z.string().optional(),
  performanceRequirements: z.string().optional(),
  securityRequirements: z.string().optional(),
  compatibilityRequirements: z.string().optional(),

  // Features and Functionality
  coreFeatures: z.string().optional(),
  additionalFeatures: z.string().optional(),
  userAuthentication: z.boolean().default(false),
  pushNotifications: z.boolean().default(false),
  offlineCapability: z.boolean().default(false),
  apiIntegration: z.boolean().default(false),

  // Design Requirements
  designProvided: z
    .enum(['client', 'developer', 'collaborative'])
    .default('developer'),
  uiuxDesign: z.boolean().default(true),
  responsiveDesign: z.boolean().default(true),
  brandingGuidelines: z.string().optional(),
  accessibilityCompliance: z.boolean().default(false),

  // Development Timeline
  projectStartDate: z.string().optional(),
  estimatedCompletionDate: z.string().optional(),
  milestones: z.string().optional(),
  developmentPhases: z.string().optional(),
  testingTimeline: z.string().optional(),

  // Financial Terms
  totalProjectCost: z.string().optional(),
  paymentStructure: z
    .enum(['fixed-price', 'hourly', 'milestone-based', 'retainer'])
    .default('milestone-based'),
  hourlyRate: z.string().optional(),
  depositAmount: z.string().optional(),
  paymentSchedule: z.string().optional(),

  // Scope Management
  scopeOfWork: z.string().optional(),
  changeRequestProcess: z.string().optional(),
  additionalWorkRate: z.string().optional(),
  scopeCreepPolicy: z.string().optional(),

  // Testing and Quality Assurance
  testingIncluded: z.boolean().default(true),
  testingTypes: z.string().optional(),
  bugFixingPolicy: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  qualityAssurance: z.string().optional(),

  // Deployment and Launch
  appStoreSubmission: z.boolean().default(false),
  deploymentAssistance: z.boolean().default(true),
  serverSetup: z.boolean().default(false),
  domainConfiguration: z.boolean().default(false),
  launchSupport: z.string().optional(),

  // Intellectual Property
  codeOwnership: z.enum(['client', 'developer', 'shared']).default('client'),
  designOwnership: z.enum(['client', 'developer', 'shared']).default('client'),
  thirdPartyComponents: z.string().optional(),
  openSourceUsage: z.boolean().default(false),
  licensingAgreements: z.string().optional(),

  // Maintenance and Support
  maintenanceIncluded: z.boolean().default(false),
  maintenancePeriod: z.string().optional(),
  supportLevel: z
    .enum(['basic', 'standard', 'premium', 'none'])
    .default('basic'),
  responseTime: z.string().optional(),
  updatePolicy: z.string().optional(),

  // Data and Privacy
  dataHandling: z.string().optional(),
  privacyCompliance: z.boolean().default(true),
  gdprCompliance: z.boolean().default(false),
  dataBackup: z.boolean().default(true),
  dataOwnership: z.enum(['client', 'developer', 'shared']).default('client'),

  // Security Requirements
  securityMeasures: z.string().optional(),
  encryptionRequirements: z.boolean().default(false),
  penetrationTesting: z.boolean().default(false),
  securityAudit: z.boolean().default(false),
  complianceStandards: z.string().optional(),

  // Third-Party Integrations
  paymentIntegration: z.boolean().default(false),
  socialMediaIntegration: z.boolean().default(false),
  analyticsIntegration: z.boolean().default(false),
  cloudServices: z.boolean().default(false),
  externalAPIs: z.string().optional(),

  // Performance and Scalability
  performanceTargets: z.string().optional(),
  scalabilityRequirements: z.string().optional(),
  loadTesting: z.boolean().default(false),
  optimizationIncluded: z.boolean().default(true),

  // Documentation
  technicalDocumentation: z.boolean().default(true),
  userDocumentation: z.boolean().default(false),
  apiDocumentation: z.boolean().default(false),
  sourceCodeComments: z.boolean().default(true),
  deploymentGuide: z.boolean().default(true),

  // Termination and Cancellation
  terminationClause: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  workProductRights: z.string().optional(),
  refundPolicy: z.string().optional(),

  // Legal and Compliance
  warrantyPeriod: z.string().optional(),
  limitationOfLiability: z.boolean().default(true),
  indemnificationClause: z.boolean().default(true),
  governingLaw: z.string().optional(),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'court'])
    .default('mediation'),

  // Signature Requirements
  requireClientSignature: z.boolean().default(true),
  requireDeveloperSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
