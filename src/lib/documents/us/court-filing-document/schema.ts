// src/lib/documents/us/court-filing-document/schema.ts
import { z } from 'zod';

export const CourtFilingDocumentSchema = z.object({
  // Court Information
  courtName: z.string().min(1, 'Court name is required'),
  courtAddress: z.string().optional(),
  courtPhone: z.string().optional(),
  judgeAssigned: z.string().optional(),
  courtClerk: z.string().optional(),

  // Case Information
  caseNumber: z.string().optional(),
  caseTitle: z.string().min(1, 'Case title is required'),
  caseType: z
    .enum(['civil', 'criminal', 'family', 'probate', 'small-claims'])
    .default('civil'),
  filingDate: z.string().optional(),

  // Party Information
  plaintiffName: z.string().optional(),
  plaintiffAddress: z.string().optional(),
  plaintiffAttorney: z.string().optional(),
  defendantName: z.string().optional(),
  defendantAddress: z.string().optional(),
  defendantAttorney: z.string().optional(),

  // Document Details
  documentType: z
    .enum(['complaint', 'answer', 'motion', 'petition', 'response', 'brief'])
    .default('complaint'),
  documentTitle: z.string().min(1, 'Document title is required'),
  relief: z.string().optional(),
  factualAllegations: z.string().optional(),
  legalBasis: z.string().optional(),

  // Filing Information
  attorneyName: z.string().optional(),
  attorneyBarNumber: z.string().optional(),
  attorneyAddress: z.string().optional(),
  attorneyPhone: z.string().optional(),
  attorneyEmail: z.string().email().optional(),

  // Service Information
  serviceMethod: z
    .enum(['personal', 'certified-mail', 'publication', 'electronic'])
    .optional(),
  serviceDate: z.string().optional(),
  proofOfService: z.boolean().default(false),

  // Supporting Documents
  exhibitsAttached: z.boolean().default(false),
  numberOfExhibits: z.string().optional(),
  affidavitAttached: z.boolean().default(false),
  supportingDocuments: z.string().optional(),

  // Verification
  requiresVerification: z.boolean().default(false),
  verificationText: z.string().optional(),
  perjuryWarning: z.boolean().default(false),

  // Filing Fees
  filingFeeRequired: z.boolean().default(true),
  filingFeeAmount: z.string().optional(),
  feeWaiverRequested: z.boolean().default(false),

  // Special Provisions
  expeditedHearing: z.boolean().default(false),
  temporaryRestraintingOrder: z.boolean().default(false),
  preliminaryInjunction: z.boolean().default(false),

  // Signature Requirements
  requireAttorneySignature: z.boolean().default(true),
  requirePartySignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
