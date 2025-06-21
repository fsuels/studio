// src/lib/documents/us/internship-agreement/schema.ts
import { z } from 'zod';

export const InternshipAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyContact: z.string().optional(),
  companyEmail: z.string().email().optional(),

  // Intern Information
  internName: z.string().min(1, 'Intern name is required'),
  internAddress: z.string().min(1, 'Intern address is required'),
  internPhone: z.string().optional(),
  internEmail: z.string().email().optional(),

  // Educational Institution
  schoolName: z.string().optional(),
  schoolProgram: z.string().optional(),
  academicCredit: z.boolean().default(false),
  schoolSupervisor: z.string().optional(),

  // Internship Details
  internshipTitle: z.string().min(1, 'Internship title is required'),
  department: z.string().optional(),
  supervisor: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),

  // Schedule and Hours
  hoursPerWeek: z.string().optional(),
  workSchedule: z.string().optional(),
  flexibleSchedule: z.boolean().default(false),
  remoteWork: z.boolean().default(false),

  // Compensation
  compensationType: z
    .enum(['paid', 'unpaid', 'stipend', 'academic-credit'])
    .default('unpaid'),
  hourlyRate: z.string().optional(),
  stipendAmount: z.string().optional(),
  expenseReimbursement: z.boolean().default(false),

  // Responsibilities
  jobDescription: z.string().min(1, 'Job description is required'),
  learningObjectives: z.string().optional(),
  projectAssignments: z.string().optional(),
  reportingStructure: z.string().optional(),

  // Training and Development
  orientationProvided: z.boolean().default(true),
  trainingProgram: z.boolean().default(false),
  mentorshipProgram: z.boolean().default(false),
  skillDevelopment: z.string().optional(),

  // Evaluation and Feedback
  performanceEvaluations: z.boolean().default(true),
  evaluationFrequency: z.string().optional(),
  feedbackSessions: z.boolean().default(true),
  finalEvaluation: z.boolean().default(true),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  proprietaryInformation: z.boolean().default(true),

  // Intellectual Property
  workProduct: z.enum(['company', 'intern', 'shared']).default('company'),
  inventionsAssignment: z.boolean().default(false),
  copyrightAssignment: z.boolean().default(false),

  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  earlyTermination: z.boolean().default(true),

  // Legal Compliance
  equalOpportunity: z.boolean().default(true),
  backgroundCheck: z.boolean().default(false),
  drugTesting: z.boolean().default(false),

  // Signature Requirements
  requireCompanySignature: z.boolean().default(true),
  requireInternSignature: z.boolean().default(true),
  requireSchoolSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
