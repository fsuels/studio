import { z } from 'zod';

export const marketingAgreementSchema = z.object({
  // Parties
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  marketingCompanyName: z.string().min(1, 'Marketing company name is required'),
  marketingCompanyAddress: z.string().min(1, 'Marketing company address is required'),
  
  // Services
  marketingServices: z.array(z.string()).min(1, 'At least one marketing service is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  marketingChannels: z.array(z.string()).min(1, 'At least one marketing channel is required'),
  
  // Campaign Details
  campaignName: z.string().optional(),
  campaignDescription: z.string().min(1, 'Campaign description is required'),
  campaignDuration: z.string().min(1, 'Campaign duration is required'),
  
  // Budget and Payment
  totalBudget: z.number().min(0, 'Total budget must be non-negative'),
  paymentStructure: z.enum(['monthly', 'milestone', 'performance', 'upfront']),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  
  // Performance Metrics
  kpis: z.array(z.string()).default([
    'Brand awareness',
    'Lead generation',
    'Website traffic',
    'Conversion rate'
  ]),
  reportingFrequency: z.enum(['weekly', 'monthly', 'quarterly']).default('monthly'),
  
  // Intellectual Property
  contentOwnership: z.enum(['client', 'agency', 'shared']).default('client'),
  
  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  
  // Termination
  terminationNotice: z.string().default('30 days'),
  
  // Additional Terms
  additionalTerms: z.string().optional(),
  
  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
});