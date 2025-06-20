// src/lib/documents/us/guardianship-agreement/schema.ts
import { z } from 'zod';

export const GuardianshipAgreementSchema = z.object({
  // Ward Information
  wardName: z.string().min(1, 'Ward name is required'),
  wardAddress: z.string().optional(),
  wardBirthDate: z.string().optional(),
  wardAge: z.string().optional(),
  wardSSN: z.string().optional(),
  wardCurrentResidence: z.string().optional(),
  wardPhysicalCondition: z.string().optional(),
  wardMentalCondition: z.string().optional(),
  
  // Guardian Information
  guardianName: z.string().min(1, 'Guardian name is required'),
  guardianAddress: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email().optional(),
  guardianRelationship: z.enum(['parent', 'spouse', 'sibling', 'child', 'relative', 'friend', 'professional']).optional(),
  guardianAge: z.string().optional(),
  guardianOccupation: z.string().optional(),
  
  // Co-Guardian Information
  coGuardianName: z.string().optional(),
  coGuardianAddress: z.string().optional(),
  coGuardianPhone: z.string().optional(),
  coGuardianRelationship: z.string().optional(),
  jointGuardianship: z.boolean().default(false),
  
  // Type of Guardianship
  guardianshipType: z.enum(['person', 'estate', 'both']).default('both'),
  temporaryGuardianship: z.boolean().default(false),
  permanentGuardianship: z.boolean().default(true),
  limitedGuardianship: z.boolean().default(false),
  emergencyGuardianship: z.boolean().default(false),
  
  // Powers and Responsibilities
  medicalDecisions: z.boolean().default(true),
  educationalDecisions: z.boolean().default(true),
  residentialDecisions: z.boolean().default(true),
  financialManagement: z.boolean().default(true),
  legalRepresentation: z.boolean().default(true),
  contractSigning: z.boolean().default(true),
  
  // Medical Authority
  medicalConsent: z.boolean().default(true),
  medicationApproval: z.boolean().default(true),
  surgicalConsent: z.boolean().default(true),
  mentalHealthTreatment: z.boolean().default(true),
  emergencyMedical: z.boolean().default(true),
  
  // Financial Authority
  bankAccounts: z.boolean().default(true),
  investmentDecisions: z.boolean().default(true),
  propertyManagement: z.boolean().default(true),
  benefitClaims: z.boolean().default(true),
  taxFilingAuthority: z.boolean().default(true),
  
  // Living Arrangements
  wardResidence: z.string().optional(),
  residenceChanges: z.boolean().default(true),
  institutionalCare: z.boolean().default(false),
  homeCare: z.boolean().default(true),
  familyVisitation: z.string().optional(),
  
  // Education and Development
  educationalChoices: z.boolean().default(true),
  specialEducation: z.boolean().default(false),
  vocationalTraining: z.boolean().default(false),
  recreationalActivities: z.boolean().default(true),
  
  // Asset Management
  realEstateManagement: z.boolean().default(true),
  personalPropertyManagement: z.boolean().default(true),
  businessInterests: z.boolean().default(false),
  insuranceManagement: z.boolean().default(true),
  retirementAccounts: z.boolean().default(true),
  
  // Reporting Requirements
  courtReporting: z.boolean().default(true),
  annualReports: z.boolean().default(true),
  financialAccountings: z.boolean().default(true),
  statusReports: z.boolean().default(true),
  
  // Limitations and Restrictions
  courtSupervision: z.boolean().default(true),
  bondRequirement: z.boolean().default(false),
  spendingLimits: z.string().optional(),
  investmentRestrictions: z.string().optional(),
  travelRestrictions: z.string().optional(),
  
  // Term and Duration
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reviewDate: z.string().optional(),
  termConditions: z.string().optional(),
  successorGuardian: z.string().optional(),
  
  // Communication and Visitation
  familyContact: z.boolean().default(true),
  friendContact: z.boolean().default(true),
  communicationRestrictions: z.string().optional(),
  visitationRights: z.string().optional(),
  
  // Emergency Provisions
  emergencyContacts: z.string().optional(),
  medicalEmergencies: z.string().optional(),
  financialEmergencies: z.string().optional(),
  legalEmergencies: z.string().optional(),
  
  // Professional Services
  attorneys: z.string().optional(),
  accountants: z.string().optional(),
  medicalProfessionals: z.string().optional(),
  caregivers: z.string().optional(),
  
  // Compensation
  guardianCompensation: z.boolean().default(false),
  compensationAmount: z.string().optional(),
  expenseReimbursement: z.boolean().default(true),
  professionalFees: z.string().optional(),
  
  // Legal Procedures
  courtApproval: z.boolean().default(true),
  legalNotice: z.boolean().default(true),
  hearingRequired: z.boolean().default(true),
  appealRights: z.boolean().default(true),
  
  // Incapacity Determinations
  mentalIncapacity: z.boolean().default(false),
  physicalIncapacity: z.boolean().default(false),
  ageOfMinor: z.boolean().default(false),
  developmentalDisability: z.boolean().default(false),
  
  // Protection Measures
  backgroundCheck: z.boolean().default(true),
  fingerprinting: z.boolean().default(true),
  references: z.boolean().default(true),
  creditCheck: z.boolean().default(false),
  
  // Termination Conditions
  wardRecovery: z.boolean().default(true),
  wardMajority: z.boolean().default(true),
  wardDeath: z.boolean().default(true),
  guardianIncapacity: z.boolean().default(true),
  courtTermination: z.boolean().default(true),
  
  // Dispute Resolution
  disputeResolution: z.enum(['court', 'mediation', 'arbitration']).default('court'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),
  
  // Special Provisions
  religiousUpbringing: z.string().optional(),
  culturalConsiderations: z.string().optional(),
  languagePreferences: z.string().optional(),
  specialNeeds: z.string().optional(),
  
  // Signature Requirements
  guardianSignature: z.boolean().default(true),
  wardSignature: z.boolean().default(false),
  courtApprovalRequired: z.boolean().default(true),
  witnessSignatures: z.boolean().default(true),
  notarization: z.boolean().default(true),
});