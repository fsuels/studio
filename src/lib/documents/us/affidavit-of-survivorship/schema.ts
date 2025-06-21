// src/lib/documents/us/affidavit-of-survivorship/schema.ts
import { z } from 'zod';

export const AffidavitOfSurvivorshipSchema = z.object({
  // Surviving Owner Information
  survivorName: z.string().min(1, "Survivor's name is required."),
  survivorAddress: z.string().min(1, "Survivor's address is required."),
  survivorCity: z.string().min(1, "Survivor's city is required."),
  survivorState: z.string().length(2, 'State must be 2 characters.'),
  survivorZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  survivorPhone: z.string().min(10, "Survivor's phone number is required."),
  survivorSSN: z
    .string()
    .min(1, "Survivor's Social Security Number is required."),

  // Deceased Owner Information
  decedentName: z.string().min(1, "Deceased person's name is required."),
  decedentDateOfDeath: z.string().min(1, 'Date of death is required.'),
  decedentDateOfBirth: z.string().min(1, 'Date of birth is required.'),
  decedentAddress: z.string().min(1, "Deceased person's address is required."),
  decedentCity: z.string().min(1, "Deceased person's city is required."),
  decedentState: z.string().length(2, 'State must be 2 characters.'),
  decedentZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  decedentSSN: z
    .string()
    .min(1, "Deceased person's Social Security Number is required."),

  // Property/Asset Information
  propertyDescription: z.string().min(1, 'Property description is required.'),
  propertyAddress: z.string().min(1, 'Property address is required.'),
  propertyCity: z.string().min(1, 'Property city is required.'),
  propertyState: z.string().length(2, 'State must be 2 characters.'),
  propertyZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  propertyType: z.enum([
    'real_estate',
    'bank_account',
    'investment_account',
    'vehicle',
    'other',
  ]),
  propertyTypeOther: z.string().optional(),

  // Ownership Information
  ownershipType: z.enum([
    'joint_tenants',
    'tenants_entirety',
    'joint_account',
    'other',
  ]),
  ownershipTypeOther: z.string().optional(),
  ownershipPercentages: z
    .string()
    .min(1, 'Ownership percentages are required.'),

  // Original Ownership Documentation
  originalDeedDate: z
    .string()
    .min(1, 'Original deed/document date is required.'),
  originalDeedBook: z.string().optional(),
  originalDeedPage: z.string().optional(),
  originalRecordingInfo: z.string().optional(),

  // Survivorship Details
  survivorshipRights: z.boolean().default(true),
  survivorshipDescription: z
    .string()
    .min(1, 'Survivorship description is required.'),

  // Death Certificate Information
  deathCertificateNumber: z.string().optional(),
  deathCertificateIssuer: z.string().optional(),
  deathCertificateDate: z.string().optional(),

  // Relationship Information
  relationshipToDeceased: z
    .string()
    .min(1, 'Relationship to deceased is required.'),
  marriageDate: z.string().optional(),
  marriagePlace: z.string().optional(),

  // Additional Owners (if any)
  hasAdditionalOwners: z.boolean().default(false),
  additionalOwners: z
    .array(
      z.object({
        name: z.string().min(1, 'Owner name is required.'),
        status: z.enum(['living', 'deceased']),
        address: z.string().optional(),
        dateOfDeath: z.string().optional(),
      }),
    )
    .optional(),

  // Estate Information
  hasProbateProceedings: z.boolean().default(false),
  probateDetails: z.string().optional(),
  hasWill: z.boolean().default(false),
  willDetails: z.string().optional(),

  // Legal Declarations
  noLiens: z.boolean().default(true),
  noDebts: z.boolean().default(true),
  debtInformation: z.string().optional(),

  // Additional Information
  additionalInformation: z.string().optional(),

  // Financial Institution Information (for accounts)
  institutionName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountType: z.string().optional(),

  // Vehicle Information (if applicable)
  vehicleVIN: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),

  // Legal Information
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
  dateCreated: z.string().min(1, 'Date created is required.'),

  // Notarization
  notaryName: z.string().optional(),
  notaryCommissionExpires: z.string().optional(),
});

export const schema = AffidavitOfSurvivorshipSchema;
