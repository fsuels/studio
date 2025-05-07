// src/lib/document-library.ts
import { z } from 'zod'; 
import { documentLibraryAdditions } from './document-library-additions';

// Define the structure for a single question
export type Question = {
  id: string; 
  label: string; 
  placeholder?: string; 
  required?: boolean; 
  type: 'text' | 'select' | 'date' | 'number' | 'textarea'; 
  options?: { value: string; label: string }[]; 
  stateSpecific?: string[]; 
  helperText?: string;
  tooltip?: string;
};

// Define structure for upsell clauses
export type UpsellClause = {
    id: string;
    description: string;
    description_es?: string; 
    price: number; 
};

// Define the structure for a single legal document
export type LegalDocument = {
  id: string; 
  name: string; 
  name_es?: string; 
  aliases?: string[]; 
  aliases_es?: string[]; 
  category: string; 
  states?: string[] | 'all'; 
  questions?: Question[]; 
  schema: z.AnyZodObject; 
  description: string; 
  description_es?: string; 
  requiresNotarization: boolean; 
  canBeRecorded: boolean; 
  offerNotarization: boolean; 
  offerRecordingHelp: boolean; 
  basePrice: number; 
  languageSupport: string[]; 
  upsellClauses?: UpsellClause[]; 
  templatePath?: string; 
  templatePath_es?: string; 
  requiresNotarizationStates?: string[]; 
};

// US States Data (with value/label for select components)
export const usStates = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' }
];

