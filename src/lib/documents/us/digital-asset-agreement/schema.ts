// src/lib/documents/us/digital-asset-agreement/schema.ts
import { z } from 'zod';

export const DigitalAssetAgreementSchema = z.object({
  // Parties Information
  party1Name: z.string().min(1, 'Party 1 name is required'),
  party1Address: z.string().optional(),
  party1WalletAddress: z.string().optional(),
  party1Email: z.string().email().optional(),
  party1Type: z.enum(['individual', 'entity', 'dao', 'trust']).default('individual'),
  
  party2Name: z.string().min(1, 'Party 2 name is required'),
  party2Address: z.string().optional(),
  party2WalletAddress: z.string().optional(),
  party2Email: z.string().email().optional(),
  party2Type: z.enum(['individual', 'entity', 'dao', 'trust']).default('individual'),
  
  // Digital Asset Details
  assetType: z.enum(['cryptocurrency', 'nft', 'token', 'dao-token', 'utility-token', 'security-token', 'stablecoin']).optional(),
  assetName: z.string().optional(),
  assetSymbol: z.string().optional(),
  blockchain: z.enum(['ethereum', 'bitcoin', 'polygon', 'solana', 'cardano', 'binance-smart-chain', 'other']).optional(),
  contractAddress: z.string().optional(),
  tokenStandard: z.enum(['erc-20', 'erc-721', 'erc-1155', 'bep-20', 'spl', 'other']).optional(),
  
  // Transaction Details
  transactionType: z.enum(['sale', 'purchase', 'transfer', 'exchange', 'mining', 'staking', 'lending']).optional(),
  assetQuantity: z.string().optional(),
  assetValue: z.string().optional(),
  fiatCurrency: z.enum(['usd', 'eur', 'gbp', 'jpy', 'cad', 'aud']).default('usd'),
  exchangeRate: z.string().optional(),
  
  // Payment Terms
  paymentMethod: z.enum(['crypto', 'fiat', 'mixed', 'defi']).default('crypto'),
  paymentCurrency: z.string().optional(),
  paymentAddress: z.string().optional(),
  escrowService: z.boolean().default(false),
  escrowProvider: z.string().optional(),
  
  // Smart Contract Integration
  smartContract: z.boolean().default(false),
  contractCode: z.string().optional(),
  contractAudit: z.boolean().default(false),
  automatedExecution: z.boolean().default(false),
  multisigRequired: z.boolean().default(false),
  
  // NFT Specific Terms
  nftMetadata: z.string().optional(),
  royaltyPercentage: z.string().optional(),
  royaltyRecipient: z.string().optional(),
  transferRestrictions: z.string().optional(),
  resaleRights: z.boolean().default(true),
  
  // Mining and Staking
  miningRights: z.boolean().default(false),
  stakingRights: z.boolean().default(false),
  stakingRewards: z.string().optional(),
  stakingPeriod: z.string().optional(),
  slashingConditions: z.string().optional(),
  
  // DAO Governance
  votingRights: z.boolean().default(false),
  governanceParticipation: z.boolean().default(false),
  proposalRights: z.boolean().default(false),
  quorumRequirements: z.string().optional(),
  
  // Custody and Security
  custodyArrangement: z.enum(['self-custody', 'third-party', 'multi-party', 'institutional']).default('self-custody'),
  custodian: z.string().optional(),
  privateKeyManagement: z.string().optional(),
  securityMeasures: z.string().optional(),
  
  // Compliance and Regulation
  kycCompliance: z.boolean().default(false),
  amlCompliance: z.boolean().default(false),
  sanctionsCompliance: z.boolean().default(true),
  regulatoryJurisdiction: z.string().optional(),
  securitiesLaws: z.boolean().default(false),
  
  // Tax Considerations
  taxReporting: z.boolean().default(true),
  taxJurisdiction: z.string().optional(),
  capitalGainsTreatment: z.boolean().default(false),
  taxWithholding: z.boolean().default(false),
  
  // Risk Disclosure
  volatilityRisk: z.boolean().default(true),
  liquidityRisk: z.boolean().default(true),
  technologyRisk: z.boolean().default(true),
  regulatoryRisk: z.boolean().default(true),
  lossOfFundsRisk: z.boolean().default(true),
  
  // Technical Specifications
  networkFees: z.string().optional(),
  confirmationRequirements: z.string().optional(),
  blockchainNetwork: z.string().optional(),
  gasLimits: z.string().optional(),
  
  // Intellectual Property
  ipOwnership: z.string().optional(),
  copyrightNotice: z.boolean().default(false),
  trademarkRights: z.boolean().default(false),
  licenseTerms: z.string().optional(),
  
  // Environmental Considerations
  carbonFootprint: z.string().optional(),
  sustainabilityMeasures: z.string().optional(),
  greenBlockchain: z.boolean().default(false),
  
  // Cross-Chain Operations
  bridgeProtocol: z.string().optional(),
  crossChainCompatibility: z.boolean().default(false),
  wrappedTokens: z.boolean().default(false),
  interoperability: z.string().optional(),
  
  // Decentralized Finance (DeFi)
  defiProtocol: z.string().optional(),
  liquidityProvision: z.boolean().default(false),
  yieldFarming: z.boolean().default(false),
  flashLoans: z.boolean().default(false),
  impermanentLoss: z.string().optional(),
  
  // Oracle Integration
  priceOracle: z.string().optional(),
  oracleProvider: z.string().optional(),
  dataFeeds: z.string().optional(),
  oracleFailure: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['arbitration', 'mediation', 'blockchain-based', 'traditional-court']).default('arbitration'),
  arbitrationRules: z.string().optional(),
  onChainDispute: z.boolean().default(false),
  
  // Force Majeure
  networkCongestion: z.boolean().default(true),
  hardFork: z.boolean().default(true),
  regulatoryChanges: z.boolean().default(true),
  technicalFailure: z.boolean().default(true),
  
  // Termination and Transfer
  transferConditions: z.string().optional(),
  lockupPeriod: z.string().optional(),
  vestingSchedule: z.string().optional(),
  burnMechanism: z.boolean().default(false),
  
  // Privacy and Anonymity
  privacyCoins: z.boolean().default(false),
  anonymityFeatures: z.string().optional(),
  transparencyRequirements: z.string().optional(),
  dataPrivacy: z.boolean().default(true),
  
  // Legal Framework
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  codeIsLaw: z.boolean().default(false),
  legalPrecedence: z.enum(['code', 'contract', 'law']).default('law'),
  
  // Signature and Acceptance
  digitalSignature: z.boolean().default(true),
  walletSignature: z.boolean().default(false),
  multisigSignature: z.boolean().default(false),
  timestampProof: z.boolean().default(false),
  blockchainProof: z.boolean().default(false),
});