// src/lib/documents/us/settlement-agreement/schema.ts
import { z } from 'zod';

export const SettlementAgreementSchema = z.object({
  // Party Information
  party1Name: z.string().min(1, 'Party 1 name is required'),
  party1Address: z.string().min(1, 'Party 1 address is required'),
  party1Type: z.enum(['individual', 'business', 'organization', 'government']).default('individual'),
  party1Representative: z.string().optional(),
  party2Name: z.string().min(1, 'Party 2 name is required'),
  party2Address: z.string().min(1, 'Party 2 address is required'),
  party2Type: z.enum(['individual', 'business', 'organization', 'government']).default('individual'),
  party2Representative: z.string().optional(),
  additionalParties: z.array(z.string()).default([]),
  
  // Dispute Background
  disputeDescription: z.string().min(1, 'Dispute description is required'),
  disputeType: z.enum(['contract', 'tort', 'employment', 'personal-injury', 'property', 'commercial', 'family', 'other']).default('contract'),
  disputeOriginDate: z.string().optional(),
  litigationStatus: z.enum(['no-litigation', 'pending-litigation', 'resolved-litigation', 'threatened-litigation']).default('no-litigation'),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  
  // Settlement Terms
  settlementAmount: z.string().optional(),
  paymentStructure: z.enum(['lump-sum', 'installments', 'performance-based', 'non-monetary']).default('lump-sum'),
  installmentSchedule: z.string().optional(),
  paymentDeadline: z.string().optional(),
  paymentMethod: z.string().optional(),
  interestOnLatePayment: z.boolean().default(false),
  defaultConsequences: z.string().optional(),
  
  // Non-Monetary Considerations
  nonMonetaryTerms: z.array(z.string()).default([]),
  performanceObligations: z.string().optional(),
  deliverables: z.string().optional(),
  timeframeForPerformance: z.string().optional(),
  qualityStandards: z.string().optional(),
  
  // Release Provisions
  releaseScope: z.enum(['specific-claims', 'all-claims', 'known-claims', 'broad-release']).default('specific-claims'),
  releasedClaims: z.array(z.string()).default([]),
  releasedParties: z.array(z.string()).default([]),
  releasePeriod: z.enum(['all-time', 'specific-period', 'up-to-date']).default('all-time'),
  unknownClaimsWaiver: z.boolean().default(false),
  futureClaimsReservation: z.boolean().default(false),
  
  // Mutual vs Unilateral Release
  mutualRelease: z.boolean().default(false),
  unilateralRelease: z.boolean().default(true),
  releasingParty: z.string().optional(),
  releasedParty: z.string().optional(),
  reciprocalObligations: z.boolean().default(false),
  
  // Dismissed Claims
  dismissWithPrejudice: z.boolean().default(false),
  dismissWithoutPrejudice: z.boolean().default(false),
  courtDismissal: z.boolean().default(false),
  stipulatedDismissal: z.boolean().default(false),
  dismissalDeadline: z.string().optional(),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(false),
  nonDisclosureTerms: z.string().optional(),
  publicDisclosureAllowed: z.boolean().default(true),
  mediaStatements: z.string().optional(),
  confidentialityDuration: z.string().optional(),
  confidentialityExceptions: z.array(z.string()).default([]),
  
  // Non-Admission Clause
  nonAdmissionClause: z.boolean().default(true),
  noAdmissionOfLiability: z.boolean().default(true),
  noAdmissionOfWrongdoing: z.boolean().default(true),
  settlementNotEvidence: z.boolean().default(true),
  
  // Cooperation Provisions
  futureCooperation: z.boolean().default(false),
  cooperationScope: z.string().optional(),
  informationSharing: z.boolean().default(false),
  documentPreservation: z.boolean().default(false),
  testimonyCooperation: z.boolean().default(false),
  
  // Compliance and Monitoring
  complianceReporting: z.boolean().default(false),
  monitoringProcedures: z.string().optional(),
  auditRights: z.boolean().default(false),
  recordKeeping: z.boolean().default(false),
  inspectionRights: z.boolean().default(false),
  
  // Third Party Considerations
  thirdPartyBeneficiaries: z.boolean().default(false),
  thirdPartyReleases: z.boolean().default(false),
  insuranceAssignment: z.boolean().default(false),
  subrogationWaiver: z.boolean().default(false),
  thirdPartyApprovals: z.string().optional(),
  
  // Tax Considerations
  taxTreatment: z.string().optional(),
  taxReporting: z.boolean().default(false),
  form1099Issuance: z.boolean().default(false),
  taxAdviceDisclaimer: z.boolean().default(true),
  taxIndemnification: z.boolean().default(false),
  
  // Regulatory Compliance
  regulatoryApprovals: z.boolean().default(false),
  governmentNotification: z.boolean().default(false),
  complianceWithLaws: z.boolean().default(true),
  industryRegulations: z.string().optional(),
  reportingObligations: z.string().optional(),
  
  // Enforcement Provisions
  enforcementMechanism: z.string().optional(),
  breachRemedies: z.array(z.string()).default([]),
  specificPerformance: z.boolean().default(false),
  injunctiveRelief: z.boolean().default(false),
  liquidatedDamages: z.boolean().default(false),
  attorneyFeesClause: z.boolean().default(false),
  
  // Dispute Resolution for Agreement
  disputeResolutionMethod: z.enum(['litigation', 'arbitration', 'mediation', 'negotiation']).optional(),
  arbitrationClause: z.boolean().default(false),
  mediationFirst: z.boolean().default(false),
  jurisdiction: z.string().optional(),
  venue: z.string().optional(),
  governingLaw: z.string().optional(),
  
  // Modification and Amendment
  modificationRequirements: z.enum(['written-only', 'mutual-consent', 'specific-process']).default('written-only'),
  amendmentProcess: z.string().optional(),
  noOralModification: z.boolean().default(true),
  signedModificationRequired: z.boolean().default(true),
  
  // Representations and Warranties
  authorityRepresentation: z.boolean().default(true),
  capacityRepresentation: z.boolean().default(true),
  noOtherAgreements: z.boolean().default(false),
  materialFactsDisclosure: z.boolean().default(false),
  financialCapacity: z.boolean().default(false),
  
  // Conditions Precedent
  conditionsPrecedent: z.array(z.string()).default([]),
  approvalConditions: z.string().optional(),
  documentaryConditions: z.string().optional(),
  performanceConditions: z.string().optional(),
  timeConditions: z.string().optional(),
  
  // Survival Provisions
  survivingObligations: z.array(z.string()).default([]),
  postAgreementObligations: z.string().optional(),
  ongoingCompliance: z.boolean().default(false),
  continuingObligations: z.string().optional(),
  
  // Force Majeure
  forceMajeureClause: z.boolean().default(false),
  forceMajeureEvents: z.array(z.string()).default([]),
  notificationRequirements: z.string().optional(),
  mitigationObligations: z.boolean().default(false),
  
  // Successors and Assigns
  bindingOnSuccessors: z.boolean().default(true),
  assignmentRights: z.boolean().default(false),
  assignmentRestrictions: z.string().optional(),
  benefitOfAgreement: z.string().optional(),
  
  // Notice Provisions
  noticeRequirements: z.string().optional(),
  noticeMethod: z.array(z.string()).default([]),
  noticeAddresses: z.string().optional(),
  electronicNotice: z.boolean().default(false),
  changeOfAddress: z.boolean().default(true),
  
  // Integration and Interpretation
  entireAgreement: z.boolean().default(true),
  supersedingEffect: z.boolean().default(true),
  priorNegotiations: z.boolean().default(false),
  interpretationRules: z.string().optional(),
  constructionAgainstDrafter: z.boolean().default(false),
  
  // Severability
  severabilityClause: z.boolean().default(true),
  partialInvalidity: z.boolean().default(true),
  reformationRights: z.boolean().default(false),
  continuedEffectiveness: z.boolean().default(true),
  
  // Execution and Delivery
  counterpartExecution: z.boolean().default(true),
  electronicSignatures: z.boolean().default(true),
  notarizationRequired: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  deliveryRequirements: z.string().optional(),
  
  // Effective Date and Duration
  effectiveDate: z.string().min(1, 'Effective date is required'),
  termDuration: z.string().optional(),
  perpetualAgreement: z.boolean().default(true),
  automaticRenewal: z.boolean().default(false),
  terminationConditions: z.string().optional(),
  
  // Special Provisions
  specialCircumstances: z.string().optional(),
  uniqueTerms: z.string().optional(),
  industrySpecificProvisions: z.string().optional(),
  customClauses: z.array(z.string()).default([]),
  
  // Attorney Involvement
  legalCounselRepresentation: z.boolean().default(false),
  independentLegalAdvice: z.boolean().default(false),
  counselReview: z.boolean().default(false),
  attorneyFees: z.string().optional(),
  
  // Public Policy Considerations
  publicInterest: z.boolean().default(false),
  regulatoryCompliance: z.boolean().default(true),
  ethicalConsiderations: z.string().optional(),
  socialResponsibility: z.boolean().default(false),
  
  // Documentation Requirements
  supportingDocuments: z.array(z.string()).default([]),
  attachments: z.string().optional(),
  incorporatedDocuments: z.string().optional(),
  referencedAgreements: z.string().optional(),
  
  // Signature Requirements
  requireAllPartySignatures: z.boolean().default(true),
  authorizedSignatories: z.string().optional(),
  corporateResolutions: z.boolean().default(false),
  guarantorSignatures: z.boolean().default(false),
  dateOfExecution: z.string().optional(),
});