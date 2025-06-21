// src/lib/documents/us/sports-agreement/schema.ts
import { z } from 'zod';

export const SportsAgreementSchema = z.object({
  // Organization/Team Information
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationAddress: z.string().optional(),
  organizationContact: z.string().optional(),
  organizationEmail: z.string().email().optional(),
  teamName: z.string().optional(),

  // Athlete/Participant Information
  athleteName: z.string().min(1, 'Athlete name is required'),
  athleteAddress: z.string().optional(),
  athletePhone: z.string().optional(),
  athleteEmail: z.string().email().optional(),
  athleteAge: z.string().optional(),

  // Guardian Information (if minor)
  isMinor: z.boolean().default(false),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianContact: z.string().optional(),

  // Sport and Position
  sportType: z.string().min(1, 'Sport type is required'),
  position: z.string().optional(),
  skillLevel: z
    .enum(['beginner', 'intermediate', 'advanced', 'professional'])
    .default('intermediate'),
  experienceLevel: z.string().optional(),

  // Agreement Type
  agreementType: z
    .enum([
      'player-contract',
      'coaching',
      'training',
      'facility-use',
      'sponsorship',
    ])
    .default('player-contract'),
  serviceDescription: z.string().optional(),
  participationLevel: z
    .enum(['recreational', 'competitive', 'professional'])
    .default('recreational'),

  // Term and Duration
  seasonStart: z.string().optional(),
  seasonEnd: z.string().optional(),
  agreementDuration: z.string().optional(),
  renewalOptions: z.boolean().default(false),

  // Training and Practice
  practiceSchedule: z.string().optional(),
  trainingRequirements: z.string().optional(),
  attendanceRequirements: z.string().optional(),
  fitnessRequirements: z.string().optional(),

  // Competition and Games
  competitionSchedule: z.string().optional(),
  travelRequirements: z.boolean().default(false),
  gameAvailability: z.string().optional(),
  tournamentParticipation: z.boolean().default(false),

  // Financial Terms
  compensationType: z
    .enum(['none', 'salary', 'stipend', 'prize-money', 'scholarships'])
    .default('none'),
  compensationAmount: z.string().optional(),
  paymentSchedule: z
    .enum(['weekly', 'monthly', 'seasonal', 'per-game'])
    .optional(),
  expenseReimbursement: z.boolean().default(false),

  // Equipment and Uniforms
  equipmentProvided: z.boolean().default(false),
  equipmentList: z.string().optional(),
  uniformProvided: z.boolean().default(false),
  equipmentResponsibility: z.string().optional(),

  // Health and Safety
  medicalClearance: z.boolean().default(false),
  physicalExamRequired: z.boolean().default(false),
  insuranceRequired: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  injuryProtocol: z.string().optional(),

  // Performance Standards
  performanceExpectations: z.string().optional(),
  conductStandards: z.string().optional(),
  disciplinaryProcedures: z.string().optional(),
  academicRequirements: z.string().optional(),

  // Media and Publicity
  mediaRights: z.boolean().default(false),
  publicityRights: z.boolean().default(false),
  socialMediaPolicy: z.string().optional(),
  interviewRequirements: z.boolean().default(false),

  // Drug Testing
  drugTestingPolicy: z.boolean().default(false),
  substanceAbusePolicy: z.string().optional(),
  performanceEnhancingDrugs: z.boolean().default(false),

  // Liability and Waivers
  liabilityWaiver: z.boolean().default(true),
  assumptionOfRisk: z.boolean().default(true),
  medicalTreatmentConsent: z.boolean().default(true),
  injuryRiskAcknowledgment: z.boolean().default(true),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  medicalInformation: z.string().optional(),

  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  suspensionPolicy: z.string().optional(),
  transferPolicy: z.string().optional(),

  // Code of Conduct
  behaviorStandards: z.string().optional(),
  teamRules: z.string().optional(),
  sportsmanship: z.boolean().default(true),
  respectPolicy: z.boolean().default(true),

  // Intellectual Property
  imageRights: z.boolean().default(false),
  nameUsageRights: z.boolean().default(false),
  merchandisingRights: z.boolean().default(false),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),

  // Signature Requirements
  requireOrganizationSignature: z.boolean().default(true),
  requireAthleteSignature: z.boolean().default(true),
  requireGuardianSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
