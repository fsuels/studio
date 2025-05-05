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
  // Add other metadata as needed (e.g., requiresNotarization, basePrice)
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
     questions: [] // Placeholder - Add questions about assets, debts, waivers etc.
  },
  {
    id: generateIdFromName("Non-Disclosure Agreement (NDA)"),
    name: "Non-Disclosure Agreement (NDA)",
    name_es: "Acuerdo de Confidencialidad (NDA)",
    aliases: ["confidential", "nda", "protect idea", "secret", "keep quiet"],
    aliases_es: ["confidencial", "nda", "proteger idea", "secreto", "guardar silencio"],
    states: "all",
    category: "Business",
    description: "Legally binds parties to keep certain information confidential.",
    description_es: "Obliga legalmente a las partes a mantener cierta información confidencial.",
     questions: [] // Placeholder - Add questions about parties, purpose, term, type (mutual/unilateral) etc.
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
     questions: [] // Placeholder - Add questions about client, provider, services, payment, term, liability etc.
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
     questions: [] // Placeholder - Add questions about partners, contributions, profit/loss, management, dissolution etc.
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
    questions: [] // Placeholder
  },
  {
    id: generateIdFromName("Power of Attorney"),
    name: "Power of Attorney",
    name_es: "Poder Legal",
    aliases: ["represent me", "act on my behalf", "authorize someone", "POA"],
    aliases_es: ["representarme", "actuar en mi nombre", "autorizar a alguien", "poder"],
    states: "all", // Note: State laws vary significantly
    category: "Personal Affairs",
    description: "Authorizes someone (Agent) to act on another's behalf (Principal).",
    description_es: "Autoriza a alguien (Agente) a actuar en nombre de otro (Principal).",
     questions: [] // Placeholder - Add questions about principal, agent, powers, durability, effective date etc.
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
     questions: [] // Placeholder - Add questions about principal, agent, specific wishes, HIPAA etc.
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
     questions: [] // Placeholder - Add questions about specific treatments (CPR, feeding tubes etc.)
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
     questions: [] // Placeholder - Add sender, recipient, infringing activity, legal basis, deadline etc.
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
     questions: [] // Placeholder - Add sender, recipient, amount owed/action required, deadline, consequences etc.
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

             return false; // No query match if we reach here
        }

        // If only state filter was applied and it passed, include the doc
        return !!state;
    });
}

// Add more utility functions as needed, e.g., getDocumentById
export function getDocumentById(id: string): LegalDocument | undefined {
    return documentLibrary.find(doc => doc.id === id);
}

