// src/lib/documents/us/athletic-scholarship-agreement/schema.ts
import { z } from 'zod';

export const AthleticScholarshipAgreementSchema = z.object({
  // Student-Athlete Information
  studentName: z.string().min(1, 'Student name is required'),
  studentAddress: z.string().optional(),
  studentPhone: z.string().optional(),
  studentEmail: z.string().email().optional(),
  dateOfBirth: z.string().optional(),
  highSchool: z.string().optional(),
  graduationDate: z.string().optional(),
  
  // University Information
  universityName: z.string().min(1, 'University name is required'),
  universityAddress: z.string().optional(),
  athleticDepartment: z.string().optional(),
  coachName: z.string().optional(),
  coachPhone: z.string().optional(),
  coachEmail: z.string().email().optional(),
  
  // Sport and Position
  sport: z.enum(['football', 'basketball', 'baseball', 'soccer', 'tennis', 'track', 'swimming', 'golf', 'other']).optional(),
  position: z.string().optional(),
  skillLevel: z.enum(['division-i', 'division-ii', 'division-iii', 'naia', 'juco']).optional(),
  conference: z.string().optional(),
  
  // Scholarship Details
  scholarshipType: z.enum(['full-ride', 'partial', 'head-count', 'equivalency']).optional(),
  scholarshipAmount: z.string().optional(),
  scholarshipPercentage: z.string().optional(),
  tuitionCoverage: z.boolean().default(true),
  roomAndBoardCoverage: z.boolean().default(false),
  booksCoverage: z.boolean().default(false),
  
  // Academic Requirements
  gpaRequirement: z.string().optional(),
  academicStanding: z.string().optional(),
  degreeProgram: z.string().optional(),
  creditHourRequirement: z.string().optional(),
  academicProgress: z.boolean().default(true),
  
  // Athletic Commitments
  trainingRequirements: z.string().optional(),
  practiceSchedule: z.string().optional(),
  competitionCommitment: z.string().optional(),
  offSeasonTraining: z.boolean().default(true),
  strengthConditioning: z.boolean().default(true),
  
  // Eligibility Requirements
  ncaaEligibility: z.boolean().default(true),
  eligibilityMaintenance: z.boolean().default(true),
  amateurStatus: z.boolean().default(true),
  recruitingCompliance: z.boolean().default(true),
  
  // Duration and Renewal
  scholarshipDuration: z.enum(['one-year', 'multi-year', 'four-year', 'five-year']).default('one-year'),
  renewalConditions: z.string().optional(),
  graduationTimeline: z.string().optional(),
  redshirtPossibility: z.boolean().default(false),
  
  // Performance Standards
  athleticPerformance: z.string().optional(),
  academicPerformance: z.string().optional(),
  conductStandards: z.string().optional(),
  teamParticipation: z.boolean().default(true),
  
  // Medical and Health
  medicalExamination: z.boolean().default(true),
  healthInsurance: z.boolean().default(true),
  injuryProtocol: z.string().optional(),
  medicalClearance: z.boolean().default(true),
  drugTesting: z.boolean().default(true),
  
  // Financial Aid Integration
  academicAid: z.boolean().default(false),
  needBasedAid: z.boolean().default(false),
  workStudy: z.boolean().default(false),
  externalScholarships: z.boolean().default(true),
  
  // Conduct and Behavior
  codeOfConduct: z.boolean().default(true),
  socialMediaPolicy: z.boolean().default(true),
  substanceAbusePolicy: z.boolean().default(true),
  academicIntegrity: z.boolean().default(true),
  communityService: z.string().optional(),
  
  // Travel and Competition
  travelCommitment: z.boolean().default(true),
  competitionSchedule: z.string().optional(),
  awayGameTravel: z.boolean().default(true),
  postseasonPlay: z.boolean().default(true),
  
  // Equipment and Facilities
  equipmentProvided: z.boolean().default(true),
  facilityAccess: z.boolean().default(true),
  trainingFacilities: z.boolean().default(true),
  academicSupport: z.boolean().default(true),
  
  // Name, Image, Likeness (NIL)
  nilRights: z.boolean().default(true),
  endorsementApproval: z.boolean().default(true),
  commercialActivities: z.string().optional(),
  nilEducation: z.boolean().default(true),
  
  // Transfer Portal
  transferPolicy: z.string().optional(),
  transferRestrictions: z.string().optional(),
  portalEligibility: z.boolean().default(true),
  releaseRequirements: z.string().optional(),
  
  // Academic Support
  tutoring: z.boolean().default(true),
  studyHall: z.boolean().default(true),
  academicAdvisor: z.boolean().default(true),
  learningDisabilitySupport: z.boolean().default(false),
  
  // Life Skills
  lifeSkillsProgram: z.boolean().default(true),
  careerCounseling: z.boolean().default(true),
  financialLiteracy: z.boolean().default(true),
  leadershipDevelopment: z.boolean().default(false),
  
  // Housing and Dining
  dormitoryRequirement: z.boolean().default(false),
  mealPlan: z.boolean().default(false),
  housingAssignment: z.string().optional(),
  diningOptions: z.string().optional(),
  
  // Family and Guardian
  parentalInvolvement: z.string().optional(),
  guardianConsent: z.boolean().default(false),
  familyCommunication: z.string().optional(),
  emergencyContacts: z.string().optional(),
  
  // Termination Conditions
  scholarshipTermination: z.string().optional(),
  academicDismissal: z.string().optional(),
  athleticRelease: z.string().optional(),
  conductViolations: z.string().optional(),
  
  // Professional Opportunities
  professionalDraft: z.string().optional(),
  agentContact: z.string().optional(),
  professionalCareer: z.string().optional(),
  olympicParticipation: z.boolean().default(false),
  
  // Insurance and Liability
  athleticInsurance: z.boolean().default(true),
  liabilityWaiver: z.boolean().default(true),
  injuryLiability: z.string().optional(),
  catastrophicInsurance: z.boolean().default(true),
  
  // Communication Protocols
  coachCommunication: z.string().optional(),
  parentCommunication: z.string().optional(),
  academicReporting: z.boolean().default(true),
  progressUpdates: z.string().optional(),
  
  // Compliance Monitoring
  complianceEducation: z.boolean().default(true),
  violationReporting: z.boolean().default(true),
  eligibilityMonitoring: z.boolean().default(true),
  recruitingViolations: z.string().optional(),
  
  // Post-Graduation
  alumniRelations: z.boolean().default(true),
  degreeCompletion: z.boolean().default(true),
  careerServices: z.boolean().default(true),
  lifetimeSupport: z.string().optional(),
  
  // Special Provisions
  specialAccommodations: z.string().optional(),
  religiousObservance: z.string().optional(),
  internationalStudent: z.boolean().default(false),
  languageSupport: z.boolean().default(false),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'university-process']).default('university-process'),
  
  // Signature Requirements
  studentSignature: z.boolean().default(true),
  parentSignature: z.boolean().default(false),
  coachSignature: z.boolean().default(true),
  athleticDirectorSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
});