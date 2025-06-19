// src/lib/documents/us/advance-directive-revocation/schema.ts
import { z } from 'zod';

export const AdvanceDirectiveRevocationSchema = z.object({
  // Principal Information
  principalName: z.string().min(1, "Principal's name is required."),
  principalAddress: z.string().min(1, "Principal's address is required."),
  principalCity: z.string().min(1, "Principal's city is required."),
  principalState: z.string().length(2, 'State must be 2 characters.'),
  principalZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  principalPhone: z.string().min(10, "Principal's phone number is required."),
  principalDateOfBirth: z.string().min(1, "Principal's date of birth is required."),

  // Original Advance Directive Information
  originalDirectiveDate: z.string().min(1, 'Original directive date is required.'),
  originalDirectiveLocation: z.string().optional(),
  originalNotaryName: z.string().optional(),
  originalWitnessNames: z.string().optional(),

  // Previous Health Care Agent Information
  previousAgentName: z.string().optional(),
  previousAgentAddress: z.string().optional(),
  previousAgentPhone: z.string().optional(),
  previousAgentRelationship: z.string().optional(),

  // Previous Alternate Agent Information (if any)
  hadAlternateAgent: z.boolean().default(false),
  previousAlternateAgentName: z.string().optional(),
  previousAlternateAgentAddress: z.string().optional(),
  previousAlternateAgentPhone: z.string().optional(),

  // Revocation Details
  revocationType: z.enum(['complete', 'partial', 'replacement']).default('complete'),
  revocationReason: z.string().min(1, 'Reason for revocation is required.'),
  specificProvisionsRevoked: z.string().optional(),

  // Notification Requirements
  agentNotified: z.boolean().default(false),
  agentNotificationDate: z.string().optional(),
  agentNotificationMethod: z.string().optional(),
  
  alternateAgentNotified: z.boolean().default(false),
  alternateAgentNotificationDate: z.string().optional(),
  alternateAgentNotificationMethod: z.string().optional(),

  // Medical Providers Notification
  physiciansNotified: z.boolean().default(false),
  physiciansList: z.array(z.object({
    name: z.string().min(1, 'Physician name is required.'),
    address: z.string().min(1, 'Physician address is required.'),
    notificationDate: z.string().optional(),
    notificationMethod: z.string().optional(),
  })).optional(),

  // Hospitals/Medical Facilities Notification
  facilitiesNotified: z.boolean().default(false),
  facilitiesList: z.array(z.object({
    name: z.string().min(1, 'Facility name is required.'),
    address: z.string().min(1, 'Facility address is required.'),
    notificationDate: z.string().optional(),
    notificationMethod: z.string().optional(),
  })).optional(),

  // Family Members/Others Notification
  familyNotified: z.boolean().default(false),
  familyList: z.array(z.object({
    name: z.string().min(1, 'Family member name is required.'),
    relationship: z.string().min(1, 'Relationship is required.'),
    address: z.string().optional(),
    phone: z.string().optional(),
    notificationDate: z.string().optional(),
  })).optional(),

  // Replacement Document Information
  hasReplacementDirective: z.boolean().default(false),
  replacementDirectiveDate: z.string().optional(),
  newAgentName: z.string().optional(),
  newAgentAddress: z.string().optional(),
  newAgentPhone: z.string().optional(),

  // Current Mental Capacity Declaration
  mentalCapacityConfirmation: z.boolean().default(true),
  capacityWitnessName: z.string().optional(),
  capacityWitnessAddress: z.string().optional(),

  // Destruction of Original Document
  originalDocumentDestroyed: z.boolean().default(false),
  destructionDate: z.string().optional(),
  destructionWitness: z.string().optional(),
  copiesLocation: z.string().optional(),

  // Additional Instructions
  additionalInstructions: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Witness Information
  witness1Name: z.string().min(1, "First witness name is required."),
  witness1Address: z.string().min(1, "First witness address is required."),
  witness2Name: z.string().min(1, "Second witness name is required."),
  witness2Address: z.string().min(1, "Second witness address is required."),

  // Legal Information
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
  dateCreated: z.string().min(1, 'Date created is required.'),
  effectiveDate: z.string().min(1, 'Effective date is required.'),

  // Notarization
  notaryName: z.string().optional(),
  notaryCommissionExpires: z.string().optional(),
});

export const schema = AdvanceDirectiveRevocationSchema;