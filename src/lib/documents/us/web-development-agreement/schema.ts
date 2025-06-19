import { z } from 'zod';

export const webDevelopmentAgreementSchema = z.object({
  // Parties
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  developerName: z.string().min(1, 'Developer name is required'),
  developerAddress: z.string().min(1, 'Developer address is required'),
  
  // Project Details
  projectName: z.string().min(1, 'Project name is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  websiteUrl: z.string().optional(),
  
  // Scope of Work
  scopeOfWork: z.array(z.string()).min(1, 'At least one scope item is required'),
  deliverables: z.array(z.string()).min(1, 'At least one deliverable is required'),
  
  // Technical Specifications
  technicalRequirements: z.object({
    platforms: z.array(z.string()).default(['Web']),
    technologies: z.array(z.string()).optional(),
    browsers: z.array(z.string()).default(['Chrome', 'Firefox', 'Safari', 'Edge']),
    responsiveDesign: z.boolean().default(true),
    hosting: z.string().optional()
  }),
  
  // Timeline
  projectStartDate: z.string().min(1, 'Project start date is required'),
  projectEndDate: z.string().min(1, 'Project end date is required'),
  milestones: z.array(z.object({
    name: z.string().min(1, 'Milestone name is required'),
    description: z.string().optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    payment: z.number().min(0).optional()
  })).optional(),
  
  // Payment Terms
  totalProjectCost: z.number().min(0, 'Total project cost must be non-negative'),
  paymentStructure: z.enum(['fixed', 'hourly', 'milestone-based']),
  hourlyRate: z.number().min(0).optional(),
  paymentSchedule: z.string().min(1, 'Payment schedule is required'),
  
  // Intellectual Property
  intellectualProperty: z.object({
    ownership: z.enum(['client', 'developer', 'shared']).default('client'),
    sourceCodeOwnership: z.enum(['client', 'developer', 'licensed']).default('client'),
    thirdPartyComponents: z.boolean().default(true)
  }),
  
  // Content and Materials
  contentResponsibility: z.enum(['client', 'developer', 'shared']).default('client'),
  contentDeadline: z.string().optional(),
  
  // Revisions and Changes
  revisionsIncluded: z.number().min(0).default(3),
  changeRequestProcess: z.string().optional(),
  additionalWorkRate: z.number().min(0).optional(),
  
  // Support and Maintenance
  supportPeriod: z.string().default('30 days'),
  maintenanceIncluded: z.boolean().default(false),
  maintenanceTerms: z.string().optional(),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  
  // Termination
  terminationClause: z.boolean().default(true),
  terminationNotice: z.string().default('30 days'),
  
  // Additional Terms
  additionalTerms: z.string().optional(),
  
  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
});