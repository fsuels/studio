// src/lib/documents/us/business-plan/schema.ts
import { z } from 'zod';

export const businessPlanSchema = z.object({
  // Executive Summary
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum(["sole_proprietorship", "partnership", "llc", "corporation", "nonprofit"]),
  businessLocation: z.string().min(1, "Business location is required"),
  missionStatement: z.string().min(1, "Mission statement is required"),
  visionStatement: z.string().optional(),
  keySuccessFactors: z.string().min(1, "Key success factors are required"),
  
  // Products/Services
  productsServices: z.string().min(1, "Products/services description is required"),
  targetMarket: z.string().min(1, "Target market is required"),
  competitiveAdvantage: z.string().min(1, "Competitive advantage is required"),
  
  // Market Analysis
  industryOverview: z.string().min(1, "Industry overview is required"),
  marketSize: z.string().optional(),
  targetCustomers: z.string().min(1, "Target customers description is required"),
  competitorAnalysis: z.string().min(1, "Competitor analysis is required"),
  
  // Marketing Strategy
  marketingStrategy: z.string().min(1, "Marketing strategy is required"),
  salesStrategy: z.string().min(1, "Sales strategy is required"),
  pricingStrategy: z.string().min(1, "Pricing strategy is required"),
  
  // Operations
  businessOperations: z.string().min(1, "Business operations description is required"),
  managementTeam: z.string().min(1, "Management team information is required"),
  organizationalStructure: z.string().optional(),
  
  // Financial Projections
  startupCosts: z.string().optional(),
  revenueProjections: z.string().optional(),
  expenseProjections: z.string().optional(),
  profitabilityTimeline: z.string().optional(),
  fundingRequirements: z.string().optional(),
  
  // Risk Analysis
  businessRisks: z.string().optional(),
  riskMitigation: z.string().optional(),
  
  // Implementation Timeline
  milestones: z.string().optional(),
  implementationPlan: z.string().optional(),
  
  // Appendices
  additionalInformation: z.string().optional(),
  supportingDocuments: z.string().optional(),
});