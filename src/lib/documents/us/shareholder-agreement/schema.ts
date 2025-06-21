import { z } from 'zod';

export const shareholderAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  stateOfIncorporation: z.string().min(1, 'State of incorporation is required'),
  companyAddress: z.string().min(1, 'Company address is required'),

  // Shareholders
  shareholders: z
    .array(
      z.object({
        name: z.string().min(1, 'Shareholder name is required'),
        address: z.string().min(1, 'Shareholder address is required'),
        sharesOwned: z.number().min(1, 'Number of shares is required'),
        shareClass: z.string().default('Common'),
        ownershipPercentage: z.number().min(0).max(100),
      }),
    )
    .min(2, 'At least two shareholders are required'),

  // Share Structure
  totalShares: z.number().min(1, 'Total shares is required'),
  shareClasses: z
    .array(
      z.object({
        className: z.string().min(1, 'Share class name is required'),
        votingRights: z.boolean().default(true),
        dividendRights: z.boolean().default(true),
        liquidationPreference: z.string().optional(),
      }),
    )
    .min(1, 'At least one share class is required'),

  // Governance
  boardOfDirectors: z.object({
    totalDirectors: z.number().min(1, 'Number of directors is required'),
    electionMethod: z
      .enum(['majority', 'cumulative', 'class-based'])
      .default('majority'),
    term: z.string().default('1 year'),
    meetingFrequency: z.string().default('Quarterly'),
  }),

  // Voting Agreements
  votingAgreements: z.object({
    dragAlongRights: z.boolean().default(true),
    tagAlongRights: z.boolean().default(true),
    rightOfFirstRefusal: z.boolean().default(true),
    preemptiveRights: z.boolean().default(true),
  }),

  // Transfer Restrictions
  transferRestrictions: z.object({
    transfersAllowed: z.boolean().default(false),
    approvalRequired: z.boolean().default(true),
    rightOfFirstRefusal: z.boolean().default(true),
    transferToFamilyAllowed: z.boolean().default(true),
  }),

  // Buy-Sell Provisions
  buySellProvisions: z.object({
    triggerEvents: z
      .array(z.string())
      .default([
        'Death',
        'Disability',
        'Retirement',
        'Termination of employment',
        'Bankruptcy',
      ]),
    valuationMethod: z
      .enum(['appraisal', 'formula', 'multiple-of-earnings'])
      .default('appraisal'),
    paymentTerms: z.string().default('30 days'),
  }),

  // Confidentiality and Non-Compete
  confidentialityClause: z.boolean().default(true),
  nonCompeteClause: z.boolean().default(false),
  nonCompetePeriod: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z.object({
    method: z
      .enum(['arbitration', 'mediation', 'litigation'])
      .default('arbitration'),
    location: z.string().optional(),
    governingLaw: z.string().min(1, 'Governing law is required'),
  }),

  // Term and Termination
  term: z.string().default('Perpetual'),
  terminationEvents: z
    .array(z.string())
    .default([
      'Mutual consent of all shareholders',
      'Dissolution of the company',
      'Sale of all company assets',
    ]),

  // Additional Provisions
  additionalProvisions: z.string().optional(),

  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
  notarization: z.boolean().default(true),
});
