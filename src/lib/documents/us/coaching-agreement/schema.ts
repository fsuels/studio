// src/lib/documents/us/coaching-agreement/schema.ts
import { z } from 'zod';

export const CoachingAgreementSchema = z.object({
  // Coach Information
  coachName: z.string().min(1, 'Coach name is required'),
  coachBusinessName: z.string().optional(),
  coachAddress: z.string().optional(),
  coachPhone: z.string().optional(),
  coachEmail: z.string().email().optional(),
  coachCertifications: z.string().optional(),
  
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientCompany: z.string().optional(),
  
  // Coaching Details
  coachingType: z.enum(['life', 'business', 'executive', 'career', 'health', 'relationship', 'spiritual', 'other']).default('life'),
  coachingDescription: z.string().optional(),
  coachingGoals: z.string().optional(),
  coachingApproach: z.string().optional(),
  
  // Session Details
  sessionFormat: z.enum(['in-person', 'phone', 'video', 'hybrid']).default('phone'),
  sessionDuration: z.string().optional(),
  sessionFrequency: z.enum(['weekly', 'bi-weekly', 'monthly', 'as-needed']).default('weekly'),
  numberOfSessions: z.string().optional(),
  totalHours: z.string().optional(),
  
  // Schedule
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sessionSchedule: z.string().optional(),
  reschedulingPolicy: z.string().optional(),
  cancellationNotice: z.string().optional(),
  
  // Fees and Payment
  feeStructure: z.enum(['per-session', 'package', 'monthly-retainer', 'hourly']).default('per-session'),
  sessionRate: z.string().optional(),
  packagePrice: z.string().optional(),
  totalFee: z.string().optional(),
  paymentTerms: z.string().optional(),
  refundPolicy: z.string().optional(),
  
  // Coaching Scope
  coachingScope: z.string().optional(),
  includedServices: z.string().optional(),
  excludedServices: z.string().optional(),
  homeworkAssignments: z.boolean().default(false),
  assessmentsIncluded: z.boolean().default(false),
  
  // Communication
  communicationBetweenSessions: z.boolean().default(false),
  emergencySupport: z.boolean().default(false),
  responseTime: z.string().optional(),
  preferredCommunication: z.enum(['email', 'phone', 'text', 'none']).default('email'),
  
  // Confidentiality
  confidentialityAgreement: z.boolean().default(true),
  confidentialityExceptions: z.string().optional(),
  recordKeeping: z.string().optional(),
  sessionRecording: z.boolean().default(false),
  recordingConsent: z.boolean().default(false),
  
  // Professional Boundaries
  professionalBoundaries: z.string().optional(),
  dualRelationships: z.boolean().default(false),
  giftPolicy: z.string().optional(),
  socialMediaPolicy: z.string().optional(),
  
  // Client Responsibilities
  clientCommitment: z.string().optional(),
  homeworkExpectations: z.string().optional(),
  honestyCommunication: z.boolean().default(true),
  feedbackExpectations: z.string().optional(),
  
  // Coach Responsibilities
  coachCommitment: z.string().optional(),
  professionalStandards: z.string().optional(),
  continuingEducation: z.boolean().default(true),
  supervisionConsultation: z.boolean().default(false),
  
  // Results and Guarantees
  noGuaranteeClause: z.boolean().default(true),
  successMetrics: z.string().optional(),
  progressReviews: z.boolean().default(true),
  outcomeExpectations: z.string().optional(),
  
  // Intellectual Property
  materialOwnership: z.enum(['coach', 'client', 'shared']).default('coach'),
  clientContentUsage: z.boolean().default(false),
  testimonialRights: z.boolean().default(false),
  caseStudyRights: z.boolean().default(false),
  
  // Termination
  terminationByClient: z.string().optional(),
  terminationByCoach: z.string().optional(),
  terminationNotice: z.string().optional(),
  finalSessionRequirements: z.string().optional(),
  postTerminationObligations: z.string().optional(),
  
  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  professionalLiabilityInsurance: z.boolean().default(false),
  disclaimerOfGuarantees: z.boolean().default(true),
  indemnification: z.boolean().default(true),
  
  // Special Provisions
  referralPolicy: z.string().optional(),
  groupCoaching: z.boolean().default(false),
  substituteCoach: z.boolean().default(false),
  travelExpenses: z.boolean().default(false),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'court']).default('mediation'),
  entireAgreement: z.boolean().default(true),
  
  // Signature Requirements
  requireCoachSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});