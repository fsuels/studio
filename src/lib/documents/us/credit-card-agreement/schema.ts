// src/lib/documents/us/credit-card-agreement/schema.ts
import { z } from 'zod';

export const CreditCardAgreementSchema = z.object({
  // Cardholder Information
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardholderAddress: z.string().optional(),
  cardholderPhone: z.string().optional(),
  cardholderEmail: z.string().email().optional(),
  socialSecurityNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  employmentStatus: z
    .enum(['employed', 'self-employed', 'retired', 'unemployed', 'student'])
    .optional(),
  annualIncome: z.string().optional(),

  // Card Information
  cardType: z
    .enum(['visa', 'mastercard', 'amex', 'discover', 'other'])
    .default('visa'),
  cardNumber: z.string().optional(),
  creditLimit: z.string().optional(),
  cashAdvanceLimit: z.string().optional(),
  cardExpiration: z.string().optional(),

  // Interest Rates
  purchaseAPR: z.string().optional(),
  cashAdvanceAPR: z.string().optional(),
  balanceTransferAPR: z.string().optional(),
  penaltyAPR: z.string().optional(),
  introductoryAPR: z.string().optional(),
  introductoryPeriod: z.string().optional(),
  variableRate: z.boolean().default(true),

  // Fees
  annualFee: z.string().optional(),
  cashAdvanceFee: z.string().optional(),
  balanceTransferFee: z.string().optional(),
  foreignTransactionFee: z.string().optional(),
  lateFee: z.string().optional(),
  overLimitFee: z.string().optional(),
  returnedPaymentFee: z.string().optional(),
  replacementCardFee: z.string().optional(),

  // Payment Terms
  minimumPayment: z.string().optional(),
  paymentDueDate: z
    .enum(['15th', '20th', '25th', '30th', 'end-of-month'])
    .default('25th'),
  gracePeriod: z.string().optional(),
  paymentMethods: z.string().optional(),
  autopayEnabled: z.boolean().default(false),
  autopayAmount: z.enum(['minimum', 'full-balance', 'fixed-amount']).optional(),

  // Credit Terms
  creditScore: z.string().optional(),
  creditHistory: z
    .enum(['excellent', 'good', 'fair', 'poor', 'no-credit'])
    .optional(),
  cosigner: z.boolean().default(false),
  cosignerName: z.string().optional(),
  jointAccount: z.boolean().default(false),
  authorizedUsers: z.string().optional(),

  // Security Features
  chipEnabled: z.boolean().default(true),
  contactlessEnabled: z.boolean().default(true),
  fraudProtection: z.boolean().default(true),
  zeroLiability: z.boolean().default(true),

  // Rewards Program
  rewardsProgram: z.boolean().default(false),
  rewardsType: z.enum(['cashback', 'points', 'miles', 'none']).default('none'),
  cashbackRate: z.string().optional(),
  signupBonus: z.string().optional(),
  bonusRequirement: z.string().optional(),
  rewardsExpiration: z.string().optional(),

  // Billing and Statements
  statementDate: z.string().optional(),
  paperStatements: z.boolean().default(false),
  electronicStatements: z.boolean().default(true),
  notificationPreferences: z.string().optional(),

  // Default and Collection
  defaultTriggers: z.string().optional(),
  collectionProcedures: z.string().optional(),
  chargeOffPolicy: z.string().optional(),
  creditReporting: z.boolean().default(true),

  // Legal Terms
  governingLaw: z.string().optional(),
  arbitrationClause: z.boolean().default(true),
  classActionWaiver: z.boolean().default(true),
  disputeResolution: z
    .enum(['arbitration', 'court', 'mediation'])
    .default('arbitration'),

  // Privacy and Data
  dataSharing: z.boolean().default(false),
  marketingOptOut: z.boolean().default(false),
  creditBureauReporting: z.boolean().default(true),
  privacyPolicyAccepted: z.boolean().default(true),

  // Account Management
  accountClosureTerms: z.string().optional(),
  creditLineIncrease: z.string().optional(),
  creditLineDecrease: z.string().optional(),
  accountReview: z.string().optional(),

  // Special Terms
  studentCard: z.boolean().default(false),
  businessCard: z.boolean().default(false),
  securedCard: z.boolean().default(false),
  securityDeposit: z.string().optional(),

  // Contact Information
  customerServicePhone: z.string().optional(),
  lostCardPhone: z.string().optional(),
  disputePhone: z.string().optional(),
  websiteURL: z.string().optional(),
  mobileAppAvailable: z.boolean().default(true),

  // Electronic Communications
  electronicCommunicationConsent: z.boolean().default(true),
  textMessageAlerts: z.boolean().default(false),
  emailAlerts: z.boolean().default(true),
  mobileNotifications: z.boolean().default(true),

  // Signature and Acceptance
  applicationDate: z.string().optional(),
  approvalDate: z.string().optional(),
  cardActivationDate: z.string().optional(),
  agreementVersion: z.string().optional(),
  electronicSignature: z.boolean().default(true),
  termsAcceptance: z.boolean().default(true),
});
