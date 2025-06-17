// Child Medical Consent Form
import { z } from 'zod';
import type { LegalDocument } from '../../types';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required").optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  date: z.string().min(1, "Date is required")
});

export const medicalConsent: LegalDocument = {
  id: 'medical-consent',
  name: 'Child Medical Consent Form',
  category: 'Personal',
  schema,
  questions: [
  {
    "id": "name",
    "label": "Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter name..."
  },
  {
    "id": "email",
    "label": "Email",
    "type": "text",
    "required": false,
    "placeholder": "Enter email..."
  },
  {
    "id": "address",
    "label": "Address",
    "type": "address",
    "required": true,
    "placeholder": "Enter address..."
  },
  {
    "id": "city",
    "label": "City",
    "type": "text",
    "required": true,
    "placeholder": "Enter city..."
  },
  {
    "id": "state",
    "label": "State",
    "type": "text",
    "required": true,
    "placeholder": "Enter state..."
  },
  {
    "id": "zipCode",
    "label": "Zip Code",
    "type": "text",
    "required": true,
    "placeholder": "Enter zip code..."
  },
  {
    "id": "date",
    "label": "Date",
    "type": "date",
    "required": true,
    "placeholder": "Enter date..."
  }
],
  offerNotarization: true,
  states: "all",
  ...
  "id": "medical-consent",
  "name": "Child Medical Consent Form",
  "category": "Personal",
  "complexity": "low",
  "estimatedTime": "5-10 minutes",
  "offerNotarization": true,
  "states": "all",
  "tags": [
    "personal",
    "low",
    "legal",
    "template",
    "notarization"
  ],
  "translations": {
    "en": {
      "name": "Child Medical Consent Form",
      "description": "Create a legally binding Child Medical Consent Form with our easy-to-use template. State-specific requirements included.",
      "aliases": []
    },
    "es": {
      "name": "Child Medical Consent Form",
      "description": "Crea un Child Medical Consent Form legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
      "aliases": []
    }
  }

};
