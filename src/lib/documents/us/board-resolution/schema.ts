import { z } from 'zod';

export const boardResolutionSchema = z.object({
  // Corporation Information
  corporationName: z.string().min(1, 'Corporation name is required'),
  stateOfIncorporation: z.string().min(1, 'State of incorporation is required'),
  
  // Meeting Information
  meetingType: z.enum(['regular', 'special']),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  meetingTime: z.string().min(1, 'Meeting time is required'),
  meetingLocation: z.string().min(1, 'Meeting location is required'),
  
  // Directors Present
  directorsPresent: z.array(z.object({
    name: z.string().min(1, 'Director name is required'),
    title: z.string().default('Director')
  })).min(1, 'At least one director must be present'),
  
  // Quorum Information
  totalDirectors: z.number().min(1, 'Total number of directors is required'),
  quorumRequired: z.number().min(1, 'Quorum requirement is required'),
  quorumPresent: z.boolean().default(true),
  
  // Resolution Details
  resolutionTitle: z.string().min(1, 'Resolution title is required'),
  resolutionType: z.enum([
    'appointment',
    'banking',
    'contract-approval',
    'policy-adoption',
    'dividend-declaration',
    'stock-issuance',
    'merger-acquisition',
    'loan-authorization',
    'lease-approval',
    'officer-compensation',
    'other'
  ]),
  resolutionDescription: z.string().min(1, 'Resolution description is required'),
  
  // Specific Resolution Content
  appointmentDetails: z.object({
    appointeeName: z.string().optional(),
    position: z.string().optional(),
    term: z.string().optional(),
    compensation: z.string().optional()
  }).optional(),
  
  bankingDetails: z.object({
    bankName: z.string().optional(),
    accountType: z.string().optional(),
    authorizedSigners: z.array(z.string()).optional(),
    limits: z.string().optional()
  }).optional(),
  
  contractDetails: z.object({
    counterparty: z.string().optional(),
    contractValue: z.string().optional(),
    contractTerm: z.string().optional(),
    keyTerms: z.string().optional()
  }).optional(),
  
  // Voting Information
  votingResults: z.object({
    inFavor: z.number().min(0),
    against: z.number().min(0),
    abstentions: z.number().min(0)
  }),
  
  // Meeting Conclusion
  chairpersonName: z.string().min(1, 'Chairperson name is required'),
  secretaryName: z.string().min(1, 'Secretary name is required'),
  meetingAdjournmentTime: z.string().optional(),
  
  // Additional Information
  attachments: z.array(z.string()).default([]),
  additionalProvisions: z.string().optional(),
  
  // Execution
  resolutionDate: z.string().min(1, 'Resolution date is required'),
  notarization: z.boolean().default(true),
});