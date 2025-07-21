// Articles of Incorporation
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
  companyName: z.string().min(1, 'Company name is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
  taxId: z.string().optional(),
  businessType: z.enum([
    'LLC',
    'Corporation',
    'Partnership',
    'Sole Proprietorship',
  ]),
});

export const articlesOfIncorporation: LegalDocument = {
  id: 'articles-of-incorporation',
  name: 'Articles of Incorporation',
  category: 'Business',
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
      id: 'companyName',
      label: 'Company Name',
      type: 'text',
      required: true,
      placeholder: 'Enter company name...',
    },
    {
      id: 'businessAddress',
      label: 'Business Address',
      type: 'address',
      required: true,
      placeholder: 'Enter business address...',
    },
    {
      id: 'taxId',
      label: 'Tax Id',
      type: 'text',
      required: false,
      placeholder: 'Enter tax id...',
    },
    {
      id: 'businessType',
      label: 'Business Type',
      type: 'select',
      required: true,
      placeholder: 'Enter business type...',
    },
  ],
  offerNotarization: true,
  states: 'all',
  complexity: 'high',
  estimatedTime: '20-40 minutes',
  tags: ['business', 'high', 'legal', 'template', 'notarization', 'popular'],
  translations: {
    en: {
      name: 'Articles of Incorporation',
      description:
        'Create a legally binding Articles of Incorporation with our easy-to-use template. State-specific requirements included.',
      aliases: ['business document', 'commercial agreement'],
    },
    es: {
      name: 'Articles of Incorporation',
      description:
        'Crea un Articles of Incorporation legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [],
    },
  },
};
