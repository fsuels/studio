// src/lib/documents/us/affidavit-of-death/schema.ts
import { z } from 'zod';

export const AffidavitOfDeathSchema = z.object({
  // Deceased Person Information
  decedentName: z.string().min(1, "Deceased person's name is required."),
  decedentDateOfDeath: z.string().min(1, 'Date of death is required.'),
  decedentPlaceOfDeath: z.string().min(1, 'Place of death is required.'),
  decedentDateOfBirth: z.string().min(1, 'Date of birth is required.'),
  decedentAddress: z.string().min(1, "Deceased person's address is required."),
  decedentCity: z.string().min(1, "Deceased person's city is required."),
  decedentState: z.string().length(2, 'State must be 2 characters.'),
  decedentZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  decedentSSN: z
    .string()
    .min(1, "Deceased person's Social Security Number is required."),

  // Affiant Information
  affiantName: z.string().min(1, "Affiant's name is required."),
  affiantAddress: z.string().min(1, "Affiant's address is required."),
  affiantCity: z.string().min(1, "Affiant's city is required."),
  affiantState: z.string().length(2, 'State must be 2 characters.'),
  affiantZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  affiantPhone: z.string().min(10, "Affiant's phone number is required."),
  affiantRelationship: z
    .string()
    .min(1, "Affiant's relationship to deceased is required."),

  // Death Certificate Information
  deathCertificateNumber: z.string().optional(),
  deathCertificateIssuer: z.string().optional(),
  deathCertificateDate: z.string().optional(),
  deathCertificateAttached: z.boolean().default(false),

  // Circumstances of Death
  causeOfDeath: z.string().optional(),
  deathCircumstances: z.string().optional(),
  attendingPhysician: z.string().optional(),
  hospitalOrLocation: z.string().optional(),

  // Witness Information (if no death certificate)
  hasWitnesses: z.boolean().default(false),
  witnesses: z
    .array(
      z.object({
        name: z.string().min(1, 'Witness name is required.'),
        address: z.string().min(1, 'Witness address is required.'),
        relationship: z
          .string()
          .min(1, 'Relationship to deceased is required.'),
        phone: z.string().optional(),
      }),
    )
    .optional(),

  // Family Information
  survivingSpouse: z.string().optional(),
  spouseAddress: z.string().optional(),
  children: z
    .array(
      z.object({
        name: z.string().min(1, 'Child name is required.'),
        address: z.string().optional(),
        age: z.string().optional(),
      }),
    )
    .optional(),

  // Funeral Information
  funeralHome: z.string().optional(),
  funeralHomeAddress: z.string().optional(),
  funeralDate: z.string().optional(),
  burialPlace: z.string().optional(),
  burialDate: z.string().optional(),

  // Purpose of Affidavit
  purposeOfAffidavit: z.string().min(1, 'Purpose of affidavit is required.'),
  specificInstitution: z.string().optional(),
  institutionAddress: z.string().optional(),

  // Property/Asset Information (if applicable)
  assetsInvolved: z.boolean().default(false),
  assetDescription: z.string().optional(),
  assetValue: z.string().optional(),

  // Additional Information
  additionalInformation: z.string().optional(),
  urgentRequest: z.boolean().default(false),
  urgentReason: z.string().optional(),

  // Medical Information (if relevant)
  lastSeenAlive: z.string().optional(),
  lastSeenAliveBy: z.string().optional(),
  medicalConditions: z.string().optional(),

  // Legal Information
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
  dateCreated: z.string().min(1, 'Date created is required.'),

  // Notarization
  notaryName: z.string().optional(),
  notaryCommissionExpires: z.string().optional(),
});

export const schema = AffidavitOfDeathSchema;
