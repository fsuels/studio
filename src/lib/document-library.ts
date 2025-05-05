// src/lib/document-library.ts

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

// Define the structure for a single legal document
export type LegalDocument = {
  id: string; // Unique identifier for the document (e.g., 'residential-lease')
  name: string; // English name of the document
  name_es?: string; // Spanish name of the document (optional)
  aliases: string[]; // English keywords or phrases
  aliases_es?: string[]; // Spanish keywords or phrases (optional)
  category: string; // Category for grouping (e.g., 'Real Estate', 'Family Law')
  states?: string[] | 'all'; // States where this document is applicable ('all' or list like ['CA', 'NY'])
  questions?: Question[]; // Array of questions for the dynamic form
  description?: string; // Short description of the document
  description_es?: string; // Spanish description
  requiresNotarization?: boolean; // NEW: Does this document typically require notarization?
  canBeRecorded?: boolean; // NEW: Can this document be recorded with a court/clerk?
  // Add other metadata as needed (e.g., basePrice)
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
    // Removed 'Other/Not Applicable' as it's better handled by making the field optional
];


// The main library of legal documents
export const documentLibrary: LegalDocument[] = [
  {
    id: generateIdFromName("Residential Lease Agreement"),
    name: "Residential Lease Agreement",
    name_es: "Contrato de Arrendamiento Residencial",
    aliases: ["rent apartment", "tenant", "lease form", "landlord agreement", "house rental"],
    aliases_es: ["alquilar apartamento", "inquilino", "formulario de alquiler", "contrato de propietario", "rentar casa"],
    states: "all",
    category: "Real Estate",
    description: "Creates a contract between a landlord and tenant for renting residential property.",
    description_es: "Crea un contrato entre un propietario y un inquilino para alquilar una propiedad residencial.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [ // Example questions - expand significantly
        { id: "landlordName", label: "Landlord's Full Name", type: "text", required: true },
        { id: "tenantName", label: "Tenant's Full Name", type: "text", required: true },
        { id: "propertyAddress", label: "Full Property Address", type: "textarea", required: true },
        { id: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
        { id: "monthlyRent", label: "Monthly Rent Amount ($)", type: "number", required: true },
        // Add many more: term, security deposit, pets, late fees, utilities, state-specific clauses...
    ]
  },
  {
    id: generateIdFromName("Divorce Settlement Agreement"),
    name: "Divorce Settlement Agreement",
    name_es: "Acuerdo de Divorcio",
    aliases: ["divorce", "separation", "end marriage", "get divorced", "marital settlement"],
    aliases_es: ["divorcio", "separación", "terminar matrimonio", "divorciarse", "acuerdo matrimonial"],
    states: "all",
    category: "Family Law",
    description: "Formalizes the terms of a divorce, including property division, support, and custody.",
    description_es: "Formaliza los términos de un divorcio, incluyendo división de bienes, manutención y custodia.",
    requiresNotarization: true, // Often required
    canBeRecorded: true, // Often filed with court
    questions: [ // Example questions
        { id: "spouse1Name", label: "Spouse 1 Full Name", type: "text", required: true },
        { id: "spouse2Name", label: "Spouse 2 Full Name", type: "text", required: true },
        { id: "dateOfMarriage", label: "Date of Marriage", type: "date", required: true },
        { id: "dateOfSeparation", label: "Date of Separation", type: "date", required: true },
        // Add many more: property division details, spousal support, child support, child custody...
    ]
  },
  {
    id: generateIdFromName("Child Custody Agreement"),
    name: "Child Custody Agreement",
    name_es: "Acuerdo de Custodia de Menores",
    aliases: ["child custody", "custody battle", "parenting plan", "visitation schedule"],
    aliases_es: ["custodia de hijos", "batalla por custodia", "plan de crianza", "horario de visitas"],
    states: "all",
    category: "Family Law",
    description: "Defines legal and physical custody arrangements for minor children.",
    description_es: "Define los arreglos de custodia legal y física para hijos menores.",
    requiresNotarization: true, // Often required
    canBeRecorded: true, // Often filed with court
    questions: [] // Placeholder - Add detailed questions about parents, children, schedules, decision-making etc.
  },
  {
    id: generateIdFromName("Prenuptial Agreement"),
    name: "Prenuptial Agreement",
    name_es: "Acuerdo Prenupcial",
    aliases: ["prenup", "marriage contract", "before marriage agreement", "antenuptial"],
    aliases_es: ["prenup", "contrato matrimonial", "acuerdo antes de casarse", "capitulaciones matrimoniales"],
    states: "all",
    category: "Family Law",
    description: "Sets terms for property division and support if a marriage ends.",
    description_es: "Establece los términos para la división de bienes y manutención si el matrimonio termina.",
    requiresNotarization: true, // Typically required
    canBeRecorded: false,
    questions: [] // Placeholder - Add questions about assets, debts, waivers etc.
  },
  {
    id: generateIdFromName("Mutual Non-Disclosure Agreement (NDA)"),
    name: "Mutual Non-Disclosure Agreement (NDA)",
    name_es: "Acuerdo Mutuo de Confidencialidad (NDA)",
    aliases: ["confidential", "nda", "protect idea", "secret", "keep quiet", "mutual nda"],
    aliases_es: ["confidencial", "nda", "proteger idea", "secreto", "guardar silencio", "nda mutuo"],
    states: "all",
    category: "Business",
    description: "Legally binds two parties to keep shared information confidential.",
    description_es: "Obliga legalmente a dos partes a mantener la información compartida confidencial.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [
       { id: "party1Name", label: "Party 1 Full Name/Company", type: "text", required: true },
       { id: "party1Address", label: "Party 1 Address", type: "textarea", required: true },
       { id: "party2Name", label: "Party 2 Full Name/Company", type: "text", required: true },
       { id: "party2Address", label: "Party 2 Address", type: "textarea", required: true },
       { id: "effectiveDate", label: "Effective Date of Agreement", type: "date", required: true },
       { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "e.g., Discussing potential business partnership, evaluating software" },
       { id: "confidentialInfoDescription", label: "Brief Description of Confidential Information", type: "textarea", placeholder: "e.g., Business plans, customer lists, source code" },
       { id: "termYears", label: "Term of Agreement (Years, 0 for indefinite)", type: "number", placeholder: "e.g., 3" },
    ]
  },
   {
    id: generateIdFromName("Unilateral Non-Disclosure Agreement (NDA)"),
    name: "Unilateral Non-Disclosure Agreement (NDA)",
    name_es: "Acuerdo Unilateral de Confidencialidad (NDA)",
    aliases: ["one way nda", "unilateral nda", "disclosing party"],
    aliases_es: ["nda unilateral", "nda de una via", "parte reveladora"],
    states: "all",
    category: "Business",
    description: "Binds one party (Recipient) to keep information from another party (Discloser) confidential.",
    description_es: "Obliga a una parte (Receptor) a mantener confidencial la información de otra parte (Revelador).",
    requiresNotarization: false,
    canBeRecorded: false,
     questions: [
        { id: "disclosingPartyName", label: "Disclosing Party Full Name/Company", type: "text", required: true },
        { id: "disclosingPartyAddress", label: "Disclosing Party Address", type: "textarea", required: true },
        { id: "receivingPartyName", label: "Receiving Party Full Name/Company", type: "text", required: true },
        { id: "receivingPartyAddress", label: "Receiving Party Address", type: "textarea", required: true },
        { id: "effectiveDate", label: "Effective Date of Agreement", type: "date", required: true },
        { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "e.g., Evaluating potential investment, providing consulting services" },
        { id: "confidentialInfoDescription", label: "Brief Description of Confidential Information", type: "textarea", placeholder: "e.g., Financial projections, marketing strategies" },
        { id: "termYears", label: "Term of Obligation (Years, 0 for indefinite)", type: "number", placeholder: "e.g., 5" },
   ],
  },
  {
    id: generateIdFromName("Independent Contractor Agreement"),
    name: "Independent Contractor Agreement",
    name_es: "Contrato de Contratista Independiente",
    aliases: ["freelance", "contractor", "gig work", "1099 job", "consultant agreement"],
    aliases_es: ["freelance", "contratista", "trabajo por encargo", "trabajo 1099", "contrato de consultor"],
    states: "all",
    category: "Business",
    description: "Defines the relationship between a business and an independent contractor.",
    description_es: "Define la relación entre un negocio y un contratista independiente.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [] // Placeholder - Add questions about parties, services, payment, term, intellectual property etc.
  },
  {
    id: generateIdFromName("Service Agreement"),
    name: "Service Agreement",
    name_es: "Contrato de Servicios",
    aliases: ["hire services", "service provider", "payment terms", "scope of work"],
    aliases_es: ["contratar servicios", "proveedor de servicios", "términos de pago", "alcance del trabajo"],
    states: "all",
    category: "Business",
    description: "Outlines the terms under which services will be provided.",
    description_es: "Describe los términos bajo los cuales se prestarán los servicios.",
    requiresNotarization: false,
    canBeRecorded: false,
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
        { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStates }
    ]
  },
  {
    id: generateIdFromName("Partnership Agreement"),
    name: "Partnership Agreement",
    name_es: "Acuerdo de Sociedad",
    aliases: ["business partners", "joint venture", "partner terms", "founding agreement"],
    aliases_es: ["socios de negocios", "empresa conjunta", "términos de socios", "acuerdo de fundación"],
    states: "all",
    category: "Business",
    description: "Governs the relationship between business partners.",
    description_es: "Rige la relación entre socios de negocios.",
    requiresNotarization: false, // Sometimes recommended
    canBeRecorded: false,
    questions: [
         { id: "partner1Name", label: "Partner 1 Full Name", type: "text", required: true, placeholder: "e.g., John Smith" },
         { id: "partner1Address", label: "Partner 1 Address", type: "textarea", required: true },
         { id: "partner2Name", label: "Partner 2 Full Name", type: "text", required: true, placeholder: "e.g., Alice Brown" },
         { id: "partner2Address", label: "Partner 2 Address", type: "textarea", required: true },
         // Optional: Add logic to dynamically add more partners
         { id: "businessName", label: "Partnership Business Name", type: "text", required: true, placeholder: "e.g., Acme Innovations LLC" },
         { id: "businessAddress", label: "Principal Business Address", type: "textarea", required: true },
         { id: "startDate", label: "Partnership Start Date", type: "date", required: true },
         { id: "capitalContributions", label: "Initial Capital Contributions (describe)", type: "textarea", required: true, placeholder: "e.g., Partner 1: $10,000 cash, Partner 2: Equipment valued at $5,000" },
         { id: "profitSplit", label: "Profit/Loss Sharing Arrangement", type: "textarea", required: true, placeholder: "e.g., 50/50 split after expenses, or based on capital contribution" },
         { id: "managementRoles", label: "Management Roles & Responsibilities", type: "textarea", placeholder: "e.g., Partner 1: Operations, Partner 2: Marketing. Major decisions require unanimous vote." },
         { id: "dissolutionTerms", label: "Terms for Dissolution/Partner Exit", type: "textarea", placeholder: "e.g., Buyout options, asset distribution procedure" },
         { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStates }
    ]
  },
  {
    id: generateIdFromName("Operating Agreement"),
    name: "Operating Agreement",
    name_es: "Acuerdo Operativo",
    aliases: ["LLC agreement", "limited liability company", "LLC formation", "member agreement"],
    aliases_es: ["acuerdo LLC", "compañía de responsabilidad limitada", "formación LLC", "acuerdo de miembros"],
    states: "all", // Note: Highly state-specific, template needs adaptation
    category: "Business",
    description: "Outlines the ownership and operating procedures of an LLC.",
    description_es: "Describe la propiedad y los procedimientos operativos de una LLC.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [] // Placeholder - Add questions about members, management, capital, distributions, dissolution etc.
  },
  {
    id: generateIdFromName("Bill of Sale (Vehicle)"), // Made more specific
    name: "Bill of Sale (Vehicle)",
    name_es: "Contrato de Compraventa (Vehículo)",
    aliases: ["sell car", "used vehicle sale", "vehicle transfer", "car title transfer"],
    aliases_es: ["vender coche", "venta de vehículo usado", "transferencia de vehículo", "transferencia de título de coche"],
    states: "all",
    category: "Transactions",
    description: "Documents the transfer of ownership of a vehicle.",
    description_es: "Documenta la transferencia de propiedad de un vehículo.",
    requiresNotarization: false, // Sometimes required by state DMV
    canBeRecorded: false,
    questions: [ // Example questions for Vehicle Bill of Sale
        { id: "buyerName", label: "Buyer's Full Name", type: "text", required: true },
        { id: "sellerName", label: "Seller's Full Name", type: "text", required: true },
        { id: "vehicleYear", label: "Vehicle Year", type: "number", required: true },
        { id: "vehicleMake", label: "Vehicle Make", type: "text", required: true },
        { id: "vehicleModel", label: "Vehicle Model", type: "text", required: true },
        { id: "vehicleVIN", label: "Vehicle VIN", type: "text", required: true },
        { id: "odometer", label: "Odometer Reading", type: "number", required: true },
        { id: "salePrice", label: "Sale Price ($)", type: "number", required: true },
        { id: "saleDate", label: "Date of Sale", type: "date", required: true },
        // Add more: As-is clause, warranty details etc.
     ]
  },
   {
    id: generateIdFromName("Bill of Sale (General)"), // General Bill of Sale
    name: "Bill of Sale (General)",
    name_es: "Contrato de Compraventa (General)",
    aliases: ["sell item", "used item sale", "transfer ownership", "proof of purchase"],
    aliases_es: ["vender artículo", "venta de artículo usado", "transferencia de propiedad", "prueba de compra"],
    states: "all",
    category: "Transactions",
    description: "Documents the transfer of ownership for personal property.",
    description_es: "Documenta la transferencia de propiedad de bienes personales.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [] // Placeholder
  },
  {
    id: generateIdFromName("General Power of Attorney"),
    name: "General Power of Attorney",
    name_es: "Poder Legal General",
    aliases: ["represent me", "act on my behalf", "authorize someone", "POA", "general poa"],
    aliases_es: ["representarme", "actuar en mi nombre", "autorizar a alguien", "poder general"],
    states: "all", // Note: State laws vary significantly
    category: "Personal Affairs",
    description: "Authorizes someone (Agent) to handle broad financial and legal matters.",
    description_es: "Autoriza a alguien (Agente) a manejar amplios asuntos financieros y legales.",
    requiresNotarization: true, // Almost always required
    canBeRecorded: true, // Sometimes recorded (e.g., for real estate transactions)
    questions: [
        { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
        { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
        { id: 'agentName', label: 'Agent\'s Full Name (Person receiving power)', type: 'text', required: true },
        { id: 'agentAddress', label: 'Agent\'s Full Address', type: 'textarea', required: true },
        { id: 'alternateAgentName', label: 'Alternate Agent\'s Full Name (Optional)', type: 'text' },
        { id: 'effectiveDateType', label: 'When does this POA become effective?', type: 'select', options: [{value: 'immediately', label: 'Immediately'}, {value: 'incapacity', label: 'Upon my incapacity'}], required: true },
        { id: 'isDurable', label: 'Is this a Durable POA (remains effective after incapacity)?', type: 'select', options: [{value: 'yes', label: 'Yes (Durable)'}, {value: 'no', label: 'No (Terminates on incapacity)'}], required: true },
        { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStates.filter(opt => ['CA', 'NY', 'TX', 'FL', 'IL', 'Other'].includes(opt.value)) } // Example limited states + Other
    ]
  },
   {
    id: generateIdFromName("Healthcare Power of Attorney"),
    name: "Healthcare Power of Attorney",
    name_es: "Poder Legal para Atención Médica",
    aliases: ["medical poa", "healthcare proxy", "appoint agent for health", "medical decisions"],
    aliases_es: ["poder médico", "proxy de salud", "designar agente de salud", "decisiones médicas"],
    states: "all", // Note: State laws vary significantly
    category: "Personal Affairs",
    description: "Appoints an agent to make healthcare decisions if you cannot.",
    description_es: "Designa a un agente para tomar decisiones de atención médica si usted no puede.",
    requiresNotarization: true, // Often required
    canBeRecorded: false,
    questions: [
       { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
       { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
       { id: 'agentName', label: 'Healthcare Agent\'s Full Name', type: 'text', required: true },
       { id: 'agentAddress', label: 'Healthcare Agent\'s Full Address', type: 'textarea', required: true },
       { id: 'alternateAgentName', label: 'Alternate Healthcare Agent\'s Full Name (Optional)', type: 'text' },
       { id: 'lifeSupportPreferences', label: 'Preferences regarding life support (Optional)', type: 'textarea', placeholder: 'e.g., I do/do not want artificial respiration...' },
       { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStates.filter(opt => ['CA', 'NY', 'TX', 'FL', 'IL', 'Other'].includes(opt.value)) }
    ]
  },
  {
    id: generateIdFromName("Living Will"),
    name: "Living Will",
    name_es: "Testamento Vital",
    aliases: ["medical wishes", "advance directive", "life support", "end of life care"],
    aliases_es: ["deseos médicos", "directiva anticipada", "soporte vital", "cuidado al final de la vida"],
    states: "all", // Note: State laws vary significantly
    category: "Estate",
    description: "Specifies your wishes for medical treatment if you are incapacitated.",
    description_es: "Especifica sus deseos de tratamiento médico si queda incapacitado.",
    requiresNotarization: true, // Often required
    canBeRecorded: false,
    questions: [] // Placeholder - Add questions about specific treatments (CPR, feeding tubes etc.)
  },
   {
    id: generateIdFromName("Last Will and Testament"),
    name: "Last Will and Testament",
    name_es: "Última Voluntad y Testamento",
    aliases: ["will", "testament", "inheritance", "distribute assets", "leave property"],
    aliases_es: ["testamento", "voluntad", "herencia", "distribuir bienes", "dejar propiedad"],
    states: "all", // Note: State laws vary significantly
    category: "Estate",
    description: "Specifies how your assets should be distributed after your death.",
    description_es: "Especifica cómo deben distribuirse sus bienes después de su muerte.",
    requiresNotarization: true, // Required
    canBeRecorded: true, // Filed with probate court after death
    questions: [
        { id: 'testatorName', label: 'Your Full Name (Testator)', type: 'text', required: true },
        { id: 'testatorAddress', label: 'Your Full Address', type: 'textarea', required: true },
        { id: 'executorName', label: 'Executor Full Name', type: 'text', required: true },
        { id: 'executorAddress', label: 'Executor Address', type: 'textarea', required: true },
        { id: 'alternateExecutorName', label: 'Alternate Executor Full Name (Optional)', type: 'text' },
        { id: 'beneficiaries', label: 'Beneficiaries and Asset Distribution', type: 'textarea', required: true, placeholder: 'e.g., My house at 123 Main St to my daughter Jane Doe. My savings account to my son John Doe. Residue to...' },
        { id: 'guardianForMinors', label: 'Guardian for Minor Children (if applicable)', type: 'text', placeholder: 'Full name of guardian' },
         { id: 'state', label: 'State Governing the Will', type: 'select', required: true, options: usStates.filter(opt => ['CA', 'NY', 'TX', 'FL', 'IL', 'Other'].includes(opt.value)) }
    ]
  },
  {
    id: generateIdFromName("Loan Agreement"),
    name: "Loan Agreement",
    name_es: "Contrato de Préstamo",
    aliases: ["borrow money", "lend funds", "repayment terms", "personal loan"],
    aliases_es: ["pedir dinero prestado", "prestar fondos", "términos de pago", "préstamo personal"],
    states: "all",
    category: "Finance",
    description: "Formalizes the terms of a loan between two parties.",
    description_es: "Formaliza los términos de un préstamo entre dos partes.",
    requiresNotarization: false, // Sometimes recommended
    canBeRecorded: false,
    questions: [] // Placeholder - Add questions about lender, borrower, amount, interest rate, repayment schedule, collateral etc.
  },
  {
    id: generateIdFromName("Promissory Note"),
    name: "Promissory Note",
    name_es: "Pagaré",
    aliases: ["IOU", "promise to pay", "loan paper", "debt instrument"],
    aliases_es: ["pagaré", "promesa de pago", "documento de préstamo", "instrumento de deuda"],
    states: "all",
    category: "Finance",
    description: "A written promise by one party to pay another party a definite sum of money.",
    description_es: "Una promesa escrita de una parte de pagar a otra parte una suma definida de dinero.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [] // Placeholder - Similar to Loan Agreement but often simpler
  },
  {
    id: generateIdFromName("Employment Offer Letter"),
    name: "Employment Offer Letter",
    name_es: "Carta de Oferta de Empleo",
    aliases: ["hire employee", "job offer", "terms of employment", "offer letter"],
    aliases_es: ["contratar empleado", "oferta de trabajo", "términos de empleo", "carta de oferta"],
    states: "all",
    category: "Employment",
    description: "Formalizes an offer of employment to a candidate.",
    description_es: "Formaliza una oferta de empleo a un candidato.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [] // Placeholder - Add questions about employer, employee, position, salary, start date, benefits, contingencies etc.
  },
  {
    id: generateIdFromName("Eviction Notice"),
    name: "Eviction Notice",
    name_es: "Notificación de Desalojo",
    aliases: ["remove tenant", "late rent", "kick out", "notice to quit", "unlawful detainer"],
    aliases_es: ["desalojar inquilino", "renta atrasada", "echar", "aviso de desalojo", "retención ilícita"],
    states: "all", // Note: Highly state/local specific procedures and forms
    category: "Real Estate",
    description: "Formal notice from a landlord to a tenant to vacate the property.",
    description_es: "Notificación formal de un propietario a un inquilino para desocupar la propiedad.",
    requiresNotarization: false, // Usually served, not notarized
    canBeRecorded: true, // Often filed with court as part of eviction process
    questions: [] // Placeholder - Add questions about landlord, tenant, property, reason for eviction, notice period, state etc.
  },
   {
    id: generateIdFromName("Deed (General Warranty)"), // More specific Deed type
    name: "Deed (General Warranty)",
    name_es: "Escritura (Garantía General)",
    aliases: ["property deed", "ownership transfer", "real estate transfer", "warranty deed"],
    aliases_es: ["escritura de propiedad", "transferencia de propiedad", "transferencia de bienes raíces", "escritura de garantía"],
    states: "all", // Note: State/local recording requirements vary
    category: "Real Estate",
    description: "Transfers real estate ownership with a guarantee of clear title.",
    description_es: "Transfiere la propiedad de bienes raíces con garantía de título limpio.",
    requiresNotarization: true, // Required
    canBeRecorded: true, // Required for legal effect
    questions: [] // Placeholder - Add Grantor, Grantee, Property Description, Consideration etc.
  },
  {
    id: generateIdFromName("Quitclaim Deed"),
    name: "Quitclaim Deed",
    name_es: "Escritura de Renuncia",
    aliases: ["property transfer", "quit claim deed", "release interest in property"],
    aliases_es: ["transferencia de propiedad", "escritura de renuncia", "liberar interés en propiedad"],
    states: "all", // Note: State/local recording requirements vary
    category: "Real Estate",
    description: "Transfers interest in real property without guaranteeing clear title.",
    description_es: "Transfiere interés en bienes raíces sin garantizar título limpio.",
    requiresNotarization: true, // Required
    canBeRecorded: true, // Required for legal effect
    questions: [] // Placeholder - Add Grantor, Grantee, Property Description etc.
  },
   {
    id: generateIdFromName("Articles of Incorporation"),
    name: "Articles of Incorporation",
    name_es: "Artículos de Incorporación",
    aliases: ["form corporation", "incorporate business", "start a corporation", "corporate charter"],
    aliases_es: ["formar corporación", "incorporar negocio", "iniciar una corporación", "estatutos corporativos"],
    states: "all", // Note: Filed with specific state agency
    category: "Business",
    description: "The primary legal document used to form a corporation.",
    description_es: "El documento legal principal utilizado para formar una corporación.",
    requiresNotarization: false,
    canBeRecorded: true, // Filed with Secretary of State
    questions: [] // Placeholder - Add corporation name, registered agent, shares, incorporator etc.
  },
  {
    id: generateIdFromName("Cease and Desist Letter"),
    name: "Cease and Desist Letter",
    name_es: "Carta de Cese y Desistimiento",
    aliases: ["stop using", "infringement", "copyright violation", "trademark warning", "defamation notice"],
    aliases_es: ["dejar de usar", "infracción", "violación de copyright", "advertencia de marca registrada", "notificación de difamación"],
    states: "all",
    category: "Miscellaneous",
    description: "Demands that the recipient stop a specific illegal or infringing activity.",
    description_es: "Exige que el destinatario detenga una actividad ilegal o infractora específica.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [
        { id: 'senderName', label: 'Your Full Name/Company (Sender)', type: 'text', required: true },
        { id: 'senderAddress', label: 'Your Address', type: 'textarea', required: true },
        { id: 'recipientName', label: 'Recipient Full Name/Company', type: 'text', required: true },
        { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
        { id: 'activityToCease', label: 'Specific Activity Recipient Must Cease', type: 'textarea', required: true, placeholder: 'e.g., Using copyrighted material, making defamatory statements, trespassing' },
        { id: 'legalBasis', label: 'Legal Basis for Demand (Optional but recommended)', type: 'textarea', placeholder: 'e.g., Copyright infringement under Title 17 USC, defamation laws' },
        { id: 'deadlineForCompliance', label: 'Deadline for Compliance (e.g., 14 days)', type: 'text', placeholder: 'e.g., 14 days from the date of this letter' },
        { id: 'consequences', label: 'Consequences of Non-Compliance', type: 'textarea', placeholder: 'e.g., We will pursue legal action including seeking damages and injunctive relief' },
        { id: 'dateSent', label: 'Date Letter Sent', type: 'date', required: true },
    ]
  },
   {
    id: generateIdFromName("Demand Letter"),
    name: "Demand Letter",
    name_es: "Carta de Reclamación",
    aliases: ["request payment", "owe money", "legal demand", "collect debt", "notice of claim"],
    aliases_es: ["solicitar pago", "deber dinero", "reclamación legal", "cobrar deuda", "notificación de reclamo"],
    states: "all",
    category: "Miscellaneous",
    description: "A formal letter demanding payment or action before legal action is taken.",
    description_es: "Una carta formal exigiendo pago o acción antes de tomar medidas legales.",
    requiresNotarization: false,
    canBeRecorded: false,
    questions: [
        { id: 'yourName', label: 'Your Full Name/Company', type: 'text', required: true },
        { id: 'yourAddress', label: 'Your Address', type: 'textarea', required: true },
        { id: 'recipientName', label: 'Recipient Full Name/Company', type: 'text', required: true },
        { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
        { id: 'invoiceNumber', label: 'Invoice Number Being Disputed', type: 'text', required: true },
        { id: 'invoiceDate', label: 'Date of Invoice', type: 'date', required: true },
        { id: 'disputedItem', label: 'Specific Item(s) or Charge(s) Being Disputed', type: 'textarea', required: true },
        { id: 'reasonForDispute', label: 'Reason for Disputing the Charge(s)', type: 'textarea', required: true, placeholder: 'e.g., Billed for services not received, incorrect rate applied' },
        { id: 'desiredResolution', label: 'What resolution are you seeking?', type: 'textarea', required: true, placeholder: 'e.g., Corrected invoice, refund for the disputed amount' },
        { id: 'dateSent', label: 'Date Letter Sent', type: 'date', required: true },
   ]
  },
   {
    id: generateIdFromName("Release of Liability"),
    name: "Release of Liability",
    name_es: "Liberación de Responsabilidad",
    aliases: ["waiver", "hold harmless", "not responsible", "liability waiver", "indemnity agreement"],
    aliases_es: ["renuncia", "mantener indemne", "no responsable", "renuncia de responsabilidad", "acuerdo de indemnización"],
    states: "all",
    category: "Miscellaneous",
    description: "One party agrees not to hold another liable for potential damages or injuries.",
    description_es: "Una parte acuerda no responsabilizar a otra por posibles daños o lesiones.",
    requiresNotarization: false, // Sometimes recommended
    canBeRecorded: false,
    questions: [] // Placeholder - Add releasing party, released party, activity description, date etc.
  },
  {
    id: generateIdFromName("Affidavit"),
    name: "Affidavit",
    name_es: "Declaración Jurada",
    aliases: ["sworn statement", "declaration", "official statement", "testimony under oath"],
    aliases_es: ["declaración jurada", "declaración", "declaración oficial", "testimonio bajo juramento"],
    states: "all", // Note: Requires notarization
    category: "General Legal",
    description: "A written statement confirmed by oath or affirmation, for use as evidence in court.",
    description_es: "Una declaración escrita confirmada por juramento o afirmación, para uso como prueba en tribunal.",
    requiresNotarization: true, // Required
    canBeRecorded: true, // Sometimes filed with court
    questions: [] // Placeholder - Add affiant name, statement details, date, notary block etc.
  },
    {
    id: generateIdFromName("General Inquiry"), // Fallback/Catch-all
    name: "General Inquiry",
    name_es: "Consulta General",
    aliases: ["question", "help", "legal advice", "unsure", "talk to someone", "other"],
    aliases_es: ["pregunta", "ayuda", "asesoría legal", "no estoy seguro", "hablar con alguien", "otro"],
    states: "all",
    category: "Miscellaneous",
    description: "For situations where a specific document isn't immediately clear.",
    description_es: "Para situaciones donde un documento específico no está claro de inmediato.",
     requiresNotarization: false,
     canBeRecorded: false,
    questions: [ // Basic questions for inquiry routing
        { id: "inquiryDetails", label: "Please describe your situation or question in detail", type: "textarea", required: true },
        { id: "desiredOutcome", label: "What outcome are you hoping for?", type: "text" },
    ]
  },
];


/**
 * Finds matching documents based on search query, language, and state.
 * - Searches name, aliases, and descriptions.
 * - Filters by state if provided.
 *
 * @param query - The search string.
 * @param language - 'en' | 'es'.
 * @param state - Optional 2-letter US state code.
 * @returns An array of matching LegalDocument objects.
 */
export function findMatchingDocuments(
    query: string,
    language: 'en' | 'es' = 'en',
    state?: string
): LegalDocument[] {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery && !state) {
        return documentLibrary; // Return all if no query or state filter
    }

    return documentLibrary.filter(doc => {
        // Check State Compatibility
        if (state) {
            if (doc.states !== 'all' && !doc.states?.includes(state)) {
                return false; // Exclude if state doesn't match and isn't 'all'
            }
        }

        // Check Query Match (if query exists)
        if (lowerQuery) {
             const nameMatch = language === 'es' ? doc.name_es?.toLowerCase() : doc.name.toLowerCase();
             const descriptionMatch = language === 'es' ? doc.description_es?.toLowerCase() : doc.description?.toLowerCase();
             const aliasesMatch = language === 'es' ? doc.aliases_es : doc.aliases;

             if (nameMatch?.includes(lowerQuery)) return true;
             if (descriptionMatch?.includes(lowerQuery)) return true;
             if (aliasesMatch?.some(alias => alias.toLowerCase().includes(lowerQuery))) return true;

             // If query doesn't match name, description, or aliases in the selected language
             return false;
        }

        // If only state filter was applied and it passed, include the doc
        return !!state;
    });
}

// Add more utility functions as needed, e.g., getDocumentById
export function getDocumentById(id: string): LegalDocument | undefined {
    return documentLibrary.find(doc => doc.id === id);
}

