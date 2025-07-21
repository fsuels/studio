// src/lib/documents/us/durable-power-of-attorney/schema.ts
import { z } from 'zod';

export const DurablePowerOfAttorneySchema = z.object({
  // Principal Information
  principalName: z.string().min(1, 'Principal name is required'),
  principalAddress: z.string().min(1, 'Principal address is required'),
  principalPhone: z.string().optional(),
  principalEmail: z.string().email().optional(),

  // Agent (Attorney-in-Fact) Information
  agentName: z.string().min(1, 'Agent name is required'),
  agentAddress: z.string().min(1, 'Agent address is required'),
  agentPhone: z.string().optional(),
  agentEmail: z.string().email().optional(),
  agentRelationship: z.string().min(1, 'Agent relationship is required'),

  // Successor Agent
  hasSuccessorAgent: z.boolean().default(false),
  successorAgentName: z.string().optional(),
  successorAgentAddress: z.string().optional(),
  successorAgentPhone: z.string().optional(),
  successorAgentRelationship: z.string().optional(),

  // Powers Granted
  financialPowers: z.array(z.string()).default([]),
  realEstatePowers: z.array(z.string()).default([]),
  bankingPowers: z.array(z.string()).default([]),
  investmentPowers: z.array(z.string()).default([]),
  insurancePowers: z.array(z.string()).default([]),
  businessPowers: z.array(z.string()).default([]),
  legalPowers: z.array(z.string()).default([]),

  // Special Powers
  giftingPowers: z.boolean().default(false),
  giftingLimits: z.string().optional(),
  createTrustPowers: z.boolean().default(false),
  changeBeneficiaryPowers: z.boolean().default(false),

  // Limitations
  powerLimitations: z.string().optional(),
  prohibitedActions: z.string().optional(),

  // Durability
  isDurable: z.boolean().default(true),
  incapacityClause: z.string().optional(),

  // Effective Date
  immediatelyEffective: z.boolean().default(true),
  effectiveDate: z.string().optional(),
  springingPOA: z.boolean().default(false),
  springingConditions: z.string().optional(),

  // Termination
  terminationConditions: z.string().optional(),
  revocationRights: z.string().optional(),

  // Compensation
  agentCompensation: z.enum(['none', 'reasonable', 'specific-amount']),
  compensationAmount: z.string().optional(),

  // Additional Provisions
  additionalProvisions: z.string().optional(),

  // Execution
  executionDate: z.string().optional(),
  executionState: z.string().optional(),

  // Witnesses
  witness1Name: z.string().optional(),
  witness1Address: z.string().optional(),
  witness2Name: z.string().optional(),
  witness2Address: z.string().optional(),
});
