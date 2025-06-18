// src/lib/documents/us/cryptocurrency-agreement/schema.ts
import { z } from 'zod';

export const CryptocurrencyAgreementSchema = z.object({
  // Party Information
  party1Name: z.string().min(1, 'Party 1 name is required'),
  party1Address: z.string().min(1, 'Party 1 address is required'),
  party1WalletAddress: z.string().optional(),
  party1Email: z.string().email().optional(),
  
  party2Name: z.string().min(1, 'Party 2 name is required'),
  party2Address: z.string().min(1, 'Party 2 address is required'),
  party2WalletAddress: z.string().optional(),
  party2Email: z.string().email().optional(),
  
  // Transaction Details
  transactionType: z.enum(['sale', 'purchase', 'exchange', 'loan', 'mining', 'staking']).default('sale'),
  cryptocurrency: z.string().min(1, 'Cryptocurrency type is required'),
  amount: z.string().min(1, 'Amount is required'),
  exchangeRate: z.string().optional(),
  totalValue: z.string().optional(),
  
  // Payment Terms
  paymentMethod: z.enum(['cryptocurrency', 'fiat', 'both']).default('cryptocurrency'),
  paymentCurrency: z.string().optional(),
  paymentSchedule: z.enum(['immediate', 'installments', 'milestone-based']).default('immediate'),
  escrowRequired: z.boolean().default(false),
  
  // Blockchain Details
  blockchain: z.string().optional(),
  networkFees: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  confirmationRequirements: z.string().optional(),
  smartContractAddress: z.string().optional(),
  
  // Wallet and Security
  walletType: z.string().optional(),
  privateKeyResponsibility: z.enum(['party1', 'party2', 'shared']).default('party1'),
  multiSignatureRequired: z.boolean().default(false),
  securityRequirements: z.string().optional(),
  
  // Compliance and Regulations
  kycCompliance: z.boolean().default(false),
  amlCompliance: z.boolean().default(false),
  taxReporting: z.boolean().default(true),
  regulatoryCompliance: z.string().optional(),
  
  // Risk Acknowledgment
  volatilityRisk: z.boolean().default(true),
  technologyRisk: z.boolean().default(true),
  regulatoryRisk: z.boolean().default(true),
  lossOfFunds: z.boolean().default(true),
  
  // Mining/Staking Specific
  miningPool: z.string().optional(),
  hashRate: z.string().optional(),
  stakingPeriod: z.string().optional(),
  rewardDistribution: z.string().optional(),
  
  // Exchange/Trading Terms
  tradingPlatform: z.string().optional(),
  orderType: z.enum(['market', 'limit', 'stop-loss']).optional(),
  priceSlippage: z.string().optional(),
  tradingFees: z.string().optional(),
  
  // Custody and Storage
  custodyArrangement: z.enum(['self-custody', 'third-party', 'shared']).default('self-custody'),
  storageMethod: z.enum(['hot-wallet', 'cold-wallet', 'hardware', 'exchange']).default('hot-wallet'),
  backupRequirements: z.string().optional(),
  
  // Technical Specifications
  protocolVersion: z.string().optional(),
  gasLimit: z.string().optional(),
  gasPriceLimit: z.string().optional(),
  technicalRequirements: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['arbitration', 'mediation', 'court']).optional(),
  arbitrationRules: z.string().optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Force Majeure
  forceMarjeure: z.boolean().default(true),
  networkCongestion: z.boolean().default(true),
  hardFork: z.boolean().default(true),
  regulatoryChanges: z.boolean().default(true),
  
  // Liability
  liabilityLimitation: z.boolean().default(true),
  maxLiability: z.string().optional(),
  indemnification: z.boolean().default(false),
  
  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  postTerminationObligations: z.string().optional(),
  
  // Signature Requirements
  requireParty1Signature: z.boolean().default(true),
  requireParty2Signature: z.boolean().default(true),
  digitalSignatureRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});