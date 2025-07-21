// src/lib/documents/us/parenting-plan/schema.ts
import { z } from 'zod';

export const ParentingPlanSchema = z.object({
  // Parent Information
  parent1Name: z.string().min(1, 'First parent name is required'),
  parent1Address: z.string().optional(),
  parent1Phone: z.string().optional(),
  parent1Email: z.string().email().optional(),

  parent2Name: z.string().min(1, 'Second parent name is required'),
  parent2Address: z.string().optional(),
  parent2Phone: z.string().optional(),
  parent2Email: z.string().email().optional(),

  // Children Information
  childrenNames: z.string().optional(),
  childrenAges: z.string().optional(),
  childrenBirthDates: z.string().optional(),
  childrenSpecialNeeds: z.string().optional(),

  // Legal Custody
  legalCustody: z
    .enum(['joint', 'parent1-sole', 'parent2-sole'])
    .default('joint'),
  majorDecisions: z.enum(['joint', 'parent1', 'parent2']).default('joint'),
  educationalDecisions: z
    .enum(['joint', 'parent1', 'parent2'])
    .default('joint'),
  medicalDecisions: z.enum(['joint', 'parent1', 'parent2']).default('joint'),
  religiousDecisions: z.enum(['joint', 'parent1', 'parent2']).default('joint'),

  // Physical Custody
  physicalCustody: z
    .enum(['joint', 'parent1-primary', 'parent2-primary'])
    .default('joint'),
  residentialSchedule: z.string().optional(),
  weekdaySchedule: z.string().optional(),
  weekendSchedule: z.string().optional(),
  alternatingWeeks: z.boolean().default(false),

  // Holiday Schedule
  holidayRotation: z.boolean().default(true),
  holidaySchedule: z.string().optional(),
  springBreak: z.enum(['parent1', 'parent2', 'alternate']).default('alternate'),
  summerBreak: z.enum(['parent1', 'parent2', 'split']).default('split'),
  winterBreak: z.enum(['parent1', 'parent2', 'alternate']).default('alternate'),

  // Transportation
  transportationResponsibility: z
    .enum(['parent1', 'parent2', 'shared', 'exchanging-parent'])
    .default('exchanging-parent'),
  exchangeLocation: z.string().optional(),
  exchangeTime: z.string().optional(),
  longDistanceTransportation: z
    .enum(['shared', 'requesting-parent'])
    .default('requesting-parent'),

  // Communication
  communicationMethod: z
    .enum(['phone', 'video-call', 'text', 'email'])
    .default('phone'),
  communicationSchedule: z.string().optional(),
  phoneAccessRules: z.string().optional(),
  parentCommunication: z
    .enum(['direct', 'through-app', 'email-only'])
    .default('direct'),

  // Child Support
  childSupportPayer: z.enum(['parent1', 'parent2', 'none']).optional(),
  childSupportAmount: z.string().optional(),
  childSupportSchedule: z
    .enum(['weekly', 'bi-weekly', 'monthly'])
    .default('monthly'),
  extraExpenses: z.enum(['shared', 'parent1', 'parent2']).default('shared'),

  // Education
  schoolChoice: z
    .enum(['mutual-agreement', 'residential-parent', 'parent1', 'parent2'])
    .default('mutual-agreement'),
  schoolActivities: z
    .enum(['both-attend', 'residential-parent', 'alternating'])
    .default('both-attend'),
  parentTeacherConferences: z
    .enum(['both-attend', 'separate', 'alternating'])
    .default('both-attend'),
  educationalExpenses: z
    .enum(['shared', 'parent1', 'parent2'])
    .default('shared'),

  // Healthcare
  healthInsuranceProvider: z
    .enum(['parent1', 'parent2', 'both'])
    .default('parent1'),
  medicalExpenses: z.enum(['shared', 'parent1', 'parent2']).default('shared'),
  medicalDecisionMaking: z
    .enum(['joint', 'parent1', 'parent2'])
    .default('joint'),
  emergencyMedicalCare: z.string().optional(),

  // Extracurricular Activities
  activityDecisions: z
    .enum(['joint', 'residential-parent', 'parent1', 'parent2'])
    .default('joint'),
  activityTransportation: z
    .enum(['shared', 'enrolling-parent', 'residential-parent'])
    .default('enrolling-parent'),
  activityExpenses: z.enum(['shared', 'enrolling-parent']).default('shared'),

  // Travel and Relocation
  travelNotification: z.string().optional(),
  outOfStateTravel: z.boolean().default(true),
  internationalTravel: z.boolean().default(false),
  relocationNotice: z.string().optional(),
  relocationApproval: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['direct-discussion', 'mediation', 'parenting-coordinator', 'court'])
    .default('mediation'),
  mediatorSelection: z
    .enum(['mutual-agreement', 'court-appointed'])
    .default('mutual-agreement'),
  parentingCoordinator: z.boolean().default(false),

  // Special Circumstances
  domesticViolence: z.boolean().default(false),
  supervisedVisitation: z.boolean().default(false),
  substanceAbuse: z.boolean().default(false),
  mentalHealthConcerns: z.boolean().default(false),
  restrictiveConditions: z.string().optional(),

  // Modification
  modificationRequirements: z.string().optional(),
  reviewSchedule: z
    .enum(['annual', 'bi-annual', 'as-needed'])
    .default('as-needed'),
  significantChange: z.string().optional(),

  // Technology and Social Media
  technologyRules: z.string().optional(),
  socialMediaPolicy: z.string().optional(),
  deviceTransfer: z.boolean().default(true),
  onlinePrivacy: z.boolean().default(true),

  // Signature Requirements
  parent1Signature: z.boolean().default(true),
  parent2Signature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
