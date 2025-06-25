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
    keywords: [
      'nda', 'non-disclosure', 'confidentiality', 'confidential', 'secret', 'secrets', 'privacy', 'private', 'information', 'data', 'proprietary', 'trade secrets', 'business secrets', 'protect information', 'confidential agreement', 'secrecy agreement', 'mutual nda', 'one-way nda', 'bilateral nda', 'unilateral nda', 'employee confidentiality', 'contractor confidentiality', 'business partnership', 'joint venture', 'merger', 'acquisition', 'due diligence', 'intellectual property', 'source code', 'customer list', 'business plan', 'financial information', 'technical data'
    ],
    keywords_es: [
      'acuerdo de confidencialidad', 'confidencialidad', 'confidencial', 'secreto', 'secretos', 'privacidad', 'privado', 'información', 'datos', 'propietario', 'secretos comerciales', 'secretos de negocio', 'proteger información', 'acuerdo confidencial', 'acuerdo de secreto', 'nda mutuo', 'nda unidireccional', 'nda bilateral', 'nda unilateral', 'confidencialidad empleado', 'confidencialidad contratista', 'sociedad comercial', 'empresa conjunta', 'fusión', 'adquisición', 'diligencia debida', 'propiedad intelectual', 'código fuente', 'lista de clientes', 'plan de negocios', 'información financiera', 'datos técnicos'
    ],
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
    keywords: [
      'partnership', 'partner', 'partners', 'business partnership', 'general partnership', 'limited partnership', 'joint venture', 'collaboration', 'business collaboration', 'co-owner', 'co-owners', 'business owner', 'business owners', 'equity split', 'profit sharing', 'loss sharing', 'capital contribution', 'management roles', 'decision making', 'voting rights', 'partnership dissolution', 'exit strategy', 'buyout', 'business agreement', 'startup partnership', 'small business partnership', 'professional partnership', 'creative partnership', 'partnership terms', 'partnership contract'
    ],
    keywords_es: [
      'sociedad', 'socio', 'socios', 'sociedad comercial', 'sociedad general', 'sociedad limitada', 'empresa conjunta', 'colaboración', 'colaboración comercial', 'copropietario', 'copropietarios', 'dueño de negocio', 'dueños de negocio', 'división de capital', 'reparto de ganancias', 'reparto de pérdidas', 'contribución de capital', 'roles de gestión', 'toma de decisiones', 'derechos de voto', 'disolución de sociedad', 'estrategia de salida', 'compra', 'acuerdo comercial', 'sociedad startup', 'sociedad pequeña empresa', 'sociedad profesional', 'sociedad creativa', 'términos de sociedad', 'contrato de sociedad'
    ],
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
    keywords: [
      'employment', 'employee', 'employer', 'job', 'work', 'hire', 'hiring', 'employment contract', 'work agreement', 'job contract', 'employee agreement', 'employment terms', 'job offer', 'new hire', 'staff', 'personnel', 'worker', 'full-time', 'part-time', 'salary', 'wage', 'hourly', 'benefits', 'vacation', 'sick leave', 'health insurance', 'job description', 'duties', 'responsibilities', 'start date', 'probation', 'termination', 'at-will employment', 'employment law', 'labor contract', 'work contract'
    ],
    keywords_es: [
      'empleo', 'empleado', 'empleador', 'trabajo', 'trabajar', 'contratar', 'contratación', 'contrato de empleo', 'acuerdo de trabajo', 'contrato laboral', 'acuerdo de empleado', 'términos de empleo', 'oferta de trabajo', 'nueva contratación', 'personal', 'trabajador', 'tiempo completo', 'tiempo parcial', 'salario', 'sueldo', 'por horas', 'beneficios', 'vacaciones', 'licencia por enfermedad', 'seguro médico', 'descripción del trabajo', 'deberes', 'responsabilidades', 'fecha de inicio', 'período de prueba', 'terminación', 'empleo a voluntad', 'ley laboral', 'contrato laboral', 'contrato de trabajo'
    ],
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
    keywords: [
      'lease', 'rental', 'rent', 'apartment', 'house', 'home', 'residential', 'tenant', 'landlord', 'property manager', 'rental agreement', 'lease agreement', 'monthly rent', 'security deposit', 'rental property', 'residential property', 'housing', 'dwelling', 'residence', 'unit', 'flat', 'condo', 'condominium', 'townhouse', 'rental contract', 'lease terms', 'rent due', 'late fees', 'utilities', 'pets allowed', 'lease renewal', 'eviction', 'move-in', 'move-out', 'inspection', 'maintenance', 'repairs'
    ],
    keywords_es: [
      'arrendamiento', 'alquiler', 'rentar', 'apartamento', 'casa', 'hogar', 'residencial', 'inquilino', 'arrendador', 'administrador de propiedad', 'acuerdo de alquiler', 'contrato de arrendamiento', 'renta mensual', 'depósito de seguridad', 'propiedad de alquiler', 'propiedad residencial', 'vivienda', 'morada', 'residencia', 'unidad', 'piso', 'condominio', 'casa adosada', 'contrato de alquiler', 'términos de arrendamiento', 'renta vencida', 'cargos por retraso', 'servicios públicos', 'mascotas permitidas', 'renovación de arrendamiento', 'desalojo', 'mudanza', 'inspección', 'mantenimiento', 'reparaciones'
    ],
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
    keywords: [
      'commercial lease', 'commercial rental', 'business lease', 'office lease', 'retail lease', 'warehouse lease', 'commercial property', 'business property', 'office space', 'retail space', 'warehouse space', 'commercial tenant', 'business tenant', 'commercial landlord', 'triple net lease', 'gross lease', 'modified gross lease', 'cam charges', 'common area maintenance', 'base rent', 'percentage rent', 'lease escalation', 'tenant improvements', 'build-out', 'commercial real estate', 'business location', 'storefront', 'plaza', 'shopping center', 'office building'
    ],
    keywords_es: [
      'arrendamiento comercial', 'alquiler comercial', 'arrendamiento de negocio', 'arrendamiento de oficina', 'arrendamiento retail', 'arrendamiento de almacén', 'propiedad comercial', 'propiedad de negocio', 'espacio de oficina', 'espacio retail', 'espacio de almacén', 'inquilino comercial', 'inquilino de negocio', 'arrendador comercial', 'arrendamiento triple neto', 'arrendamiento bruto', 'arrendamiento bruto modificado', 'cargos cam', 'mantenimiento área común', 'renta base', 'renta porcentual', 'escalación de arrendamiento', 'mejoras inquilino', 'remodelación', 'bienes raíces comerciales', 'ubicación negocio', 'local comercial', 'plaza', 'centro comercial', 'edificio oficinas'
    ],
    schema: z.object({}), // Placeholder for schema
    questions: [
      /* Placeholder questions */
    ],
  },
];
