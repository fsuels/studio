// src/lib/documents/us/photography-release/schema.ts
import { z } from 'zod';

export const PhotographyReleaseSchema = z.object({
  // Subject Information
  subjectName: z.string().min(1, 'Subject name is required'),
  subjectAddress: z.string().optional(),
  subjectPhone: z.string().optional(),
  subjectEmail: z.string().email().optional(),
  subjectAge: z.string().optional(),

  // Guardian Information (if minor)
  isMinor: z.boolean().default(false),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianSignature: z.boolean().default(false),

  // Photographer Information
  photographerName: z.string().min(1, 'Photographer name is required'),
  photographerAddress: z.string().optional(),
  photographerPhone: z.string().optional(),
  photographerEmail: z.string().email().optional(),

  // Photo Session Details
  sessionDate: z.string().optional(),
  sessionLocation: z.string().optional(),
  sessionDescription: z.string().optional(),
  photoType: z
    .enum(['portrait', 'event', 'commercial', 'artistic', 'documentary'])
    .optional(),

  // Usage Rights
  commercialUse: z.boolean().default(false),
  editorialUse: z.boolean().default(false),
  promotionalUse: z.boolean().default(false),
  advertisingUse: z.boolean().default(false),
  websiteUse: z.boolean().default(false),
  socialMediaUse: z.boolean().default(false),

  // Distribution Rights
  printPublication: z.boolean().default(false),
  digitalPublication: z.boolean().default(false),
  broadcastUse: z.boolean().default(false),
  onlineUse: z.boolean().default(false),

  // Compensation
  compensationProvided: z.boolean().default(false),
  compensationAmount: z.string().optional(),
  compensationType: z
    .enum(['cash', 'prints', 'credit', 'none'])
    .default('none'),

  // Credit and Attribution
  creditRequired: z.boolean().default(false),
  creditFormat: z.string().optional(),

  // Restrictions
  timeRestrictions: z.string().optional(),
  geographicRestrictions: z.string().optional(),
  usageRestrictions: z.string().optional(),

  // Image Modifications
  editingAllowed: z.boolean().default(true),
  alterationsAllowed: z.boolean().default(true),
  cropAllowed: z.boolean().default(true),
  filtersAllowed: z.boolean().default(true),

  // Ownership and Copyright
  copyrightOwner: z
    .enum(['photographer', 'subject', 'shared'])
    .default('photographer'),
  exclusiveRights: z.boolean().default(false),
  transferRights: z.boolean().default(false),

  // Release Scope
  releaseScope: z
    .enum(['limited', 'unlimited', 'specific-project'])
    .default('limited'),
  projectName: z.string().optional(),
  releaseDuration: z.string().optional(),

  // Legal Terms
  liabilityWaiver: z.boolean().default(true),
  indemnificationClause: z.boolean().default(false),
  governingLaw: z.string().optional(),

  // Signature Requirements
  requireSubjectSignature: z.boolean().default(true),
  requireGuardianSignature: z.boolean().default(false),
  requirePhotographerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
