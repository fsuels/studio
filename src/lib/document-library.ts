// src/lib/document-library.ts

import { documentLibraryAdditions } from './document-library-additions';

// Define the structure for a single question
export type Question = {
  id: string; // Unique identifier for the question (e.g., 'tenant_name')
  label: string; // The question text presented to the user
  placeholder?: string; // Placeholder text for input fields
  required?: boolean; // Whether the question must be answered
  type: 'text' | 'select' | 'date' | 'number' | 'textarea'; // Input type
  options?: { value: string; label: string }[]; // Options for 'select' type
  stateSpecific?: string[]; // Optional: List of state codes (e.g., ['CA', 'NY']) where this question applies
  // Add language variants if needed, e.g., label_es: '...'
};

// Define structure for upsell clauses
export type UpsellClause = {
    id: string;
    description: string;
    description_es?: string; // Spanish description for upsell
    price: number; // e.g., 1 or 2 dollars
};

// Define the structure for a single legal document
export type LegalDocument = {
  id: string; // Unique identifier for the document (e.g., 'residential-lease')
  name: string; // English name of the document
  name_es?: string; // Spanish name of the document (optional)
  aliases?: string[]; // English keywords or phrases (optional, can remove if not used)
  aliases_es?: string[]; // Spanish keywords or phrases (optional)
  category: string; // Category for grouping (e.g., 'Real Estate', 'Family Law') - USE NEW CATEGORIES
  states?: string[] | 'all'; // States where this document is applicable ('all' or list like ['CA', 'NY'])
  questions?: Question[]; // Array of questions for the dynamic form
  description: string; // Short description of the document
  description_es?: string; // Spanish description
  requiresNotarization: boolean; // Does this document typically require notarization?
  canBeRecorded: boolean; // Can this document be recorded with a court/clerk?
  offerNotarization: boolean; // Should we offer help/links for notarization?
  offerRecordingHelp: boolean; // Should we offer help/links for recording?
  basePrice: number; // Base price for the document (e.g., 5)
  languageSupport: string[]; // Array of supported language codes (e.g., ['en', 'es'])
  upsellClauses?: UpsellClause[]; // Optional clauses user can add for a fee
  templatePath?: string; // Path to the English markdown template
  templatePath_es?: string; // Path to the Spanish markdown template
  requiresNotarizationStates?: string[]; // States where notarization is legally required
};

// Helper function to create slugs from names (basic example)
function generateIdFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}


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

// The main library of legal documents - Updated with new structure and categories
export let documentLibrary: LegalDocument[] = [ // Changed to let for modification
  // --- Category 1: Finance ---
  {
    id: 'promissory-note',
    name: 'Promissory Note',
    name_es: 'Pagaré',
    category: 'Finance', // Updated category
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
    questions: [ // Placeholder questions
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
    basePrice: 19.95, // As per prompt
    states: 'all', 
    templatePath: "src/data/templates/en/bill-of-sale-vehicle.md",
    templatePath_es: "src/data/templates/es/bill-of-sale-vehicle.md",
    requiresNotarizationStates: ["AZ", "KY", "LA", "MT", "NV", "OH", "OK", "PA", "WV", "WY"], // Example states
    questions: [ // These should match the placeholders in the markdown
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
        { id: 'county', label: 'County (for Notary Acknowledgment)', type: 'text', required: false } // Often required for notary
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
    questions: []
  },
   {
    id: 'articles-of-incorporation-biz', // Ensure unique ID
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
    templatePath: "src/data/templates/en/termination-letter.md",
    templatePath_es: "src/data/templates/es/termination-letter.md",
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
  language: 'en' | 'es' = 'en', // Default to English
  stateCode?: string
): LegalDocument[] {
  const lowerQuery = searchQuery.toLowerCase();

  return documentLibrary.filter((doc) => {
    // Determine which name and description to use based on language
    const name = language === 'es' && doc.name_es ? doc.name_es : doc.name;
    const description = language === 'es' && doc.description_es ? doc.description_es : doc.description;
    const aliases = language === 'es' && doc.aliases_es ? doc.aliases_es : doc.aliases || [];

    // Check state compatibility
    const stateMatch = !stateCode || stateCode === 'all' || doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(stateCode));
    if (!stateMatch) return false;

    // Check search query match (if provided)
    if (lowerQuery) {
      return (
        name.toLowerCase().includes(lowerQuery) ||
        (description && description.toLowerCase().includes(lowerQuery)) ||
        aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
      );
    }
    return true; // If no query, match all (that fit state)
  });
}
