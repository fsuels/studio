// src/lib/documents/us/affidavit-of-heirship/schema.ts
import { z } from 'zod';

export const AffidavitOfHeirshipSchema = z.object({
  // Deceased Person Information
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

  // Affiant's knowledge of the deceased
  yearsKnownDecedent: z.string().min(1, 'Years known decedent is required.'),
  relationshipDuration: z
    .string()
    .min(1, 'Duration of relationship is required.'),

  // Family Information
  decedentMaritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),

  // Spouse Information (if married or widowed)
  spouseName: z.string().optional(),
  spouseDateOfDeath: z.string().optional(),
  spouseStillLiving: z.boolean().optional(),

  // Marriage Information
  marriageDate: z.string().optional(),
  marriagePlace: z.string().optional(),

  // Children Information
  hasChildren: z.boolean().default(false),
  children: z
    .array(
      z.object({
        name: z.string().min(1, 'Child name is required.'),
        dateOfBirth: z.string().min(1, 'Date of birth is required.'),
        isLiving: z.boolean().default(true),
        dateOfDeath: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .optional(),

  // Parents Information
  fatherName: z.string().optional(),
  fatherDateOfDeath: z.string().optional(),
  fatherIsLiving: z.boolean().optional(),
  motherName: z.string().optional(),
  motherDateOfDeath: z.string().optional(),
  motherIsLiving: z.boolean().optional(),

  // Siblings Information
  hasSiblings: z.boolean().default(false),
  siblings: z
    .array(
      z.object({
        name: z.string().min(1, 'Sibling name is required.'),
        dateOfBirth: z.string().optional(),
        isLiving: z.boolean().default(true),
        dateOfDeath: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .optional(),

  // Other Heirs
  hasOtherHeirs: z.boolean().default(false),
  otherHeirs: z
    .array(
      z.object({
        name: z.string().min(1, 'Heir name is required.'),
        relationship: z.string().min(1, 'Relationship is required.'),
        dateOfBirth: z.string().optional(),
        isLiving: z.boolean().default(true),
        dateOfDeath: z.string().optional(),
        address: z.string().min(1, 'Address is required.'),
      }),
    )
    .optional(),

  // Estate Information
  hasWill: z.boolean().default(false),
  willDescription: z.string().optional(),
  hasProbateProceedings: z.boolean().default(false),
  probateDescription: z.string().optional(),

  // Property Information
  propertyDescription: z.string().min(1, 'Property description is required.'),
  propertyAddress: z.string().min(1, 'Property address is required.'),
  propertyCity: z.string().min(1, 'Property city is required.'),
  propertyState: z.string().length(2, 'State must be 2 characters.'),
  propertyZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  propertyValue: z.string().min(1, 'Property value is required.'),

  // Additional Information
  additionalInformation: z.string().optional(),

  // Witness Information (if required)
  witness1Name: z.string().optional(),
  witness1Address: z.string().optional(),
  witness2Name: z.string().optional(),
  witness2Address: z.string().optional(),

  // Legal Information
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
  dateCreated: z.string().min(1, 'Date created is required.'),

  // Notarization
  notaryName: z.string().optional(),
  notaryCommissionExpires: z.string().optional(),
});

export const schema = AffidavitOfHeirshipSchema;
