// Property Deed
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required').optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code required'),
  date: z.string().min(1, 'Date is required'),
  propertyAddress: z.string().min(1, 'Property address required'),
  rentAmount: z.number().min(0, 'Rent amount must be positive').optional(),
  leaseTerms: z.string().min(1, 'Lease terms required').optional(),
});

export const propertyDeed: LegalDocument = {
  id: 'property-deed',
  name: 'Property Deed',
  category: 'Real Estate',
  schema,
  questions: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name...',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      required: false,
      placeholder: 'Enter email...',
    },
    {
      id: 'address',
      label: 'Address',
      type: 'address',
      required: true,
      placeholder: 'Enter address...',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      required: true,
      placeholder: 'Enter city...',
    },
    {
      id: 'state',
      label: 'State',
      type: 'text',
      required: true,
      placeholder: 'Enter state...',
    },
    {
      id: 'zipCode',
      label: 'Zip Code',
      type: 'text',
      required: true,
      placeholder: 'Enter zip code...',
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      placeholder: 'Enter date...',
    },
    {
      id: 'propertyAddress',
      label: 'Property Address',
      type: 'address',
      required: true,
      placeholder: 'Enter property address...',
    },
    {
      id: 'rentAmount',
      label: 'Rent Amount',
      type: 'number',
      required: false,
      placeholder: 'Enter rent amount...',
    },
    {
      id: 'leaseTerms',
      label: 'Lease Terms',
      type: 'text',
      required: false,
      placeholder: 'Enter lease terms...',
    },
  ],
  offerNotarization: true,
  states: 'all',
  complexity: 'high',
  estimatedTime: '20-40 minutes',
  tags: ['real estate', 'high', 'legal', 'template', 'notarization'],
  translations: {
    en: {
      name: 'Property Deed',
      description:
        'Create a legally binding Property Deed with our easy-to-use template. State-specific requirements included.',
      aliases: [],
    },
    es: {
      name: 'Escritura de Propiedad',
      description:
        'Crea un Property Deed legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [],
    },
  },
};
