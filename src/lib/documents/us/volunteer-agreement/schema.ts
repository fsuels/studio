// src/lib/documents/us/volunteer-agreement/schema.ts
import { z } from 'zod';

export const VolunteerAgreementSchema = z.object({
  // Organization Information
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationAddress: z.string().min(1, 'Organization address is required'),
  organizationContact: z.string().optional(),
  organizationEmail: z.string().email().optional(),
  organizationType: z
    .enum(['non-profit', 'charity', 'religious', 'educational', 'government'])
    .default('non-profit'),

  // Volunteer Information
  volunteerName: z.string().min(1, 'Volunteer name is required'),
  volunteerAddress: z.string().min(1, 'Volunteer address is required'),
  volunteerPhone: z.string().optional(),
  volunteerEmail: z.string().email().optional(),
  emergencyContact: z.string().optional(),

  // Volunteer Role
  volunteerPosition: z.string().min(1, 'Volunteer position is required'),
  roleDescription: z.string().min(1, 'Role description is required'),
  department: z.string().optional(),
  supervisor: z.string().optional(),

  // Schedule and Commitment
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  hoursPerWeek: z.string().optional(),
  schedule: z.string().optional(),
  flexibleSchedule: z.boolean().default(true),
  minimumCommitment: z.string().optional(),

  // Training and Orientation
  orientationRequired: z.boolean().default(true),
  trainingProvided: z.boolean().default(true),
  backgroundCheckRequired: z.boolean().default(false),
  referencesRequired: z.boolean().default(false),

  // Responsibilities
  volunteerDuties: z.string().optional(),
  performanceExpectations: z.string().optional(),
  reportingRequirements: z.string().optional(),
  attendanceExpectations: z.string().optional(),

  // Benefits and Reimbursements
  expenseReimbursement: z.boolean().default(false),
  mealProvided: z.boolean().default(false),
  transportationProvided: z.boolean().default(false),
  recognitionProgram: z.boolean().default(false),
  volunteerBenefits: z.string().optional(),

  // Liability and Insurance
  liabilityWaiver: z.boolean().default(true),
  insuranceCoverage: z.boolean().default(false),
  workersCompensation: z.boolean().default(false),
  medicalInsurance: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  clientConfidentiality: z.boolean().default(true),
  organizationInformation: z.boolean().default(true),

  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  voluntaryTermination: z.boolean().default(true),
  involuntaryTermination: z.boolean().default(true),

  // Code of Conduct
  codeOfConduct: z.boolean().default(true),
  professionalismRequired: z.boolean().default(true),
  nonDiscrimination: z.boolean().default(true),
  appropriateBehavior: z.boolean().default(true),

  // Special Provisions
  backgroundCheckConsent: z.boolean().default(false),
  photographyConsent: z.boolean().default(false),
  mediaReleaseConsent: z.boolean().default(false),

  // Signature Requirements
  requireOrganizationSignature: z.boolean().default(true),
  requireVolunteerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
