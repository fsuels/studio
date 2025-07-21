// src/lib/documents/us/clinical-trial-agreement/schema.ts
import { z } from 'zod';

export const ClinicalTrialAgreementSchema = z.object({
  // Sponsor Information
  sponsorName: z.string().min(1, 'Sponsor name is required'),
  sponsorAddress: z.string().optional(),
  sponsorPhone: z.string().optional(),
  sponsorEmail: z.string().email().optional(),
  sponsorType: z
    .enum([
      'pharmaceutical',
      'biotech',
      'medical-device',
      'academic',
      'government',
    ])
    .optional(),

  // Research Site Information
  siteName: z.string().min(1, 'Research site name is required'),
  siteAddress: z.string().optional(),
  principalInvestigator: z.string().optional(),
  investigatorPhone: z.string().optional(),
  investigatorEmail: z.string().email().optional(),
  investigatorLicense: z.string().optional(),

  // Study Details
  studyTitle: z.string().optional(),
  protocolNumber: z.string().optional(),
  studyPhase: z
    .enum(['phase-i', 'phase-ii', 'phase-iii', 'phase-iv', 'observational'])
    .optional(),
  therapeuticArea: z.string().optional(),
  studyDesign: z
    .enum([
      'randomized',
      'open-label',
      'double-blind',
      'placebo-controlled',
      'crossover',
    ])
    .optional(),

  // Participant Information
  targetEnrollment: z.string().optional(),
  inclusionCriteria: z.string().optional(),
  exclusionCriteria: z.string().optional(),
  ageRange: z.string().optional(),
  participantCompensation: z.string().optional(),

  // Regulatory Compliance
  fdaRegulations: z.boolean().default(true),
  irbApproval: z.boolean().default(true),
  informedConsent: z.boolean().default(true),
  hipaaCompliance: z.boolean().default(true),
  gcpCompliance: z.boolean().default(true),

  // Study Timeline
  studyStartDate: z.string().optional(),
  enrollmentPeriod: z.string().optional(),
  studyDuration: z.string().optional(),
  followUpPeriod: z.string().optional(),
  dataLockDate: z.string().optional(),

  // Financial Terms
  studyBudget: z.string().optional(),
  paymentSchedule: z
    .enum(['per-patient', 'milestone', 'quarterly', 'monthly'])
    .default('milestone'),
  startupCosts: z.string().optional(),
  perPatientCost: z.string().optional(),
  overheadRate: z.string().optional(),

  // Study Procedures
  screeningProcedures: z.string().optional(),
  treatmentProtocol: z.string().optional(),
  assessmentSchedule: z.string().optional(),
  labTests: z.string().optional(),
  imagingStudies: z.string().optional(),

  // Drug/Device Supply
  investigationalProduct: z.string().optional(),
  drugSupplyManagement: z.boolean().default(true),
  storageRequirements: z.string().optional(),
  dispensingProtocol: z.string().optional(),
  drugAccountability: z.boolean().default(true),

  // Safety Monitoring
  adverseEventReporting: z.boolean().default(true),
  seriousAdverseEvents: z.string().optional(),
  safetyMonitoring: z.boolean().default(true),
  dsmb: z.boolean().default(false),
  stoppingRules: z.string().optional(),

  // Data Management
  dataCollection: z.enum(['paper', 'edc', 'hybrid']).default('edc'),
  dataOwnership: z.enum(['sponsor', 'site', 'shared']).default('sponsor'),
  dataRetention: z.string().optional(),
  dataPrivacy: z.boolean().default(true),
  dataSharing: z.string().optional(),

  // Quality Assurance
  monitoringPlan: z.boolean().default(true),
  siteVisits: z.string().optional(),
  sourceDocumentVerification: z.boolean().default(true),
  auditRights: z.boolean().default(true),
  capa: z.boolean().default(true),

  // Personnel and Training
  studyStaff: z.string().optional(),
  staffQualifications: z.string().optional(),
  trainingRequirements: z.boolean().default(true),
  delegationLog: z.boolean().default(true),
  cvMaintenance: z.boolean().default(true),

  // Laboratory Services
  centralLab: z.boolean().default(false),
  localLab: z.boolean().default(true),
  labCertifications: z.string().optional(),
  specimenHandling: z.string().optional(),
  labKitSupplies: z.boolean().default(true),

  // Insurance and Indemnification
  clinicalTrialInsurance: z.boolean().default(true),
  insuranceCoverage: z.string().optional(),
  indemnification: z.boolean().default(true),
  liabilityAllocation: z.string().optional(),

  // Intellectual Property
  ipOwnership: z
    .enum(['sponsor', 'site', 'shared', 'inventor'])
    .default('sponsor'),
  inventionDisclosure: z.boolean().default(true),
  publicationRights: z.boolean().default(true),
  publicationReview: z.string().optional(),
  patentRights: z.string().optional(),

  // Confidentiality
  confidentialityTerm: z.string().optional(),
  confidentialInformation: z.string().optional(),
  permittedDisclosures: z.string().optional(),
  returnOfInformation: z.boolean().default(true),

  // Record Keeping
  sourceDocuments: z.boolean().default(true),
  regulatoryBinder: z.boolean().default(true),
  recordRetention: z.string().optional(),
  archivalRequirements: z.string().optional(),
  electronicRecords: z.boolean().default(true),

  // Patient Care
  standardOfCare: z.boolean().default(true),
  rescueTherapy: z.boolean().default(true),
  emergencyProcedures: z.string().optional(),
  continuityOfCare: z.boolean().default(true),
  postStudyAccess: z.boolean().default(false),

  // Biospecimens
  biospecimenCollection: z.boolean().default(false),
  geneticTesting: z.boolean().default(false),
  biobanking: z.boolean().default(false),
  futureUseConsent: z.boolean().default(false),
  specimenDestruction: z.string().optional(),

  // Technology and Systems
  edcSystem: z.string().optional(),
  imrtSystem: z.boolean().default(false),
  ctms: z.boolean().default(false),
  ePro: z.boolean().default(false),
  wearableDevices: z.boolean().default(false),

  // Recruitment and Retention
  recruitmentStrategy: z.string().optional(),
  advertisingApproval: z.boolean().default(true),
  patientRegistries: z.boolean().default(false),
  retentionPlan: z.string().optional(),

  // Site Facilities
  facilityRequirements: z.string().optional(),
  equipmentProvided: z.boolean().default(false),
  storageCapabilities: z.string().optional(),
  pharmacyRequirements: z.boolean().default(true),

  // Communication
  communicationPlan: z.string().optional(),
  meetingSchedule: z.string().optional(),
  reportingRequirements: z.string().optional(),
  escalationProcess: z.string().optional(),

  // Closeout Procedures
  studyCloseout: z.string().optional(),
  finalReport: z.boolean().default(true),
  equipmentReturn: z.boolean().default(true),
  drugDisposition: z.boolean().default(true),
  archivalTransfer: z.boolean().default(true),

  // Termination
  terminationRights: z.string().optional(),
  earlyTermination: z.string().optional(),
  terminationNotice: z.string().optional(),
  postTerminationObligations: z.string().optional(),

  // International Considerations
  multiSiteCoordination: z.boolean().default(false),
  importExportPermits: z.boolean().default(false),
  translationRequirements: z.boolean().default(false),
  culturalConsiderations: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Signature Requirements
  sponsorSignature: z.boolean().default(true),
  investigatorSignature: z.boolean().default(true),
  institutionSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});
