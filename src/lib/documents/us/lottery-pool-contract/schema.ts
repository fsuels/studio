// src/lib/documents/us/lottery-pool-contract/schema.ts
import { z } from 'zod';

export const LotteryPoolContractSchema = z.object({
  // Pool Administrator
  administratorName: z.string().min(1, 'Administrator name is required'),
  administratorAddress: z.string().optional(),
  administratorPhone: z.string().optional(),
  administratorEmail: z.string().email().optional(),

  // Pool Details
  poolName: z.string().optional(),
  lotteryGame: z.string().optional(),
  drawingDays: z.string().optional(),
  ticketCost: z.string().optional(),
  poolContribution: z.string().optional(),

  // Participants
  participantNames: z.string().optional(),
  maximumParticipants: z.string().optional(),
  membershipFee: z.string().optional(),

  // Pool Rules
  purchaseFrequency: z
    .enum(['weekly', 'bi-weekly', 'monthly', 'per-drawing'])
    .default('weekly'),
  numberSelection: z
    .enum(['quick-pick', 'group-choice', 'administrator-choice'])
    .default('quick-pick'),
  missedPaymentPolicy: z.string().optional(),

  // Winnings Distribution
  winningsDistribution: z
    .enum(['equal-shares', 'proportional', 'contribution-based'])
    .default('equal-shares'),
  minimumPayout: z.string().optional(),
  taxResponsibility: z
    .enum(['individual', 'pool', 'shared'])
    .default('individual'),

  // Financial Management
  poolFunds: z.string().optional(),
  recordKeeping: z.boolean().default(true),
  expenseReimbursement: z.boolean().default(false),

  // Contract Terms
  contractDuration: z.string().optional(),
  renewalTerms: z.string().optional(),
  terminationNotice: z.string().optional(),

  // Communication
  meetingSchedule: z.string().optional(),
  communicationMethod: z
    .enum(['email', 'text', 'phone', 'in-person'])
    .default('email'),
  winningsNotification: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['discussion', 'mediation', 'arbitration'])
    .default('discussion'),
  voteRequirements: z.string().optional(),

  // Legal Requirements
  ageVerification: z.boolean().default(true),
  legalGambling: z.boolean().default(true),
  stateCompliance: z.boolean().default(true),

  // Signature Requirements
  administratorSignature: z.boolean().default(true),
  participantSignatures: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});
