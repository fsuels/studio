import { z } from 'zod';

export const termSheetSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  businessDescription: z.string().min(1, 'Business description is required'),

  // Investment Details
  investmentAmount: z.number().min(1, 'Investment amount is required'),
  investmentType: z.enum(['equity', 'convertible-debt', 'safe', 'debt']),
  securityType: z.string().min(1, 'Security type is required'),

  // Valuation
  preMoneyValuation: z
    .number()
    .min(0, 'Pre-money valuation must be non-negative'),
  postMoneyValuation: z
    .number()
    .min(0, 'Post-money valuation must be non-negative'),

  // Investor Information
  leadInvestor: z.string().min(1, 'Lead investor name is required'),
  investorType: z.enum([
    'individual',
    'venture-capital',
    'private-equity',
    'angel',
    'strategic',
  ]),
  totalInvestors: z.number().min(1, 'Total number of investors is required'),

  // Terms
  liquidationPreference: z.string().default('1x non-participating'),
  dividendRate: z.number().min(0).max(100).optional(),
  antiDilutionProvision: z
    .enum(['weighted-average', 'full-ratchet', 'none'])
    .default('weighted-average'),

  // Governance
  boardComposition: z.object({
    totalSeats: z.number().min(1, 'Total board seats is required'),
    investorSeats: z.number().min(0),
    founderSeats: z.number().min(0),
    independentSeats: z.number().min(0),
  }),

  // Protective Provisions
  protectiveProvisions: z
    .array(z.string())
    .default([
      'Sale or merger of the company',
      'Liquidation or dissolution',
      'Amendment to charter or bylaws',
      'Issuance of new securities',
      'Acquisition of other companies',
    ]),

  // Employee Stock Options
  employeeStockPool: z.number().min(0).max(100).default(10),
  stockPoolTiming: z.enum(['pre-money', 'post-money']).default('post-money'),

  // Use of Funds
  useOfFunds: z
    .array(
      z.object({
        category: z.string().min(1, 'Category is required'),
        amount: z.number().min(0, 'Amount must be non-negative'),
        percentage: z.number().min(0).max(100),
      }),
    )
    .min(1, 'At least one use of funds category is required'),

  // Closing Conditions
  closingConditions: z
    .array(z.string())
    .default([
      'Completion of due diligence',
      'Execution of definitive agreements',
      'Board approval',
      'Key employee agreements',
    ]),

  // Timeline
  exclusivityPeriod: z.string().default('30 days'),
  closingTimeline: z.string().default('60 days'),

  // Key Personnel
  keyPersonnel: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        position: z.string().min(1, 'Position is required'),
        equity: z.number().min(0).max(100).optional(),
      }),
    )
    .optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),

  // Execution
  termSheetDate: z.string().min(1, 'Term sheet date is required'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
});
