// src/lib/documents/us/membership-agreement/schema.ts
import { z } from 'zod';

export const MembershipAgreementSchema = z.object({
  // Organization Information
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationAddress: z.string().optional(),
  organizationPhone: z.string().optional(),
  organizationEmail: z.string().email().optional(),
  organizationType: z.enum(['gym', 'club', 'professional', 'social', 'religious', 'educational', 'other']).default('club'),
  
  // Member Information
  memberName: z.string().min(1, 'Member name is required'),
  memberAddress: z.string().optional(),
  memberPhone: z.string().optional(),
  memberEmail: z.string().email().optional(),
  memberDateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
  
  // Membership Details
  membershipType: z.enum(['individual', 'family', 'corporate', 'student', 'senior', 'vip']).default('individual'),
  membershipLevel: z.enum(['basic', 'standard', 'premium', 'platinum']).default('standard'),
  membershipNumber: z.string().optional(),
  membershipStartDate: z.string().optional(),
  membershipDuration: z.enum(['monthly', 'quarterly', 'semi-annual', 'annual', 'lifetime']).default('annual'),
  
  // Benefits and Services
  accessPrivileges: z.string().optional(),
  facilityAccess: z.string().optional(),
  servicesIncluded: z.string().optional(),
  guestPrivileges: z.boolean().default(false),
  numberOfGuests: z.string().optional(),
  specialBenefits: z.string().optional(),
  
  // Fees and Payment
  membershipFee: z.string().optional(),
  initiationFee: z.string().optional(),
  paymentFrequency: z.enum(['monthly', 'quarterly', 'semi-annual', 'annual', 'one-time']).default('monthly'),
  paymentMethod: z.enum(['credit-card', 'bank-transfer', 'check', 'cash']).default('credit-card'),
  autoRenewal: z.boolean().default(false),
  proRataRefund: z.boolean().default(false),
  
  // Rules and Regulations
  membershipRules: z.string().optional(),
  codeOfConduct: z.string().optional(),
  dressCode: z.string().optional(),
  facilityHours: z.string().optional(),
  reservationPolicy: z.string().optional(),
  
  // Restrictions
  ageRestrictions: z.string().optional(),
  healthRequirements: z.string().optional(),
  backgroundCheck: z.boolean().default(false),
  membershipRestrictions: z.string().optional(),
  
  // Cancellation and Suspension
  cancellationPolicy: z.string().optional(),
  cancellationNotice: z.string().optional(),
  cancellationFee: z.string().optional(),
  suspensionPolicy: z.string().optional(),
  freezeOption: z.boolean().default(false),
  freezeDuration: z.string().optional(),
  
  // Transfer and Assignment
  transferable: z.boolean().default(false),
  transferFee: z.string().optional(),
  transferRestrictions: z.string().optional(),
  inheritanceRights: z.boolean().default(false),
  
  // Liability and Insurance
  liabilityWaiver: z.boolean().default(true),
  assumptionOfRisk: z.boolean().default(true),
  insuranceRequired: z.boolean().default(false),
  medicalClearance: z.boolean().default(false),
  accidentPolicy: z.string().optional(),
  
  // Termination
  terminationGrounds: z.string().optional(),
  immediateTermination: z.string().optional(),
  refundPolicy: z.string().optional(),
  finalPaymentObligations: z.string().optional(),
  
  // Additional Services
  personalTraining: z.boolean().default(false),
  classesIncluded: z.boolean().default(false),
  parkingIncluded: z.boolean().default(false),
  lockerIncluded: z.boolean().default(false),
  towelService: z.boolean().default(false),
  
  // Communication
  communicationPreferences: z.enum(['email', 'phone', 'mail', 'text']).default('email'),
  newsletterOptIn: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
  memberDirectory: z.boolean().default(false),
  
  // Dispute Resolution
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Special Provisions
  photographyConsent: z.boolean().default(false),
  minorConsent: z.boolean().default(false),
  parentalConsent: z.boolean().default(false),
  specialAccommodations: z.string().optional(),
  
  // Signature Requirements
  requireMemberSignature: z.boolean().default(true),
  requireOrganizationSignature: z.boolean().default(true),
  requireParentSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});