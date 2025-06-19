// src/lib/documents/us/construction-management-agreement/schema.ts
import { z } from 'zod';

export const constructionmanagementagreementSchema = z.object({
  // Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().min(1, 'Owner phone is required'),
  ownerEmail: z.string().email().optional(),
  
  // Construction Manager Information
  managerName: z.string().min(1, 'Construction manager name is required'),
  managerAddress: z.string().min(1, 'Construction manager address is required'),
  managerPhone: z.string().min(1, 'Construction manager phone is required'),
  managerEmail: z.string().email().optional(),
  managerLicense: z.string().min(1, 'Construction manager license is required'),
  
  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectType: z.enum(['residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other']),
  
  // Management Services
  serviceType: z.enum(['cm-at-risk', 'agency-cm', 'guaranteed-maximum-price', 'cost-plus-fee']),
  managementPhases: z.array(z.enum(['pre-construction', 'construction', 'post-construction'])).min(1),
  
  // Pre-Construction Services
  preConstructionServices: z.array(z.string()).default([]),
  designReview: z.boolean().default(false),
  costEstimating: z.boolean().default(true),
  scheduleDevelopment: z.boolean().default(true),
  valueEngineering: z.boolean().default(false),
  permitAssistance: z.boolean().default(false),
  
  // Construction Services
  constructionServices: z.array(z.string()).default([]),
  projectSupervision: z.boolean().default(true),
  contractorManagement: z.boolean().default(true),
  qualityControl: z.boolean().default(true),
  safetyManagement: z.boolean().default(true),
  progressReporting: z.boolean().default(true),
  changeOrderManagement: z.boolean().default(true),
  
  // Post-Construction Services
  postConstructionServices: z.array(z.string()).default([]),
  finalInspections: z.boolean().default(false),
  warrantyManagement: z.boolean().default(false),
  closeoutDocumentation: z.boolean().default(false),
  
  // Contract Details
  contractDate: z.string().min(1, 'Contract date is required'),
  serviceCommencementDate: z.string().min(1, 'Service commencement date is required'),
  projectCompletionDate: z.string().min(1, 'Project completion date is required'),
  
  // Compensation Structure
  compensationType: z.enum(['fixed-fee', 'percentage-of-cost', 'cost-plus-fee', 'hourly-rate', 'lump-sum']),
  managementFee: z.string().min(1, 'Management fee is required'),
  feePercentage: z.string().optional(),
  hourlyRates: z.array(z.object({
    position: z.string(),
    rate: z.string(),
  })).default([]),
  reimbursableExpenses: z.boolean().default(true),
  
  // Project Budget and Cost Control
  projectBudget: z.string().optional(),
  costControlResponsibilities: z.array(z.string()).default([]),
  budgetReporting: z.boolean().default(true),
  costReportingFrequency: z.enum(['weekly', 'bi-weekly', 'monthly']).default('monthly'),
  
  // Authority and Responsibilities
  managerAuthority: z.array(z.string()).default([]),
  ownerApprovalRequired: z.array(z.string()).default([]),
  contractorSelectionMethod: z.enum(['owner-selects', 'manager-recommends', 'joint-selection']),
  purchasingAuthority: z.string().optional(),
  changeOrderAuthority: z.string().optional(),
  
  // Performance Standards
  performanceStandards: z.array(z.string()).default([]),
  keyPerformanceIndicators: z.array(z.object({
    indicator: z.string(),
    target: z.string(),
  })).default([]),
  reportingRequirements: z.array(z.string()).default([]),
  meetingSchedule: z.string().optional(),
  
  // Risk Management
  riskManagementPlan: z.boolean().default(false),
  riskAllocation: z.array(z.object({
    risk: z.string(),
    responsibility: z.enum(['owner', 'manager', 'shared']),
  })).default([]),
  contingencyManagement: z.boolean().default(false),
  
  // Insurance Requirements
  generalLiabilityInsurance: z.string().min(1, 'General liability insurance amount is required'),
  professionalLiabilityInsurance: z.string().optional(),
  errorAndOmissionsInsurance: z.boolean().default(false),
  workersCompensation: z.boolean().default(true),
  
  // Indemnification
  managerIndemnifiesOwner: z.boolean().default(true),
  ownerIndemnifiesManager: z.boolean().default(false),
  mutualIndemnification: z.boolean().default(false),
  indemnificationScope: z.string().optional(),
  
  // Intellectual Property
  intellectualPropertyRights: z.enum(['owner-retains', 'manager-retains', 'shared']),
  workProductOwnership: z.enum(['owner', 'manager', 'shared']),
  documentRetention: z.boolean().default(true),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  proprietaryInformationProtection: z.boolean().default(true),
  
  // Termination
  terminationForConvenience: z.boolean().default(true),
  terminationForCause: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationCompensation: z.string().optional(),
  
  // Dispute Resolution
  disputeResolutionMethod: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']),
  governingLaw: z.string().optional(),
  venueJurisdiction: z.string().optional(),
  
  // Technology and Communication
  projectManagementSoftware: z.string().optional(),
  communicationProtocols: z.array(z.string()).default([]),
  documentManagementSystem: z.boolean().default(false),
  
  // Sustainability and Environmental
  sustainabilityGoals: z.array(z.string()).default([]),
  environmentalCompliance: z.boolean().default(true),
  leedCertificationSupport: z.boolean().default(false),
  
  // Additional Services
  additionalServices: z.array(z.object({
    service: z.string(),
    description: z.string(),
    compensation: z.string(),
  })).default([]),
  
  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  forceMajeureEvents: z.array(z.string()).default([]),
  
  // Signatures
  requireOwnerSignature: z.boolean().default(true),
  requireManagerSignature: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
});