// The main library of legal documents
export let documentLibrary: LegalDocument[] = [ 
  // --- Category 1: Finance ---
  {
    id: 'promissory-note',
    name: 'Promissory Note',
    name_es: 'Pagaré',
    category: 'Finance', 
    description: 'Formalize a promise to repay a loan.',
    description_es: 'Formalizar una promesa de pago de un préstamo.',
    aliases: ["iou", "loan paper", "promise to pay"],
    aliases_es: ["pagaré", "documento de préstamo", "promesa de pago"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        lenderName: z.string().min(1, "Lender name is required"),
        borrowerName: z.string().min(1, "Borrower name is required"),
        principalAmount: z.number().positive("Principal amount must be positive"),
        interestRate: z.number().min(0).optional(),
        repaymentTerms: z.string().min(1, "Repayment terms are required"),
    }),
    questions: [ 
        { id: 'lenderName', label: 'Lender Name', type: 'text', required: true },
        { id: 'borrowerName', label: 'Borrower Name', type: 'text', required: true },
        { id: 'principalAmount', label: 'Loan Amount ($)', type: 'number', required: true },
        { id: 'interestRate', label: 'Interest Rate (%)', type: 'number' },
        { id: 'repaymentTerms', label: 'Repayment Terms', type: 'textarea', required: true },
    ],
    upsellClauses: [
        { id: 'securedClause', description: 'Add collateral details (secured note)', description_es: 'Añadir detalles de garantía (pagaré garantizado)', price: 2 }
    ]
  },
  {
    id: "bill-of-sale-vehicle",
    name: "Vehicle Bill of Sale",
    name_es: "Contrato de Compraventa de Vehículo",
    category: "Finance",
    description: "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
    description_es: "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
    aliases: ["sell car", "used item sale", "vehicle transfer", "car sale contract"],
    aliases_es: ["venta de coche", "venta de artículo usado", "transferencia de vehículo", "contrato de venta de auto"],
    languageSupport: ["en", "es"],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 19.95, 
    states: 'all',
    templatePath: "/templates/en/bill-of-sale-vehicle.md", 
    templatePath_es: "/templates/es/bill-of-sale-vehicle.md",
    requiresNotarizationStates: ["AZ", "KY", "LA", "MT", "NV", "OH", "OK", "PA", "WV", "WY"], 
    schema: z.object({
        sale_date: z.string().min(1, "Sale date is required"),
        seller_name: z.string().min(1, "Seller name is required"),
        seller_address: z.string().min(1, "Seller address is required"),
        buyer_name: z.string().min(1, "Buyer name is required"),
        buyer_address: z.string().min(1, "Buyer address is required"),
        vehicle_year: z.coerce.number().int().min(1900, "Invalid vehicle year").max(new Date().getFullYear() + 1, "Invalid vehicle year"),
        vehicle_make: z.string().min(1, "Vehicle make is required"),
        vehicle_model: z.string().min(1, "Vehicle model is required"),
        vehicle_color: z.string().min(1, "Vehicle color is required"),
        vehicle_vin: z.string().length(17, "VIN must be 17 characters"),
        vehicle_odometer: z.coerce.number().int().min(0, "Odometer reading must be positive"),
        sale_price: z.coerce.number().positive("Sale price must be positive"),
        payment_method: z.string().min(1, "Payment method is required"),
        existing_liens: z.string().min(1, "Existing liens information is required (enter 'None' if applicable)"),
        as_is: z.enum(['yes', 'no']),
        warranty_details: z.string().optional(),
        state: z.string().length(2, "State must be 2 characters"),
        county: z.string().optional(),
    }).refine(data => data.as_is === 'no' ? !!data.warranty_details && data.warranty_details.trim() !== '' : true, {
        message: "Warranty details are required if not sold 'as-is'",
        path: ['warranty_details'],
    }),
    questions: [
        { id: 'sale_date', label: 'Date of Sale', type: 'date', required: true },
        { id: 'seller_name', label: 'Seller\'s Full Name', type: 'text', required: true },
        { id: 'seller_address', label: 'Seller\'s Full Address', type: 'textarea', required: true },
        { id: 'buyer_name', label: 'Buyer\'s Full Name', type: 'text', required: true },
        { id: 'buyer_address', label: 'Buyer\'s Full Address', type: 'textarea', required: true },
        { id: 'vehicle_year', label: 'Vehicle Year', type: 'number', placeholder: 'e.g., 2020', required: true },
        { id: 'vehicle_make', label: 'Vehicle Make', type: 'text', placeholder: 'e.g., Toyota', required: true },
        { id: 'vehicle_model', label: 'Vehicle Model', type: 'text', placeholder: 'e.g., Camry', required: true },
        { id: 'vehicle_color', label: 'Vehicle Color', type: 'text', placeholder: 'e.g., Blue', required: true },
        { id: 'vehicle_vin', label: 'Vehicle Identification Number (VIN)', type: 'text', required: true },
        { id: 'vehicle_odometer', label: 'Odometer Reading (miles)', type: 'number', required: true },
        { id: 'sale_price', label: 'Sale Price ($)', type: 'number', required: true },
        { id: 'payment_method', label: 'Payment Method', type: 'text', placeholder: 'e.g., Cash, Certified Check', required: true },
        { id: 'existing_liens', label: 'Existing Liens (if any, otherwise "None")', type: 'text', placeholder: 'e.g., None, or Loan with XYZ Bank', required: true },
        { id: 'as_is', label: 'Is the vehicle sold "as-is"?', type: 'select', options: [{value: 'yes', label: 'Yes, as-is'}, {value: 'no', label: 'No, with warranties'}], required: true },
        { id: 'warranty_details', label: 'Warranty Details (if not "as-is")', type: 'textarea', placeholder: 'e.g., 30-day warranty on drivetrain (if applicable)'},
        { id: 'state', label: 'State of Sale (Governing Law & Notary)', type: 'select', required: true, options: usStates.map(s => ({value: s.value, label: s.label})) },
        { id: 'county', label: 'County (for Notary Acknowledgment)', type: 'text', required: false }
    ],
     upsellClauses: [
      { id: 'includeNotaryLanguage', description: 'Include formal Notary Acknowledgment block', description_es: 'Incluir bloque formal de Reconocimiento Notarial', price: 2.00 }
    ]
  },
  {
    id: 'invoice',
    name: 'Invoice',
    name_es: 'Factura',
    category: 'Finance',
    description: 'Request payment for goods or services rendered.',
    description_es: 'Solicitar pago por bienes o servicios prestados.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 3,
    states: 'all',
    schema: z.object({
        recipientName: z.string().min(1),
        recipientAddress: z.string().optional(),
        yourName: z.string().min(1),
        invoiceNumber: z.string().min(1),
        invoiceDate: z.string().min(1), 
        dueDate: z.string().optional(), 
        lineItems: z.string().min(1),
        totalAmount: z.number().positive(),
    }),
    questions: [
      { id: 'recipientName', label: 'Recipient Name/Company', type: 'text', required: true },
      { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea' },
      { id: 'yourName', label: 'Your Name/Company', type: 'text', required: true },
      { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },
      { id: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
      { id: 'dueDate', label: 'Payment Due Date', type: 'date' },
      { id: 'lineItems', label: 'Items/Services (Description & Amount)', type: 'textarea', required: true, placeholder: 'Item 1 - $100\nService B - $250' },
      { id: 'totalAmount', label: 'Total Amount Due ($)', type: 'number', required: true },
    ]
  },
  {
    id: 'demand-letter-payment',
    name: 'Demand Letter (Payment)',
    name_es: 'Carta de Reclamación (Pago)',
    category: 'Finance',
    description: 'Formally request payment that is overdue.',
    description_es: 'Solicitar formalmente un pago atrasado.',
    aliases: ["request payment", "owe money", "legal demand"],
    aliases_es: ["solicitar pago", "deber dinero", "demanda legal"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        senderName: z.string().min(1),
        senderAddress: z.string().min(1),
        recipientName: z.string().min(1),
        recipientAddress: z.string().min(1),
        amountDue: z.number().positive(),
        originalDueDate: z.string().optional(), 
        reasonForDebt: z.string().min(1),
        deadlineForPayment: z.string().min(1), 
        consequences: z.string().optional(),
    }),
    questions: [
      { id: 'senderName', label: 'Your Name/Company (Sender)', type: 'text', required: true },
      { id: 'senderAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'recipientName', label: 'Recipient Name/Company', type: 'text', required: true },
      { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
      { id: 'amountDue', label: 'Amount Due ($)', type: 'number', required: true },
      { id: 'originalDueDate', label: 'Original Due Date', type: 'date' },
      { id: 'reasonForDebt', label: 'Reason for Debt (e.g., Unpaid invoice #123)', type: 'text', required: true },
      { id: 'deadlineForPayment', label: 'New Deadline for Payment', type: 'date', required: true },
      { id: 'consequences', label: 'Consequences of Non-Payment', type: 'textarea', placeholder: 'e.g., Legal action will be pursued' },
    ]
  },
  // --- Category 2: Business ---
   {
    id: 'independent-contractcontractor-agreement', 
    name: 'Independent Contractor Agreement',
    name_es: 'Contrato de Contratista Independiente',
    category: 'Business', 
    description: 'Define terms for hiring a freelancer or independent contractor.',
    description_es: 'Definir términos para contratar a un freelancer o contratista independiente.',
    aliases: ["freelance", "contractor", "gig work", "1099 job"],
    aliases_es: ["freelance", "contratista", "trabajo gig", "trabajo 1099"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        clientName: z.string().min(1),
        contractorName: z.string().min(1),
        serviceDescription: z.string().min(1),
        paymentTerms: z.string().min(1),
        startDate: z.string().min(1), 
        endDate: z.string().optional(), 
    }),
    questions: [
        { id: 'clientName', label: 'Client/Company Name', type: 'text', required: true },
        { id: 'contractorName', label: 'Contractor Name', type: 'text', required: true },
        { id: 'serviceDescription', label: 'Description of Services', type: 'textarea', required: true },
        { id: 'paymentTerms', label: 'Payment Rate and Schedule', type: 'textarea', required: true },
        { id: 'startDate', label: 'Start Date', type: 'date', required: true },
        { id: 'endDate', label: 'End Date (Optional)', type: 'date' },
    ]
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    name_es: 'Acuerdo de Servicios',
    category: 'Business',
    description: 'Outline terms for providing or receiving ongoing services.',
    description_es: 'Esbozar términos para proporcionar o recibir servicios continuos.',
    aliases: ["hire services", "service provider", "payment terms"],
    aliases_es: ["contratar servicios", "proveedor de servicios", "términos de pago"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        clientName: z.string().min(1),
        clientAddress: z.string().min(1),
        providerName: z.string().min(1),
        providerAddress: z.string().min(1),
        serviceDescription: z.string().min(1),
        startDate: z.string().min(1), 
        endDate: z.string().optional(), 
        paymentTerms: z.string().min(1),
        confidentialityClause: z.enum(['yes', 'no']),
        state: z.string().length(2),
    }),
     questions: [
        { id: 'clientName', label: 'Client Full Name/Company', type: 'text', required: true },
        { id: 'clientAddress', label: 'Client Address', type: 'textarea', required: true },
        { id: 'providerName', label: 'Service Provider Full Name/Company', type: 'text', required: true },
        { id: 'providerAddress', label: 'Service Provider Address', type: 'textarea', required: true },
        { id: 'serviceDescription', label: 'Description of Services to be Provided', type: 'textarea', required: true, placeholder: 'e.g., Web design, marketing consulting, writing services' },
        { id: 'startDate', label: 'Service Start Date', type: 'date', required: true },
        { id: 'endDate', label: 'Service End Date (Optional, for fixed term)', type: 'date' },
        { id: 'paymentTerms', label: 'Payment Amount and Terms', type: 'textarea', required: true, placeholder: 'e.g., $50/hour billed monthly, $1000 fixed fee upon completion' },
        { id: 'confidentialityClause', label: 'Include Confidentiality Clause?', type: 'select', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}], required: true },
        { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ]
  },
   {
    id: "nda",
    name: "Non-Disclosure Agreement (NDA)",
    name_es: "Acuerdo de Confidencialidad (NDA)",
    category: "Business",
    description: "Protect confidential information shared between parties.",
    description_es: "Proteger información confidencial compartida entre partes.",
    aliases: ["confidential", "nda", "protect idea", "secret"],
    aliases_es: ["confidencial", "nda", "proteger idea", "secreto"],
    languageSupport: ["en", "es"],
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
    questions: [
       { id: "party1Name", label: "Party 1 Full Name/Company", type: "text", required: true },
       { id: "party1Address", label: "Party 1 Address", type: "textarea", required: true },
       { id: "party2Name", label: "Party 2 Full Name/Company", type: "text", required: true },
       { id: "party2Address", label: "Party 2 Address", type: "textarea", required: true },
       { id: "effectiveDate", label: "Effective Date of Agreement", type: "date", required: true },
       { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "e.g., Discussing potential business partnership, evaluating software" },
       { id: "confidentialInfoDescription", label: "Brief Description of Confidential Information", type: "textarea", placeholder: "e.g., Business plans, customer lists, source code" },
       { id: "termYears", label: "Term of Agreement (Years, 0 for indefinite)", type: "number", placeholder: "e.g., 3" },
    ],
    upsellClauses: [
      { id: "extendedTerm", description: "Extend NDA duration beyond 1 year", description_es: "Extender la duración del NDA más allá de 1 año", price: 1 },
      { id: "mutualProtection", description: "Make NDA mutual instead of one-sided", description_es: "Hacer que el NDA sea mutuo en lugar de unilateral", price: 2 }
    ]
  },
  {
    id: 'non-compete-agreement',
    name: 'Non-Compete Agreement',
    name_es: 'Acuerdo de No Competencia',
    category: 'Business',
    description: 'Restrict an employee or contractor from competing after termination.',
    description_es: 'Restringir a un empleado o contratista de competir después de la terminación.',
    aliases: ["restrict competition", "former employee", "noncompete"],
    aliases_es: ["restringir competencia", "ex empleado", "no competencia"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        companyName: z.string().min(1),
        employeeName: z.string().min(1),
        restrictedActivities: z.string().min(1),
        geographicScope: z.string().optional(),
        durationMonths: z.number().int().positive(),
    }),
    questions: [
        { id: 'companyName', label: 'Company Name', type: 'text', required: true },
        { id: 'employeeName', label: 'Employee/Contractor Name', type: 'text', required: true },
        { id: 'restrictedActivities', label: 'Description of Restricted Activities', type: 'textarea', required: true },
        { id: 'geographicScope', label: 'Geographic Scope of Restriction', type: 'text', placeholder: 'e.g., 50 miles radius from main office, State of California' },
        { id: 'durationMonths', label: 'Duration of Restriction (Months after termination)', type: 'number', required: true },
    ]
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    name_es: 'Acuerdo de Sociedad',
    category: 'Business',
    description: 'Define the terms, responsibilities, and profit sharing for business partners.',
    description_es: 'Definir los términos, responsabilidades y reparto de beneficios para socios comerciales.',
    aliases: ["business partners", "joint venture", "partner terms"],
    aliases_es: ["socios de negocios", "empresa conjunta", "términos de socios"],
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
         { id: "partner1Name", label: "Partner 1 Full Name", type: "text", required: true, placeholder: "e.g., John Smith" },
         { id: "partner1Address", label: "Partner 1 Address", type: "textarea", required: true },
         { id: "partner2Name", label: "Partner 2 Full Name", type: "text", required: true, placeholder: "e.g., Alice Brown" },
         { id: "partner2Address", label: "Partner 2 Address", type: "textarea", required: true },
         { id: "businessName", label: "Partnership Business Name", type: "text", required: true, placeholder: "e.g., Acme Innovations LLC" },
         { id: "businessAddress", label: "Principal Business Address", type: "textarea", required: true },
         { id: "startDate", label: "Partnership Start Date", type: "date", required: true },
         { id: "capitalContributions", label: "Initial Capital Contributions (describe)", type: "textarea", required: true, placeholder: "e.g., Partner 1: $10,000 cash, Partner 2: Equipment valued at $5,000" },
         { id: "profitSplit", label: "Profit/Loss Sharing Arrangement", type: "textarea", required: true, placeholder: "e.g., 50/50 split after expenses, or based on capital contribution" },
         { id: "managementRoles", label: "Management Roles & Responsibilities", type: "textarea", placeholder: "e.g., Partner 1: Operations, Partner 2: Marketing. Major decisions require unanimous vote." },
         { id: "dissolutionTerms", label: "Terms for Dissolution/Partner Exit", type: "textarea", placeholder: "e.g., Buyout options, asset distribution procedure" },
         { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ],
  },
  {
    id: 'operating-agreement', 
    name: 'Operating Agreement (LLC)',
    name_es: 'Acuerdo Operativo (LLC)',
    category: 'Business',
    description: 'Outline the ownership structure and operating procedures for an LLC.',
    description_es: 'Esbozar la estructura de propiedad y los procedimientos operativos para una LLC.',
    aliases: ["LLC agreement", "limited liability company"],
    aliases_es: ["acuerdo de LLC", "sociedad de responsabilidad limitada"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 7,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
   {
    id: 'articles-of-incorporation-biz', 
    name: 'Articles of Incorporation',
    name_es: 'Acta Constitutiva',
    category: 'Business',
    description: 'Formal document filed with the state to create a corporation.',
    description_es: 'Documento formal presentado al estado para crear una corporación.',
    aliases: ["form corporation", "incorporate business"],
    aliases_es: ["formar corporación", "incorporar negocio"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: true,
    offerNotarization: false,
    offerRecordingHelp: true,
    basePrice: 5,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  {
    id: 'employment-offer-letter',
    name: 'Employment Offer Letter',
    name_es: 'Carta de Oferta de Empleo',
    category: 'Business', 
    description: 'Formalize a job offer with key terms like salary, start date, and position.',
    description_es: 'Formalizar una oferta de trabajo con términos clave como salario, fecha de inicio y puesto.',
    aliases: ["hire employee", "job offer", "terms of employment"],
    aliases_es: ["contratar empleado", "oferta de trabajo", "términos de empleo"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  {
    id: 'employment-termination-letter',
    name: 'Employment Termination Letter',
    name_es: 'Carta de Terminación de Empleo',
    category: 'Business', 
    description: 'Formally notify an employee of their termination.',
    description_es: 'Notificar formalmente a un empleado de su despido.',
    aliases: ["fire employee", "layoff letter", "termination notice"],
    aliases_es: ["despedir empleado", "carta de despido", "aviso de terminación"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    templatePath: "/templates/en/termination-letter.md",
    templatePath_es: "/templates/es/termination-letter.md",
    schema: z.object({
        employerName: z.string().min(1),
        employerAddress: z.string().min(1),
        employeeName: z.string().min(1),
        employeePosition: z.string().optional(),
        terminationDate: z.string().min(1), 
        terminationReason: z.string().optional(),
        finalPaycheckDate: z.string().min(1), 
        supervisorName: z.string().min(1),
        supervisorTitle: z.string().min(1),
    }),
    questions: [
        { id: 'employerName',  label: 'Employer / Company Name', type: 'text', required: true },
        { id: 'employerAddress', label: 'Employer Address', type: 'textarea', required: true },
        { id: 'employeeName',  label: 'Employee Full Name', type: 'text',     required: true },
        { id: 'employeePosition', label: 'Position / Job Title', type: 'text' },
        { id: 'terminationDate', label: 'Termination Effective Date', type: 'date', required: true },
        { id: 'terminationReason', label: 'Reason for Termination (brief)',type: 'textarea', placeholder: 'e.g. position eliminated, misconduct, performance' },
        { id: 'finalPaycheckDate', label: 'Final Paycheck Date', type: 'date', required: true},
        { id: 'supervisorName', label: 'Supervisor Name', type: 'text', required: true },
        { id: 'supervisorTitle', label: 'Supervisor Title', type: 'text', required: true },
    ]
  },
  // --- Category 3: Real Estate ---
   {
    id: "leaseAgreement",
    name: "Residential Lease Agreement",
    name_es: "Contrato de Arrendamiento Residencial",
    category: "Real Estate",
    description: "Set terms for renting a residential property.",
    description_es: "Establecer términos para alquilar una propiedad residencial.",
    aliases: ["rent apartment", "tenant", "lease form", "landlord agreement"],
    aliases_es: ["alquiler de apartamento", "inquilino", "formulario de arrendamiento", "acuerdo de propietario"],
    languageSupport: ["en", "es"],
    requiresNotarization: false,
    canBeRecorded: true,
    offerNotarization: false,
    offerRecordingHelp: true,
    basePrice: 5,
    states: 'all',
    schema: z.object({
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
    }).refine(data => data.pets_allowed === 'specific' ? !!data.pet_conditions : true, {
        message: "Pet conditions are required if pets are allowed with specific conditions",
        path: ['pet_conditions'],
    }),
    questions: [
        { id: 'landlord_name', label: 'Landlord\'s Full Name or Company', required: true, type: 'text', placeholder: "e.g., Acme Property Management" },
        { id: 'tenant_name', label: 'Tenant\'s Full Name', required: true, type: 'text', placeholder: "e.g., Jane Doe" },
        { id: 'property_address', label: 'Full Property Address (incl. unit #)', required: true, type: 'textarea', placeholder: "e.g., 123 Main St, Unit 4B, Anytown, USA 12345" },
        { id: 'lease_start', label: 'Lease Start Date', required: true, type: 'date' },
        { id: 'lease_term', label: 'Lease Term (Months)', required: true, type: 'number', placeholder: 'e.g., 12' },
        { id: 'monthly_rent', label: 'Monthly Rent Amount ($)', required: true, type: 'number', placeholder: "e.g., 1500" },
        { id: 'rent_due_date', label: 'Rent Due Date (e.g., 1st of month)', required: true, type: 'text', placeholder: "e.g., 1st" },
        { id: 'security_deposit', label: 'Security Deposit Amount ($)', type: 'number', placeholder: "e.g., 1500" },
        { id: 'pets_allowed', label: 'Are Pets Allowed?', type: 'select', required: true, options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}, {value: 'specific', label: 'Yes, with conditions'}] },
        { id: 'pet_conditions', label: 'Pet Conditions (if allowed)', type: 'textarea', placeholder: 'e.g., One cat under 15 lbs allowed with $200 pet deposit.', required: false },
        { id: 'late_fee_policy', label: 'Late Fee Policy (Optional)', type: 'textarea', placeholder: 'e.g., $50 fee if rent is more than 5 days late.', required: false },
        { id: 'state', label: 'State Governing Lease', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ],
    upsellClauses: [
        { id: "lateFeeClause", description: "Add detailed late rent fee clause", description_es: "Añadir cláusula detallada de cargo por pago tardío", price: 1 },
        { id: "petPolicy", description: "Include a specific pet policy addendum", description_es: "Incluir un anexo específico de política de mascotas", price: 1 }
    ]
  },
  {
    id: 'commercial-lease-agreement',
    name: 'Commercial Lease Agreement',
    name_es: 'Contrato de Arrendamiento Comercial',
    category: 'Real Estate',
    description: 'Lease agreement specifically for commercial properties.',
    description_es: 'Contrato de arrendamiento específico para propiedades comerciales.',
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: true,
    offerNotarization: false,
    offerRecordingHelp: true,
    basePrice: 7,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
   {
    id: 'eviction-notice',
    name: 'Eviction Notice',
    name_es: 'Aviso de Desalojo',
    category: 'Real Estate',
    description: 'Formal notice to a tenant to vacate the property.',
    description_es: 'Notificación formal a un inquilino para desalojar la propiedad.',
    aliases: ["remove tenant", "late rent", "kick out", "notice to quit"],
    aliases_es: ["desalojar inquilino", "renta atrasada", "echar", "notificación de desalojo"],
    languageSupport: ['en', 'es'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        landlordName: z.string().min(1),
        tenantName: z.string().min(1),
        propertyAddress: z.string().min(1),
        reasonForEviction: z.enum(['nonpayment', 'leaseViolation', 'endOfTerm', 'other']),
        reasonDetails: z.string().optional(),
        noticeDate: z.string().min(1), 
        vacateDate: z.string().min(1), 
        state: z.string().length(2),
    }).refine(data => data.reasonForEviction === 'leaseViolation' || data.reasonForEviction === 'other' ? !!data.reasonDetails : true, {
        message: "Details are required if reason is 'Lease Violation' or 'Other'",
        path: ['reasonDetails'],
    }),
    questions: [
      { id: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
      { id: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
      { id: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
      { id: 'reasonForEviction', label: 'Reason for Eviction', type: 'select', required: true, options: [{value: 'nonpayment', label: 'Non-payment of Rent'}, {value: 'leaseViolation', label: 'Lease Violation'}, {value: 'endOfTerm', label: 'End of Lease Term'}, {value: 'other', label: 'Other (Specify)'}] },
      { id: 'reasonDetails', label: 'Details of Reason (if violation or other)', type: 'textarea' },
      { id: 'noticeDate', label: 'Date Notice Given', type: 'date', required: true },
      { id: 'vacateDate', label: 'Date Tenant Must Vacate By', type: 'date', required: true },
      { id: 'state', label: 'State Governing Lease', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ]
  },
  {
    id: 'quitclaim-deed',
    name: 'Quitclaim Deed',
    name_es: 'Escritura de Finiquito',
    category: 'Real Estate',
    description: 'Transfer property interest without warranty of title.',
    description_es: 'Transferir interés en una propiedad sin garantía de título.',
    aliases: ["property transfer", "quit claim deed", "transfer ownership"],
    aliases_es: ["transferencia de propiedad", "escritura de finiquito", "transferir titularidad"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: true,
    offerNotarization: true,
    offerRecordingHelp: true,
    basePrice: 5,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  // --- Category 4: Family ---
   {
     id: "divorce-settlement-agreement",
     name: "Divorce Settlement Agreement",
     name_es: "Acuerdo de Divorcio",
     category: "Family",
     description: "Formalizes the terms of a divorce, including property division, support, and custody.",
     description_es: "Formaliza los términos de un divorcio, incluyendo división de bienes, manutención y custodia.",
     aliases: ["divorce", "separation", "end marriage", "get divorced", "marital settlement"],
     aliases_es: ["divorcio", "separación", "terminar matrimonio", "divorciarse", "acuerdo matrimonial"],
     languageSupport: ["en", "es"],
     requiresNotarization: true,
     canBeRecorded: true,
     offerNotarization: true,
     offerRecordingHelp: true,
     basePrice: 7,
     states: "all",
     schema: z.object({
        spouse1Name: z.string().min(1),
        spouse2Name: z.string().min(1),
        dateOfMarriage: z.string().min(1), 
        dateOfSeparation: z.string().min(1), 
        hasChildren: z.enum(['yes', 'no']),
        propertyDivision: z.string().min(1),
        spousalSupport: z.string().optional(),
        state: z.string().length(2),
     }),
     questions: [
         { id: "spouse1Name", label: "Spouse 1 Full Name", type: "text", required: true },
         { id: "spouse2Name", label: "Spouse 2 Full Name", type: "text", required: true },
         { id: "dateOfMarriage", label: "Date of Marriage", type: "date", required: true },
         { id: "dateOfSeparation", label: "Date of Separation", type: "date", required: true },
         { id: 'hasChildren', label: 'Are there minor children involved?', type: 'select', options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}], required: true},
         { id: 'propertyDivision', label: 'Describe Division of Assets & Debts', type: 'textarea', required: true, placeholder: 'e.g., House to Spouse 1, Car to Spouse 2, Split savings...' },
         { id: 'spousalSupport', label: 'Spousal Support (Alimony) Details', type: 'textarea', placeholder: 'e.g., Spouse 1 pays $500/month for 36 months, or waived' },
         { id: 'state', label: 'State Governing Divorce', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
     ],
     upsellClauses: [
         { id: "spousalSupportWaiver", description: "Include waiver of spousal support", description_es: "Incluir renuncia a la manutención conyugal", price: 2 },
         { id: "retirementSplit", description: "Specify division of retirement accounts", description_es: "Especificar división de cuentas de jubilación", price: 2 },
     ]
   },
  {
    id: 'child-custody-agreement',
    name: 'Child Custody Agreement',
    name_es: 'Acuerdo de Custodia de Menores',
    category: 'Family',
    description: 'Outline legal/physical custody, visitation schedule for children.',
    description_es: 'Esbozar la custodia legal/física, horario de visitas para los hijos.',
    aliases: ["child custody", "custody battle", "parenting plan"],
    aliases_es: ["custodia de hijos", "batalla por custodia", "plan de crianza"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: true,
    offerNotarization: true,
    offerRecordingHelp: true,
    basePrice: 7,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
   {
    id: 'prenuptial-agreement',
    name: 'Prenuptial Agreement',
    name_es: 'Acuerdo Prenupcial',
    category: 'Family',
    description: 'Agreement made before marriage regarding asset division if divorced.',
    description_es: 'Acuerdo hecho antes del matrimonio sobre la división de bienes en caso de divorcio.',
    aliases: ["prenup", "marriage contract", "before marriage agreement"],
    aliases_es: ["prenup", "contrato matrimonial", "acuerdo prematrimonial"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 7,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  {
    id: 'child-medical-consent',
    name: 'Child Medical Consent Form',
    name_es: 'Formulario de Consentimiento Médico para Menores',
    category: 'Family',
    description: 'Authorize a caregiver to make medical decisions for your child.',
    description_es: 'Autorizar a un cuidador a tomar decisiones médicas por su hijo.',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 3,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  // --- Category 5: Personal ---
   {
    id: "powerOfAttorney",
    name: "General Power of Attorney",
    name_es: "Poder Notarial General",
    category: "Personal",
    description: "Authorize someone to act on your behalf for financial or general matters.",
    description_es: "Autorizar a alguien para actuar en su nombre en asuntos financieros o generales.",
    aliases: ["represent me", "act on my behalf", "authorize someone", "financial poa"],
    aliases_es: ["representarme", "actuar en mi nombre", "autorizar a alguien", "poder financiero"],
    languageSupport: ["en", "es"],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        principalName: z.string().min(1),
        principalAddress: z.string().min(1),
        agentName: z.string().min(1),
        agentAddress: z.string().min(1),
        alternateAgentName: z.string().optional(),
        effectiveDateType: z.enum(['immediately', 'incapacity']),
        isDurable: z.enum(['yes', 'no']),
        state: z.string().length(2),
    }),
    questions: [
        { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
        { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
        { id: 'agentName', label: 'Agent\'s Full Name (Person receiving power)', type: 'text', required: true },
        { id: 'agentAddress', label: 'Agent\'s Full Address', type: 'textarea', required: true },
        { id: 'alternateAgentName', label: 'Alternate Agent\'s Full Name (Optional)', type: 'text' },
        { id: 'effectiveDateType', label: 'When does this POA become effective?', type: 'select', options: [{value: 'immediately', label: 'Immediately'}, {value: 'incapacity', label: 'Upon my incapacity'}], required: true },
        { id: 'isDurable', label: 'Is this a Durable POA (remains effective after incapacity)?', type: 'select', options: [{value: 'yes', label: 'Yes (Durable)'}, {value: 'no', label: 'No (Terminates on incapacity)'}], required: true },
        { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ],
    upsellClauses: [
      { id: "specificPowers", description: "Grant only specific listed powers", description_es: "Otorgar solo poderes específicos listados", price: 1 },
      { id: "addWitnessClause", description: "Add witness clause for extra validation", description_es: "Añadir cláusula de testigo para validación adicional", price: 2 }
    ]
  },
   {
    id: 'healthcare-power-of-attorney',
    name: 'Healthcare Power of Attorney',
    name_es: 'Poder Notarial para Atención Médica',
    category: 'Personal',
    description: 'Appoint an agent to make healthcare decisions if you cannot.',
    description_es: 'Nombrar un agente para tomar decisiones de atención médica si usted no puede.',
    aliases: ["medical poa", "healthcare proxy", "appoint agent for health", "medical decisions"],
    aliases_es: ["poder médico", "proxy de salud", "designar agente de salud", "decisiones médicas"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        principalName: z.string().min(1),
        principalAddress: z.string().min(1),
        agentName: z.string().min(1),
        agentAddress: z.string().min(1),
        alternateAgentName: z.string().optional(),
        lifeSupportPreferences: z.string().optional(),
        state: z.string().length(2),
    }),
    questions: [
       { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
       { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
       { id: 'agentName', label: 'Healthcare Agent\'s Full Name', type: 'text', required: true },
       { id: 'agentAddress', label: 'Healthcare Agent\'s Full Address', type: 'textarea', required: true },
       { id: 'alternateAgentName', label: 'Alternate Healthcare Agent\'s Full Name (Optional)', type: 'text' },
       { id: 'lifeSupportPreferences', label: 'Preferences regarding life support (Optional)', type: 'textarea', placeholder: 'e.g., I do/do not want artificial respiration...' },
       { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ]
  },
   {
    id: 'living-will',
    name: 'Living Will / Advance Directive',
    name_es: 'Testamento Vital / Directiva Anticipada',
    category: 'Personal',
    description: 'Specify your wishes for end-of-life medical care.',
    description_es: 'Especificar sus deseos para la atención médica al final de la vida.',
    aliases: ["medical wishes", "advance directive", "life support", "end of life"],
    aliases_es: ["deseos médicos", "directiva anticipada", "soporte vital", "fin de vida"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  {
    id: 'affidavit-general',
    name: 'Affidavit (General)',
    name_es: 'Declaración Jurada (General)',
    category: 'Personal', 
    description: 'A sworn written statement confirmed by oath, often used as evidence.',
    description_es: 'Una declaración escrita jurada confirmada por juramento, a menudo utilizada como prueba.',
    aliases: ["sworn statement", "declaration", "official statement", "statement under oath"],
    aliases_es: ["declaración jurada", "declaración oficial", "declaración bajo juramento"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 5,
    states: 'all',
    schema: z.object({
        affiantName: z.string().min(1),
        affiantAddress: z.string().min(1),
        statement: z.string().min(1),
        state: z.string().length(2),
        county: z.string().min(1),
    }),
    questions: [
      { id: 'affiantName', label: 'Your Full Name (Affiant)', type: 'text', required: true },
      { id: 'affiantAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'statement', label: 'Statement of Facts (Number each paragraph)', type: 'textarea', required: true, placeholder: '1. On [Date], I observed...\n2. The following occurred...' },
      { id: 'state', label: 'State where signed', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) },
      { id: 'county', label: 'County where signed', type: 'text', required: true },
    ]
  },
  // --- Category 6: Estate Planning ---
  {
    id: 'last-will-testament',
    name: 'Last Will and Testament',
    name_es: 'Última Voluntad y Testamento',
    category: 'Estate Planning',
    description: 'Specify how your assets should be distributed after death.',
    description_es: 'Especificar cómo deben distribuirse sus bienes después de la muerte.',
    aliases: ["will", "inheritance", "distribute assets"],
    aliases_es: ["testamento", "herencia", "distribuir bienes"],
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false,
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 7,
    states: 'all',
    schema: z.object({
        testatorName: z.string().min(1),
        testatorAddress: z.string().min(1),
        executorName: z.string().min(1),
        executorAddress: z.string().min(1),
        alternateExecutorName: z.string().optional(),
        beneficiaries: z.string().min(1),
        guardianForMinors: z.string().optional(),
        state: z.string().length(2),
    }),
    questions: [
        { id: 'testatorName', label: 'Your Full Name (Testator)', type: 'text', required: true },
        { id: 'testatorAddress', label: 'Your Full Address', type: 'textarea', required: true },
        { id: 'executorName', label: 'Executor Full Name', type: 'text', required: true },
        { id: 'executorAddress', label: 'Executor Address', type: 'textarea', required: true },
        { id: 'alternateExecutorName', label: 'Alternate Executor Full Name (Optional)', type: 'text' },
        { id: 'beneficiaries', label: 'Beneficiaries and Asset Distribution', type: 'textarea', required: true, placeholder: 'e.g., My house at 123 Main St to my daughter Jane Doe. My savings account to my son John Doe. Residue to...' },
        { id: 'guardianForMinors', label: 'Guardian for Minor Children (if applicable)', type: 'text', placeholder: 'Full name of guardian' },
         { id: 'state', label: 'State Governing the Will', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ],
  },
  {
    id: 'living-trust',
    name: 'Living Trust (Revocable)',
    name_es: 'Fideicomiso en Vida (Revocable)',
    category: 'Estate Planning',
    description: 'Manage assets during life and distribute after death, potentially avoiding probate.',
    description_es: 'Gestionar activos durante la vida y distribuirlos después de la muerte, potencialmente evitando el proceso sucesorio.',
    languageSupport: ['en', 'es'],
    requiresNotarization: true,
    canBeRecorded: false, 
    offerNotarization: true,
    offerRecordingHelp: false,
    basePrice: 10,
    states: 'all',
    schema: z.object({}),
    questions: [] 
  },
  // --- Fallback / General Inquiry ---
  {
    id: 'general-inquiry',
    name: "General Inquiry",
    name_es: "Consulta General",
    category: "Miscellaneous",
    description: "For situations where a specific document isn't immediately clear or needed.",
    description_es: "Para situaciones donde un documento específico no está claro o no se necesita de inmediato.",
    aliases: ["help", "question", "legal advice", "not sure"],
    aliases_es: ["ayuda", "pregunta", "consejo legal", "no estoy seguro"],
    languageSupport: ["en", "es"],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 0, 
    states: "all",
    schema: z.object({
        inquiryDetails: z.string().min(10, "Please provide more details about your situation."),
        desiredOutcome: z.string().optional(),
        state: z.string().optional(),
    }),
    questions: [
        { id: "inquiryDetails", label: "Please describe your situation or question in detail", type: "textarea", required: true },
        { id: "desiredOutcome", label: "What outcome are you hoping for?", type: "text" },
        { id: 'state', label: 'Which U.S. state is relevant? (Optional)', type: 'select', options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ]
  }
];

// Merge additional documents if any
if (documentLibraryAdditions && documentLibraryAdditions.length > 0) {
  const existingIds = new Set(documentLibrary.map(doc => doc.id));
  const newDocs = documentLibraryAdditions.filter(addDoc => !existingIds.has(addDoc.id));
  documentLibrary = [...documentLibrary, ...newDocs];
}


// Helper function to find documents by category, search term, and state
export function findMatchingDocuments(
  searchQuery: string,
  language: 'en' | 'es' = 'en', 
  stateCode?: string
): LegalDocument[] {
  const lowerQuery = searchQuery.toLowerCase();

  return documentLibrary.filter((doc) => {
    const name = language === 'es' && doc.name_es ? doc.name_es : doc.name;
    const description = language === 'es' && doc.description_es ? doc.description_es : doc.description;
    const aliases = language === 'es' && doc.aliases_es ? doc.aliases_es : doc.aliases || [];

    const stateMatch = !stateCode || stateCode === 'all' || doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(stateCode));
    if (!stateMatch) return false;

    if (lowerQuery) {
      return (
        name.toLowerCase().includes(lowerQuery) ||
        (description && description.toLowerCase().includes(lowerQuery)) ||
        aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
      );
    }
    return true; 
  });
}

// Re-export with a more common name for easier import.
export { documentLibrary as documents };
