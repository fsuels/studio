// src/lib/documents/us/tutoring-agreement/schema.ts
import { z } from 'zod';

export const TutoringAgreementSchema = z.object({
  // Tutor Information
  tutorName: z.string().min(1, 'Tutor name is required'),
  tutorAddress: z.string().optional(),
  tutorPhone: z.string().optional(),
  tutorEmail: z.string().email().optional(),
  tutorQualifications: z.string().optional(),
  tutorCertifications: z.string().optional(),

  // Student Information
  studentName: z.string().min(1, 'Student name is required'),
  studentAge: z.string().optional(),
  studentGrade: z.string().optional(),
  studentSchool: z.string().optional(),
  studentEmail: z.string().email().optional(),

  // Parent/Guardian Information
  parentName: z.string().optional(),
  parentAddress: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentRelationship: z.string().optional(),

  // Tutoring Details
  subjects: z.string().optional(),
  gradeLevel: z.string().optional(),
  tutoringGoals: z.string().optional(),
  specificNeeds: z.string().optional(),
  learningStyle: z.string().optional(),

  // Session Details
  sessionLocation: z
    .enum(['tutor-home', 'student-home', 'library', 'online', 'other'])
    .default('student-home'),
  sessionDuration: z.string().optional(),
  sessionFrequency: z
    .enum(['daily', 'weekly', 'bi-weekly', 'as-needed'])
    .default('weekly'),
  sessionsPerWeek: z.string().optional(),
  totalSessions: z.string().optional(),

  // Schedule
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  preferredDays: z.string().optional(),
  preferredTimes: z.string().optional(),
  scheduleFlexibility: z.boolean().default(false),

  // Fees and Payment
  hourlyRate: z.string().optional(),
  sessionRate: z.string().optional(),
  packageRate: z.string().optional(),
  paymentSchedule: z
    .enum(['per-session', 'weekly', 'monthly', 'package'])
    .default('per-session'),
  paymentMethod: z
    .enum(['cash', 'check', 'electronic', 'other'])
    .default('cash'),

  // Materials and Resources
  materialsProvided: z.enum(['tutor', 'student', 'shared']).default('shared'),
  textbooksRequired: z.string().optional(),
  suppliesRequired: z.string().optional(),
  onlineResources: z.boolean().default(false),
  homeworkHelp: z.boolean().default(true),

  // Academic Support
  testPreparation: z.boolean().default(false),
  standardizedTestPrep: z.string().optional(),
  studySkills: z.boolean().default(false),
  organizationalSkills: z.boolean().default(false),
  progressReports: z.boolean().default(true),

  // Communication
  parentCommunication: z.boolean().default(true),
  communicationFrequency: z
    .enum(['after-each-session', 'weekly', 'monthly', 'as-needed'])
    .default('weekly'),
  communicationMethod: z
    .enum(['email', 'phone', 'text', 'in-person'])
    .default('email'),
  emergencyContact: z.string().optional(),

  // Policies
  cancellationPolicy: z.string().optional(),
  cancellationNotice: z.string().optional(),
  makeupSessions: z.boolean().default(true),
  latePolicy: z.string().optional(),
  noShowPolicy: z.string().optional(),

  // Background Check
  backgroundCheckCompleted: z.boolean().default(false),
  backgroundCheckDate: z.string().optional(),
  referencesProvided: z.boolean().default(false),
  insuranceCoverage: z.boolean().default(false),

  // Special Accommodations
  learningDisabilities: z.boolean().default(false),
  accommodationsRequired: z.string().optional(),
  iepOrPlan: z.boolean().default(false),
  behavioralConcerns: z.boolean().default(false),

  // Progress Tracking
  assessmentMethod: z.string().optional(),
  progressMetrics: z.string().optional(),
  reportingSchedule: z.string().optional(),
  parentConferences: z.boolean().default(false),

  // Online Tutoring
  onlinePlatform: z.string().optional(),
  technicalRequirements: z.string().optional(),
  recordingSessions: z.boolean().default(false),
  screenSharing: z.boolean().default(true),

  // Liability and Safety
  liabilityWaiver: z.boolean().default(true),
  photoRelease: z.boolean().default(false),
  transportationLiability: z.boolean().default(false),
  emergencyMedicalConsent: z.boolean().default(false),

  // Termination
  terminationNotice: z.string().optional(),
  refundPolicy: z.string().optional(),
  finalSessionRequirements: z.string().optional(),
  recordsTransfer: z.boolean().default(true),

  // Confidentiality
  studentPrivacy: z.boolean().default(true),
  academicRecordsAccess: z.boolean().default(false),
  sharingWithSchool: z.boolean().default(false),
  testimonialConsent: z.boolean().default(false),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['discussion', 'mediation', 'arbitration', 'court'])
    .default('discussion'),

  // Signature Requirements
  requireTutorSignature: z.boolean().default(true),
  requireParentSignature: z.boolean().default(true),
  requireStudentSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
