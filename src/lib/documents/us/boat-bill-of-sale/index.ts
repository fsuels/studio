// Boat Bill of Sale
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required").optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  date: z.string().min(1, "Date is required")
});

export const boatBillOfSale: LegalDocument = {
  id: 'boat-bill-of-sale',
  name: 'Boat Bill of Sale',
  category: 'Transportation',
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
  complexity: "medium",
  estimatedTime: "10-20 minutes",
  tags: [
    "transportation",
    "medium",
    "legal",
    "template",
    "notarization"
  ],
  translations: {
    en: {
      name: "Boat Bill of Sale",
      description: "Create a legally binding Boat Bill of Sale with our easy-to-use template. State-specific requirements included.",
      aliases: []
    },
    es: {
      name: "Boat Contrato de Compraventa",
      description: "Crea un Boat Contrato de Compraventa legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
      aliases: []
    }
  }

};
