// src/lib/documents/us/small-estate-affidavit/schema.ts
import { z } from 'zod';

export const SmallEstateAffidavitSchema = z.object({
  // Deceased Person Information
  decedentName: z.string().min(1, "Deceased person's name is required."),
  decedentDateOfDeath: z.string().min(1, "Date of death is required."),
  decedentDateOfBirth: z.string().min(1, "Date of birth is required."),
  decedentAddress: z.string().min(1, "Deceased person's address is required."),
  decedentCity: z.string().min(1, "Deceased person's city is required."),
  decedentState: z.string().length(2, 'State must be 2 characters.'),
  decedentZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  decedentSSN: z.string().min(1, "Deceased person's Social Security Number is required."),

  // Affiant Information
  affiantName: z.string().min(1, "Affiant's name is required."),
  affiantAddress: z.string().min(1, "Affiant's address is required."),
  affiantCity: z.string().min(1, "Affiant's city is required."),
  affiantState: z.string().length(2, 'State must be 2 characters.'),
  affiantZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  affiantPhone: z.string().min(10, "Affiant's phone number is required."),
  affiantRelationship: z.string().min(1, "Affiant's relationship to deceased is required."),

  // Estate Information
  estateValue: z.string().min(1, 'Total estate value is required.'),
  hasWill: z.boolean().default(false),
  hasProbateProceedings: z.boolean().default(false),
  
  // Heirs Information
  heirs: z.array(z.object({
    name: z.string().min(1, 'Heir name is required.'),
    relationship: z.string().min(1, 'Relationship to deceased is required.'),
    address: z.string().min(1, 'Heir address is required.'),
    share: z.string().min(1, 'Share of estate is required.'),
    age: z.string().min(1, 'Age is required.'),
  })).min(1, 'At least one heir is required.'),

  // Debts and Liabilities
  totalDebts: z.string().min(1, 'Total debts amount is required.'),
  debtsPaid: z.boolean().default(false),
  debtDescription: z.string().optional(),

  // Assets
  assets: z.array(z.object({
    description: z.string().min(1, 'Asset description is required.'),
    value: z.string().min(1, 'Asset value is required.'),
    location: z.string().optional(),
  })).min(1, 'At least one asset is required.'),

  // Additional Information
  additionalInformation: z.string().optional(),
  
  // Funeral Expenses
  funeralExpenses: z.string().min(1, 'Funeral expenses amount is required.'),
  funeralExpensesPaid: z.boolean().default(false),

  // Legal Information
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
  dateCreated: z.string().min(1, 'Date created is required.'),

  // Notarization
  notaryName: z.string().optional(),
  notaryCommissionExpires: z.string().optional(),
});

export const schema = SmallEstateAffidavitSchema;