// src/lib/documents/us/nonprofit-bylaws/schema.ts
import { z } from 'zod';

export const NonprofitBylawsSchema = z.object({
  // Organization Information
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationAddress: z.string().optional(),
  organizationPhone: z.string().optional(),
  organizationEmail: z.string().email().optional(),
  einNumber: z.string().optional(),
  stateOfIncorporation: z.string().optional(),
  dateOfIncorporation: z.string().optional(),

  // Mission and Purpose
  missionStatement: z.string().optional(),
  charitablePurpose: z.string().optional(),
  taxExemptStatus: z
    .enum(['501c3', '501c4', '501c6', '501c7', 'other'])
    .default('501c3'),
  publicBenefit: z.boolean().default(true),
  religiousOrganization: z.boolean().default(false),

  // Board of Directors
  minimumDirectors: z.string().optional(),
  maximumDirectors: z.string().optional(),
  directorTerm: z.string().optional(),
  termLimits: z.boolean().default(false),
  staggeredTerms: z.boolean().default(false),
  directorQualifications: z.string().optional(),

  // Officers
  presidentRequired: z.boolean().default(true),
  vicePresidentRequired: z.boolean().default(true),
  secretaryRequired: z.boolean().default(true),
  treasurerRequired: z.boolean().default(true),
  executiveDirector: z.boolean().default(false),
  officerTerms: z.string().optional(),

  // Membership
  membershipOrganization: z.boolean().default(false),
  membershipClasses: z.string().optional(),
  votingMembers: z.boolean().default(false),
  membershipDues: z.boolean().default(false),
  membershipRequirements: z.string().optional(),

  // Meetings
  annualMeetingRequired: z.boolean().default(true),
  regularMeetingSchedule: z
    .enum(['monthly', 'quarterly', 'annually', 'as-needed'])
    .default('quarterly'),
  specialMeetings: z.boolean().default(true),
  meetingNotice: z.string().optional(),
  quorumRequirement: z.string().optional(),
  virtualMeetings: z.boolean().default(true),

  // Voting
  votingProcedures: z.string().optional(),
  proxyVoting: z.boolean().default(false),
  electronicVoting: z.boolean().default(false),
  unanimousConsent: z.boolean().default(true),
  superMajorityItems: z.string().optional(),

  // Committees
  executiveCommittee: z.boolean().default(true),
  financeCommittee: z.boolean().default(true),
  auditCommittee: z.boolean().default(false),
  governanceCommittee: z.boolean().default(false),
  standingCommittees: z.string().optional(),

  // Financial Management
  fiscalYear: z
    .enum(['calendar', 'july-june', 'october-september', 'custom'])
    .default('calendar'),
  annualBudget: z.boolean().default(true),
  financialControls: z.string().optional(),
  signatureAuthority: z.string().optional(),
  bankAccounts: z.string().optional(),

  // Conflict of Interest
  conflictOfInterestPolicy: z.boolean().default(true),
  annualDisclosure: z.boolean().default(true),
  recusalProcedures: z.boolean().default(true),
  relatedPartyTransactions: z.string().optional(),

  // Compensation
  compensationPolicy: z.string().optional(),
  executiveCompensation: z.boolean().default(false),
  compensationReview: z.boolean().default(true),
  excessBenefitTransactions: z.boolean().default(false),

  // Record Keeping
  corporateRecords: z.boolean().default(true),
  meetingMinutes: z.boolean().default(true),
  financialRecords: z.boolean().default(true),
  recordRetention: z.string().optional(),
  publicInspection: z.boolean().default(true),

  // Amendments
  amendmentProcedure: z.string().optional(),
  amendmentVote: z
    .enum(['majority', 'two-thirds', 'three-quarters', 'unanimous'])
    .default('two-thirds'),
  memberApproval: z.boolean().default(false),
  attorneyGeneralNotice: z.boolean().default(false),

  // Dissolution
  dissolutionProcedure: z.string().optional(),
  dissolutionVote: z
    .enum(['majority', 'two-thirds', 'three-quarters', 'unanimous'])
    .default('two-thirds'),
  assetDistribution: z.string().optional(),
  cyPressDoctrine: z.boolean().default(true),

  // Indemnification
  directorIndemnification: z.boolean().default(true),
  officerIndemnification: z.boolean().default(true),
  employeeIndemnification: z.boolean().default(true),
  indemnificationInsurance: z.boolean().default(true),

  // Compliance
  irsCompliance: z.boolean().default(true),
  stateCompliance: z.boolean().default(true),
  annualFilings: z.boolean().default(true),
  form990: z.boolean().default(true),

  // Fundraising
  fundraisingActivities: z.boolean().default(true),
  donorPrivacy: z.boolean().default(true),
  giftAcceptancePolicy: z.boolean().default(true),
  endowmentFund: z.boolean().default(false),

  // Programs and Services
  programDescription: z.string().optional(),
  serviceDelivery: z.string().optional(),
  beneficiarySelection: z.string().optional(),
  programEvaluation: z.boolean().default(true),

  // Governance Policies
  whistleblowerPolicy: z.boolean().default(true),
  documentDestructionPolicy: z.boolean().default(true),
  codeOfEthics: z.boolean().default(true),
  diversityPolicy: z.boolean().default(false),

  // Technology and Communication
  websiteRequirement: z.boolean().default(false),
  socialMediaPolicy: z.boolean().default(false),
  electronicCommunications: z.boolean().default(true),
  dataPrivacy: z.boolean().default(true),

  // Partnerships
  collaborationPolicy: z.string().optional(),
  fiscalSponsorship: z.boolean().default(false),
  mergerProcedures: z.string().optional(),
  affiliationAgreements: z.boolean().default(false),

  // Volunteers
  volunteerProgram: z.boolean().default(true),
  volunteerScreening: z.boolean().default(true),
  volunteerTraining: z.boolean().default(true),
  volunteerRecognition: z.boolean().default(true),

  // Insurance
  generalLiability: z.boolean().default(true),
  directorsAndOfficers: z.boolean().default(true),
  propertyInsurance: z.boolean().default(false),
  volunteerAccident: z.boolean().default(false),

  // Special Provisions
  religiousExemptions: z.string().optional(),
  politicalActivity: z.boolean().default(false),
  lobbyingLimitations: z.string().optional(),
  internationalActivities: z.boolean().default(false),

  // Emergency Succession
  successionPlan: z.boolean().default(true),
  emergencyBylaws: z.boolean().default(false),
  interimAuthority: z.string().optional(),
  disasterRecovery: z.boolean().default(false),

  // Adoption and Certification
  adoptionDate: z.string().optional(),
  boardApproval: z.boolean().default(true),
  incorporatorApproval: z.boolean().default(false),
  certificationStatement: z.boolean().default(true),

  // Signature Requirements
  presidentSignature: z.boolean().default(true),
  secretarySignature: z.boolean().default(true),
  boardChairSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
});
