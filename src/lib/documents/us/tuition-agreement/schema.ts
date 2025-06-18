// src/lib/documents/us/tuition-agreement/schema.ts
import { z } from 'zod';

export const TuitionAgreementSchema = z.object({
  // Institution Information
  institutionName: z.string().min(1, 'Institution name is required'),
  institutionAddress: z.string().optional(),
  institutionPhone: z.string().optional(),
  institutionEmail: z.string().email().optional(),
  institutionType: z.enum(['public', 'private', 'charter', 'religious', 'vocational', 'online']).default('private'),
  
  // Student Information
  studentName: z.string().min(1, 'Student name is required'),
  studentAddress: z.string().optional(),
  studentPhone: z.string().optional(),
  studentEmail: z.string().email().optional(),
  studentId: z.string().optional(),
  studentDateOfBirth: z.string().optional(),
  
  // Parent/Guardian Information
  parentGuardianName: z.string().optional(),
  parentGuardianAddress: z.string().optional(),
  parentGuardianPhone: z.string().optional(),
  parentGuardianEmail: z.string().email().optional(),
  financialResponsibility: z.enum(['student', 'parent', 'guardian', 'sponsor', 'shared']).default('parent'),
  
  // Academic Program
  programName: z.string().optional(),
  gradeLevel: z.string().optional(),
  academicYear: z.string().optional(),
  semester: z.enum(['fall', 'spring', 'summer', 'full-year']).optional(),
  enrollmentStatus: z.enum(['full-time', 'part-time', 'audit']).default('full-time'),
  creditHours: z.string().optional(),
  
  // Tuition and Fees
  tuitionAmount: z.string().optional(),
  registrationFee: z.string().optional(),
  activityFee: z.string().optional(),
  technologyFee: z.string().optional(),
  labFee: z.string().optional(),
  totalAmount: z.string().optional(),
  
  // Payment Terms
  paymentPlan: z.enum(['full-payment', 'semester', 'quarterly', 'monthly', 'custom']).default('semester'),
  paymentDueDate: z.string().optional(),
  installmentAmount: z.string().optional(),
  numberOfPayments: z.string().optional(),
  lateFee: z.string().optional(),
  interestRate: z.string().optional(),
  
  // Financial Aid
  financialAidApplied: z.boolean().default(false),
  scholarshipAmount: z.string().optional(),
  grantAmount: z.string().optional(),
  loanAmount: z.string().optional(),
  workStudy: z.boolean().default(false),
  netTuition: z.string().optional(),
  
  // Payment Methods
  acceptedPaymentMethods: z.string().optional(),
  automaticPayment: z.boolean().default(false),
  paymentProcessor: z.string().optional(),
  convenienceFee: z.string().optional(),
  
  // Refund Policy
  refundPolicy: z.string().optional(),
  withdrawalDeadline: z.string().optional(),
  refundSchedule: z.string().optional(),
  nonRefundableFees: z.string().optional(),
  proRataRefund: z.boolean().default(false),
  
  // Academic Requirements
  minimumGPA: z.string().optional(),
  attendanceRequirements: z.string().optional(),
  academicProbationPolicy: z.string().optional(),
  satisfactoryProgress: z.string().optional(),
  
  // Additional Services
  mealPlan: z.boolean().default(false),
  mealPlanCost: z.string().optional(),
  housing: z.boolean().default(false),
  housingCost: z.string().optional(),
  parking: z.boolean().default(false),
  parkingCost: z.string().optional(),
  
  // Books and Supplies
  booksIncluded: z.boolean().default(false),
  estimatedBookCost: z.string().optional(),
  suppliesIncluded: z.boolean().default(false),
  uniformRequired: z.boolean().default(false),
  
  // Insurance Requirements
  healthInsuranceRequired: z.boolean().default(false),
  schoolInsuranceAvailable: z.boolean().default(false),
  insuranceCost: z.string().optional(),
  liabilityWaiver: z.boolean().default(true),
  
  // Terms and Conditions
  attendancePolicy: z.string().optional(),
  conductCode: z.string().optional(),
  academicIntegrity: z.string().optional(),
  disciplinaryProcedures: z.string().optional(),
  
  // Default and Collection
  defaultConsequences: z.string().optional(),
  collectionPolicy: z.string().optional(),
  transcriptHold: z.boolean().default(true),
  diplomaHold: z.boolean().default(true),
  collectionCosts: z.boolean().default(true),
  
  // Communication
  billingAddress: z.string().optional(),
  statementDelivery: z.enum(['mail', 'email', 'online-portal']).default('email'),
  communicationPreference: z.enum(['email', 'phone', 'mail', 'text']).default('email'),
  
  // Special Circumstances
  specialNeeds: z.boolean().default(false),
  accommodationsCost: z.string().optional(),
  internationalStudent: z.boolean().default(false),
  additionalFees: z.string().optional(),
  
  // Agreement Terms
  effectiveDate: z.string().optional(),
  expirationDate: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  modificationPolicy: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Signature Requirements
  requireStudentSignature: z.boolean().default(true),
  requireParentSignature: z.boolean().default(true),
  requireInstitutionSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});