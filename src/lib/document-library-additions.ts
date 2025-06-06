// src/lib/document-library-additions.ts
import { z } from 'zod'; // Moved to the top
import type { LegalDocument } from '@/types/documents';

// Additional documents to be added to the existing document library
export const documentLibraryAdditions: LegalDocument[] = [
  // --- Business Documents ---
  {
    id: 'nda-contract',
    name: 'Non-Disclosure Agreement',
    name_es: 'Acuerdo de Confidencialidad',
    category: 'Business',
    description:
      'Protect your confidential information with a legally binding NDA.',
    description_es:
      'Proteja su información confidencial con un NDA legalmente vinculante.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
      party1Name: z.string().min(1),
      party1Address: z.string().min(1),
      party2Name: z.string().min(1),
      party2Address: z.string().min(1),
      effectiveDate: z.string().min(1),
      purpose: z.string().min(1),
      confidentialInfoDescription: z.string().optional(),
      termYears: z.number().int().min(0).optional(),
    }),
    upsellClauses: [],
    questions: [
      {
        id: 'party1Name',
        label: 'Party 1 Full Name/Company',
        type: 'text',
        required: true,
      },
      {
        id: 'party1Address',
        label: 'Party 1 Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'party2Name',
        label: 'Party 2 Full Name/Company',
        type: 'text',
        required: true,
      },
      {
        id: 'party2Address',
        label: 'Party 2 Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'effectiveDate',
        label: 'Effective Date of Agreement',
        type: 'date',
        required: true,
      },
      {
        id: 'purpose',
        label: 'Purpose of Disclosure',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g., Discussing potential business partnership, evaluating software',
      },
      {
        id: 'confidentialInfoDescription',
        label: 'Brief Description of Confidential Information',
        type: 'textarea',
        placeholder: 'e.g., Business plans, customer lists, source code',
      },
      {
        id: 'termYears',
        label: 'Term of Agreement (Years, 0 for indefinite)',
        type: 'number',
        placeholder: 'e.g., 3',
      },
    ],
  },
  {
    id: 'partnership-agreement-add',
    name: 'Partnership Agreement',
    name_es: 'Acuerdo de Sociedad',
    category: 'Business',
    description:
      'Establish clear terms and expectations for your business partnership.',
    description_es:
      'Establezca términos y expectativas claros para su sociedad comercial.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 7,
    states: 'all',
    schema: z.object({
      partner1Name: z.string().min(1),
      partner1Address: z.string().min(1),
      partner2Name: z.string().min(1),
      partner2Address: z.string().min(1),
      businessName: z.string().min(1),
      businessAddress: z.string().min(1),
      startDate: z.string().min(1),
      capitalContributions: z.string().min(1),
      profitSplit: z.string().min(1),
      managementRoles: z.string().optional(),
      dissolutionTerms: z.string().optional(),
      state: z.string().length(2),
    }),
    questions: [
      {
        id: 'partner1Name',
        label: 'Partner 1 Full Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., John Smith',
      },
      {
        id: 'partner1Address',
        label: 'Partner 1 Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'partner2Name',
        label: 'Partner 2 Full Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Alice Brown',
      },
      {
        id: 'partner2Address',
        label: 'Partner 2 Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'businessName',
        label: 'Partnership Business Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Acme Innovations LLC',
      },
      {
        id: 'businessAddress',
        label: 'Principal Business Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'startDate',
        label: 'Partnership Start Date',
        type: 'date',
        required: true,
      },
      {
        id: 'capitalContributions',
        label: 'Initial Capital Contributions (describe)',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g., Partner 1: $10,000 cash, Partner 2: Equipment valued at $5,000',
      },
      {
        id: 'profitSplit',
        label: 'Profit/Loss Sharing Arrangement',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g., 50/50 split after expenses, or based on capital contribution',
      },
      {
        id: 'managementRoles',
        label: 'Management Roles & Responsibilities',
        type: 'textarea',
        placeholder:
          'e.g., Partner 1: Operations, Partner 2: Marketing. Major decisions require unanimous vote.',
      },
      {
        id: 'dissolutionTerms',
        label: 'Terms for Dissolution/Partner Exit',
        type: 'textarea',
        placeholder: 'e.g., Buyout options, asset distribution procedure',
      },
      {
        id: 'state',
        label: 'Governing State Law',
        type: 'select',
        required: true,
        options: [
          { value: 'CA', label: 'California' },
          { value: 'NY', label: 'New York' },
          { value: 'TX', label: 'Texas' },
          { value: 'FL', label: 'Florida' },
          { value: 'Other', label: 'Other' },
        ],
      },
    ],
  },
  {
    id: 'employment-contract-add',
    name: 'Employment Contract',
    name_es: 'Contrato de Empleo',
    category: 'Business',
    description: 'Outline the terms of employment for your new hires.',
    description_es:
      'Describa los términos de empleo para sus nuevas contrataciones.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
      employeeName: z.string().min(1),
      employerName: z.string().min(1),
      jobTitle: z.string().min(1),
      startDate: z.string().min(1),
      salary: z.string().min(1),
      duties: z.string().optional(),
    }),
    questions: [
      {
        id: 'employeeName',
        label: 'Employee Full Name',
        type: 'text',
        required: true,
      },
      {
        id: 'employerName',
        label: 'Employer/Company Name',
        type: 'text',
        required: true,
      },
      { id: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'startDate', label: 'Start Date', type: 'date', required: true },
      {
        id: 'salary',
        label: 'Salary/Wage',
        type: 'text',
        required: true,
        placeholder: 'e.g., $60,000 per year or $25 per hour',
      },
      { id: 'duties', label: 'Key Responsibilities/Duties', type: 'textarea' },
    ],
  },
  // --- Real Estate Documents ---
  {
    id: 'residential-lease-agreement-add',
    name: 'Residential Lease Agreement',
    name_es: 'Contrato de Arrendamiento Residencial',
    category: 'Real Estate',
    description: 'Create a lease agreement for renting a residential property.',
    description_es:
      'Cree un contrato de arrendamiento para alquilar una propiedad residencial.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: true,
    offerNotarization: false,
    offerRecordingHelp: true,
    basePrice: 5,
    states: 'all',
    schema: z
      .object({
        landlord_name: z.string().min(1),
        tenant_name: z.string().min(1),
        property_address: z.string().min(1),
        lease_start: z.string().min(1),
        lease_term: z.number().int().positive(),
        monthly_rent: z.number().positive(),
        rent_due_date: z.string().min(1),
        security_deposit: z.number().min(0).optional(),
        pets_allowed: z.enum(['yes', 'no', 'specific']),
        pet_conditions: z.string().optional(),
        late_fee_policy: z.string().optional(),
        state: z.string().length(2),
      })
      .refine(
        (data) =>
          data.pets_allowed === 'specific' ? !!data.pet_conditions : true,
        {
          message:
            'Pet conditions are required if pets are allowed with specific conditions',
          path: ['pet_conditions'],
        },
      ),
    questions: [
      {
        id: 'landlord_name',
        label: "Landlord's Full Name or Company",
        required: true,
        type: 'text',
        placeholder: 'e.g., Acme Property Management',
      },
      {
        id: 'tenant_name',
        label: "Tenant's Full Name",
        required: true,
        type: 'text',
        placeholder: 'e.g., Jane Doe',
      },
      {
        id: 'property_address',
        label: 'Full Property Address (incl. unit #)',
        required: true,
        type: 'textarea',
        placeholder: 'e.g., 123 Main St, Unit 4B, Anytown, USA 12345',
      },
      {
        id: 'lease_start',
        label: 'Lease Start Date',
        required: true,
        type: 'date',
      },
      {
        id: 'lease_term',
        label: 'Lease Term (Months)',
        required: true,
        type: 'number',
        placeholder: 'e.g., 12',
      },
      {
        id: 'monthly_rent',
        label: 'Monthly Rent Amount ($)',
        required: true,
        type: 'number',
        placeholder: 'e.g., 1500',
      },
      {
        id: 'rent_due_date',
        label: 'Rent Due Date (e.g., 1st of month)',
        required: true,
        type: 'text',
        placeholder: 'e.g., 1st',
      },
      {
        id: 'security_deposit',
        label: 'Security Deposit Amount ($)',
        type: 'number',
        placeholder: 'e.g., 1500',
      },
      {
        id: 'pets_allowed',
        label: 'Are Pets Allowed?',
        type: 'select',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'specific', label: 'Yes, with conditions' },
        ],
      },
      {
        id: 'pet_conditions',
        label: 'Pet Conditions (if allowed)',
        type: 'textarea',
        placeholder:
          'e.g., One cat under 15 lbs allowed with $200 pet deposit.',
        required: false,
      },
      {
        id: 'late_fee_policy',
        label: 'Late Fee Policy (Optional)',
        type: 'textarea',
        placeholder: 'e.g., $50 fee if rent is more than 5 days late.',
        required: false,
      },
      {
        id: 'state',
        label: 'State Governing Lease',
        type: 'select',
        required: true,
        options: [
          { value: 'CA', label: 'California' },
          { value: 'NY', label: 'New York' },
          { value: 'TX', label: 'Texas' },
          { value: 'FL', label: 'Florida' },
          { value: 'Other', label: 'Other' },
        ],
      },
    ],
    upsellClauses: [],
  },
  {
    id: 'commercial-lease-agreement-add',
    name: 'Commercial Lease Agreement',
    name_es: 'Contrato de Arrendamiento Comercial',
    category: 'Real Estate',
    description: 'Create a lease agreement for renting a commercial property.',
    description_es:
      'Cree un contrato de arrendamiento para alquilar una propiedad comercial.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: true,
    offerNotarization: false,
    offerRecordingHelp: true,
    basePrice: 7,
    states: 'all',
    schema: z.object({}), // Placeholder for schema
    questions: [
      /* Placeholder questions */
    ],
  },
  {
    id: 'purchase-agreement-real-estate-add',
    name: 'Real Estate Purchase Agreement',
    name_es: 'Contrato de Compraventa de Bienes Raíces',
    category: 'Real Estate',
    description: 'Formalize the purchase of a real estate property.',
    description_es: 'Formalice la compra de una propiedad inmobiliaria.',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: true,
    offerNotarization: true,
    offerRecordingHelp: true,
    basePrice: 7,
    states: 'all',
    schema: z.object({}), // Placeholder for schema
    questions: [
      /* Placeholder questions */
    ],
  },
];
