// src/lib/documents/us/corporate-bylaws/schema.ts
import { z } from 'zod';

export const corporateBylawsSchema = z.object({
  // Corporation Information
  corporationName: z.string().min(1, 'Corporation name is required'),
  stateOfIncorporation: z.string().min(1, 'State of incorporation is required'),
  principalOfficeAddress: z
    .string()
    .min(1, 'Principal office address is required'),
  registeredAgentName: z.string().min(1, 'Registered agent name is required'),
  registeredAgentAddress: z
    .string()
    .min(1, 'Registered agent address is required'),

  // Shareholders
  authorizedShares: z
    .string()
    .min(1, 'Number of authorized shares is required'),
  shareClasses: z.string().optional(),
  shareholderMeetings: z
    .string()
    .min(1, 'Shareholder meeting provisions are required'),
  annualMeetingDate: z.string().optional(),
  votingRights: z.string().min(1, 'Voting rights provisions are required'),
  quorumRequirements: z.string().min(1, 'Quorum requirements are required'),

  // Board of Directors
  numberOfDirectors: z.string().min(1, 'Number of directors is required'),
  directorQualifications: z.string().optional(),
  directorTermLength: z.string().min(1, 'Director term length is required'),
  boardMeetingFrequency: z
    .string()
    .min(1, 'Board meeting frequency is required'),
  directorCompensation: z.string().optional(),
  boardQuorum: z.string().min(1, 'Board quorum requirements are required'),

  // Officers
  requiredOfficers: z.string().min(1, 'Required officers list is required'),
  officerDuties: z.string().min(1, 'Officer duties are required'),
  officerTerms: z.string().min(1, 'Officer terms are required'),
  officerCompensation: z.string().optional(),

  // Committees
  committeesAllowed: z.boolean(),
  committeeTypes: z.string().optional(),
  committeeAuthority: z.string().optional(),

  // Corporate Records
  recordKeeping: z.string().min(1, 'Record keeping requirements are required'),
  inspectionRights: z.string().min(1, 'Inspection rights are required'),
  corporateSeal: z.boolean(),

  // Indemnification
  indemnificationProvisions: z
    .string()
    .min(1, 'Indemnification provisions are required'),
  insuranceRequirements: z.string().optional(),

  // Amendment Process
  bylawAmendmentProcess: z
    .string()
    .min(1, 'Bylaw amendment process is required'),
  votingRequirementsAmendments: z
    .string()
    .min(1, 'Voting requirements for amendments are required'),

  // Dissolution
  dissolutionProcess: z.string().optional(),
  assetDistribution: z.string().optional(),

  // Additional Provisions
  conflictOfInterest: z.string().optional(),
  financialYear: z.string().optional(),
  additionalProvisions: z.string().optional(),

  // Execution
  adoptionDate: z.string().min(1, 'Adoption date is required'),
  incorporatorSignature: z
    .string()
    .min(1, 'Incorporator signature is required'),
  secretarySignature: z.string().optional(),
  notaryRequired: z.boolean(),
});
