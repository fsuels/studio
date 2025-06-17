// Employment Offer Letter
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

export const offerLetter: LegalDocument = {
  id: 'offer-letter',
  name: 'Employment Offer Letter',
  category: 'Employment',
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
  offerNotarization: false,
  states: "all",
  ...
  "id": "offer-letter",
  "name": "Employment Offer Letter",
  "category": "Employment",
  "complexity": "low",
  "estimatedTime": "5-10 minutes",
  "offerNotarization": false,
  "states": "all",
  "tags": [
    "employment",
    "low",
    "legal",
    "template"
  ],
  "translations": {
    "en": {
      "name": "Employment Offer Letter",
      "description": "Create a legally binding Employment Offer Letter with our easy-to-use template. State-specific requirements included.",
      "aliases": []
    },
    "es": {
      "name": "Empleo Offer Carta",
      "description": "Crea un Empleo Offer Carta legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
      "aliases": []
    }
  }

};
