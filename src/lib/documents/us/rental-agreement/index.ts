// Rental Agreement
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required").optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  date: z.string().min(1, "Date is required"),
  propertyAddress: z.string().min(1, "Property address required"),
  rentAmount: z.number().min(0, "Rent amount must be positive").optional(),
  leaseTerms: z.string().min(1, "Lease terms required").optional()
});

export const rentalAgreement: LegalDocument = {
  id: 'rental-agreement',
  name: 'Rental Agreement',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  basePrice: 35,
  requiresNotarization: false,
  canBeRecorded: false,
  offerRecordingHelp: false,
  schema,
  questions: [
  {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Enter name..."
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    required: false,
    placeholder: "Enter email..."
  },
  {
    id: "address",
    label: "Address",
    type: "address",
    required: true,
    placeholder: "Enter address..."
  },
  {
    id: "city",
    label: "City",
    type: "text",
    required: true,
    placeholder: "Enter city..."
  },
  {
    id: "state",
    label: "State",
    type: "text",
    required: true,
    placeholder: "Enter state..."
  },
  {
    id: "zipCode",
    label: "Zip Code",
    type: "text",
    required: true,
    placeholder: "Enter zip code..."
  },
  {
    id: "date",
    label: "Date",
    type: "date",
    required: true,
    placeholder: "Enter date..."
  },
  {
    id: "propertyAddress",
    label: "Property Address",
    type: "address",
    required: true,
    placeholder: "Enter property address..."
  },
  {
    id: "rentAmount",
    label: "Rent Amount",
    type: "number",
    required: false,
    placeholder: "Enter rent amount..."
  },
  {
    id: "leaseTerms",
    label: "Lease Terms",
    type: "text",
    required: false,
    placeholder: "Enter lease terms..."
  }
],
  offerNotarization: false,
  states: "all",
  complexity: "medium",
  estimatedTime: "10-20 minutes",
  tags: [
    "real estate",
    "medium",
    "legal",
    "template",
    "popular"
  ],
  translations: {
    en: {
      name: "Rental Agreement",
      description: "Create a legally binding Rental Agreement with our easy-to-use template. State-specific requirements included.",
      aliases: [
        "rental contract"
      ]
    },
    es: {
      name: "Acuerdo de Alquiler",
      description: "Crea un Rental Acuerdo legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
      aliases: []
    }
  }

};
