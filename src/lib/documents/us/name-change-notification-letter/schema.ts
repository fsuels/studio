// src/lib/documents/us/name-change-notification-letter/schema.ts
import { z } from 'zod';

export const NameChangeNotificationLetterSchema = z.object({
  // Personal Information
  oldName: z.string().min(1, 'Previous name is required'),
  newName: z.string().min(1, 'New name is required'),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().email().optional(),

  // Recipient Information
  recipientName: z.string().optional(),
  recipientTitle: z.string().optional(),
  organizationName: z.string().optional(),
  recipientAddress: z.string().optional(),

  // Name Change Details
  nameChangeDate: z.string().optional(),
  nameChangeReason: z
    .enum(['marriage', 'divorce', 'court-order', 'personal-choice'])
    .default('marriage'),
  courtOrderNumber: z.string().optional(),
  courtName: z.string().optional(),
  marriageCertificateNumber: z.string().optional(),
  divorceCertificateNumber: z.string().optional(),

  // Account/Record Information
  accountNumber: z.string().optional(),
  membershipNumber: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),

  // Documentation
  documentationIncluded: z.boolean().default(true),
  certifiedCopy: z.boolean().default(false),
  courtOrder: z.boolean().default(false),
  marriageCertificate: z.boolean().default(false),
  divorceDecree: z.boolean().default(false),

  // Request for Updates
  updateRecords: z.boolean().default(true),
  updateCommunications: z.boolean().default(true),
  updateBilling: z.boolean().default(true),
  updateLegalDocuments: z.boolean().default(true),

  // Contact Preferences
  preferredContactMethod: z.enum(['phone', 'email', 'mail']).default('email'),
  confirmationRequested: z.boolean().default(true),

  // Letter Date
  letterDate: z.string().optional(),

  // Signature Requirements
  signature: z.boolean().default(true),
  notarization: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
});
