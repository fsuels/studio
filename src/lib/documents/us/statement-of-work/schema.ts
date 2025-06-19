// src/lib/documents/us/statement-of-work/schema.ts
import { z } from 'zod';

export const StatementOfWorkSchema = z.object({
  // Project Information
  projectTitle: z.string().min(1, 'Project title is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectObjectives: z.string().min(1, 'Project objectives are required'),
  projectBackground: z.string().optional(),
  
  // Parties
  client: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientContact: z.string().optional(),
  
  contractor: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorContact: z.string().optional(),
  
  // Scope of Work
  scopeDescription: z.string().min(1, 'Scope description is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  tasksAndActivities: z.string().optional(),
  workLocation: z.string().optional(),
  inclusionsExclusions: z.string().optional(),
  
  // Timeline and Schedule
  projectStartDate: z.string().min(1, 'Project start date is required'),
  projectEndDate: z.string().optional(),
  projectDuration: z.string().optional(),
  keyMilestones: z.string().optional(),
  deliverySchedule: z.string().optional(),
  criticalPath: z.string().optional(),
  
  // Resources and Requirements
  resourceRequirements: z.string().optional(),
  personnelAssigned: z.string().optional(),
  equipmentNeeded: z.string().optional(),
  materialRequirements: z.string().optional(),
  facilityRequirements: z.string().optional(),
  
  // Financial Terms
  totalProjectValue: z.number().optional(),
  paymentStructure: z.string().optional(),
  paymentSchedule: z.enum(['milestone-based', 'monthly', 'completion', 'time-and-materials']).optional(),
  paymentTerms: z.string().optional(),
  expenseReimbursement: z.string().optional(),
  
  // Quality and Standards
  qualityStandards: z.string().optional(),
  acceptanceCriteria: z.string().min(1, 'Acceptance criteria are required'),
  testingRequirements: z.string().optional(),
  reviewProcesses: z.string().optional(),
  complianceRequirements: z.string().optional(),
  
  // Responsibilities
  clientResponsibilities: z.string().optional(),
  contractorResponsibilities: z.string().min(1, 'Contractor responsibilities are required'),
  sharedResponsibilities: z.string().optional(),
  communicationPlan: z.string().optional(),
  
  // Risk Management
  identifiedRisks: z.string().optional(),
  riskMitigation: z.string().optional(),
  contingencyPlans: z.string().optional(),
  assumptionsDependencies: z.string().optional(),
  
  // Change Management
  changeControlProcess: z.string().optional(),
  approvalProcedure: z.string().optional(),
  changeOrderProcess: z.string().optional(),
  impactAssessment: z.string().optional(),
  
  // Intellectual Property
  ipOwnership: z.enum(['client', 'contractor', 'shared', 'retained']).optional(),
  ipLicensing: z.string().optional(),
  workForHire: z.boolean().default(false),
  confidentialityRequirements: z.string().optional(),
  
  // Performance Monitoring
  performanceMetrics: z.string().optional(),
  reportingRequirements: z.string().optional(),
  meetingSchedule: z.string().optional(),
  statusUpdates: z.string().optional(),
  
  // Termination and Completion
  completionCriteria: z.string().optional(),
  terminationClause: z.string().optional(),
  deliverableHandover: z.string().optional(),
  postCompletionSupport: z.string().optional(),
  warrantyProvisions: z.string().optional(),
  
  // Legal and Compliance
  governingLaw: z.string().optional(),
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).optional(),
  limitationOfLiability: z.string().optional(),
  indemnificationClause: z.string().optional(),
  insuranceRequirements: z.string().optional(),
  
  // Additional Terms
  specialProvisions: z.string().optional(),
  additionalTerms: z.string().optional(),
  attachments: z.string().optional(),
  
  // Signatures
  clientSignatureDate: z.string().optional(),
  contractorSignatureDate: z.string().optional(),
});