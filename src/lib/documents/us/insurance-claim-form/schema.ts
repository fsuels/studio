// src/lib/documents/us/insurance-claim-form/schema.ts
import { z } from 'zod';

export const InsuranceClaimFormSchema = z.object({
  // Policyholder Information
  policyholderName: z.string().min(1, 'Policyholder name is required'),
  policyholderAddress: z.string().optional(),
  policyholderPhone: z.string().optional(),
  policyholderEmail: z.string().email().optional(),
  dateOfBirth: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  
  // Policy Information
  policyNumber: z.string().optional(),
  insuranceCompany: z.string().optional(),
  agentName: z.string().optional(),
  agentPhone: z.string().optional(),
  policyEffectiveDate: z.string().optional(),
  policyExpirationDate: z.string().optional(),
  
  // Claim Information
  claimNumber: z.string().optional(),
  dateOfLoss: z.string().optional(),
  timeOfLoss: z.string().optional(),
  placeOfLoss: z.string().optional(),
  claimType: z.enum(['auto', 'home', 'health', 'life', 'disability', 'liability', 'business']).optional(),
  
  // Loss Description
  lossDescription: z.string().optional(),
  causeOfLoss: z.enum(['accident', 'theft', 'fire', 'weather', 'vandalism', 'other']).optional(),
  damageDescription: z.string().optional(),
  estimatedDamage: z.string().optional(),
  totalLoss: z.boolean().default(false),
  
  // Auto Claim Specific
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleVIN: z.string().optional(),
  licensePlate: z.string().optional(),
  driverName: z.string().optional(),
  driverLicense: z.string().optional(),
  
  // Property Claim Specific
  propertyAddress: z.string().optional(),
  propertyType: z.enum(['single-family', 'condo', 'townhouse', 'apartment', 'commercial']).optional(),
  propertyOwnership: z.enum(['owned', 'rented', 'occupied']).optional(),
  damagedItems: z.string().optional(),
  
  // Health Claim Specific
  patientName: z.string().optional(),
  patientDOB: z.string().optional(),
  providerName: z.string().optional(),
  serviceDate: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentReceived: z.string().optional(),
  
  // Witnesses and Other Parties
  witnessName: z.string().optional(),
  witnessPhone: z.string().optional(),
  otherPartyName: z.string().optional(),
  otherPartyInsurance: z.string().optional(),
  policeReport: z.boolean().default(false),
  policeReportNumber: z.string().optional(),
  
  // Documentation
  photos: z.boolean().default(false),
  receipts: z.boolean().default(false),
  estimates: z.boolean().default(false),
  medicalRecords: z.boolean().default(false),
  policeReports: z.boolean().default(false),
  
  // Prior Claims
  priorClaims: z.boolean().default(false),
  priorClaimDetails: z.string().optional(),
  priorClaimDates: z.string().optional(),
  priorClaimAmounts: z.string().optional(),
  
  // Coverage Details
  coverageType: z.string().optional(),
  deductible: z.string().optional(),
  coverageLimit: z.string().optional(),
  additionalCoverage: z.string().optional(),
  
  // Third Party Information
  attorneyInvolved: z.boolean().default(false),
  attorneyName: z.string().optional(),
  attorneyPhone: z.string().optional(),
  litigation: z.boolean().default(false),
  
  // Employment Related
  employerNotified: z.boolean().default(false),
  workersComp: z.boolean().default(false),
  lostWages: z.boolean().default(false),
  returnToWork: z.string().optional(),
  
  // Medical Information
  medicalProvider: z.string().optional(),
  hospitalName: z.string().optional(),
  emergencyRoom: z.boolean().default(false),
  ambulance: z.boolean().default(false),
  preexistingCondition: z.boolean().default(false),
  
  // Financial Information
  claimAmount: z.string().optional(),
  outOfPocket: z.string().optional(),
  lostIncome: z.string().optional(),
  additionalExpenses: z.string().optional(),
  
  // Investigation
  investigationRequired: z.boolean().default(false),
  independentAdjuster: z.boolean().default(false),
  adjusterName: z.string().optional(),
  adjusterPhone: z.string().optional(),
  
  // Fraud Prevention
  fraudDeclaration: z.boolean().default(true),
  accuracyStatement: z.boolean().default(true),
  penaltyWarning: z.boolean().default(true),
  cooperationClause: z.boolean().default(true),
  
  // Settlement Information
  settlementOffer: z.string().optional(),
  settlementAccepted: z.boolean().default(false),
  settlementDate: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'litigation']).optional(),
  
  // Claim Status
  claimStatus: z.enum(['pending', 'investigating', 'approved', 'denied', 'settled']).default('pending'),
  dateSubmitted: z.string().optional(),
  dateProcessed: z.string().optional(),
  adjusterAssigned: z.string().optional(),
  
  // Communication Preferences
  preferredContact: z.enum(['phone', 'email', 'mail']).default('phone'),
  bestTimeToCall: z.string().optional(),
  languagePreference: z.enum(['english', 'spanish', 'other']).default('english'),
  accessibilityNeeds: z.string().optional(),
  
  // Legal Declarations
  materialFacts: z.boolean().default(true),
  authorization: z.boolean().default(true),
  subrogationRights: z.boolean().default(true),
  cooperationAgreement: z.boolean().default(true),
  
  // Signature and Verification
  claimantSignature: z.boolean().default(true),
  signatureDate: z.string().optional(),
  notarization: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});