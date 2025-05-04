// src/lib/document-library.ts

/**
 * Represents a question in the dynamic questionnaire.
 */
export interface Question {
  /** Unique ID for the answer key */
  id: string;
  /** The question text presented to the user */
  label: string;
  /** Type of input field required */
  type: 'text' | 'number' | 'date' | 'textarea' | 'select';
  /** Options for 'select' type questions */
  options?: { value: string; label: string }[];
  /** Whether the question is mandatory */
  required?: boolean;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Optional list of US state codes where this question is applicable */
  stateSpecific?: string[];
}


/**
 * Represents a legal document type in the library.
 */
export interface LegalDocument {
  /** Unique identifier for the document type (e.g., "residential-lease") */
  id: string;
  /** User-friendly name (e.g., "Residential Lease Agreement") */
  name: string;
  /** Keywords or phrases users might use to describe needing this document in English */
  aliases: string[];
  /** Keywords or phrases users might use to describe needing this document in Spanish */
  aliases_es: string[]; // Added Spanish aliases
  /** List of US state codes where this specific template/rules apply ('all' for general) */
  states: string[] | 'all';
  /** Category the document belongs to */
  category: string;
  /** Optional list of key clauses or sections available for this document */
  clauses?: string[];
  /** Brief description for display or AI context */
  description?: string; // Made optional
  /** Array of questions for the dynamic questionnaire for this document */
  questions: Question[];
}

// List of US States for dropdowns
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
    { value: 'DC', label: 'District of Columbia' },
    // Add territories if needed
    // { value: 'AS', label: 'American Samoa' }, { value: 'GU', label: 'Guam' }, { value: 'MP', label: 'Northern Mariana Islands' },
    // { value: 'PR', label: 'Puerto Rico' }, { value: 'VI', label: 'U.S. Virgin Islands' }
];


// Function to generate ID from name
const generateIdFromName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Updated document library with comprehensive list, IDs, and Spanish aliases
export const documentLibrary: LegalDocument[] = [
  {
    name: "Residential Lease Agreement",
    aliases: ["rent apartment", "tenant", "lease form", "landlord agreement", "rental contract"],
    aliases_es: ["alquilar apartamento", "inquilino", "contrato de arrendamiento", "acuerdo de propietario", "contrato de alquiler"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Residential Lease Agreement"),
    questions: [] // Placeholder, load from formSchemas
  },
  {
    name: "Divorce Settlement Agreement",
    aliases: ["divorce", "separation", "end marriage", "get divorced", "marital settlement"],
    aliases_es: ["divorcio", "separación", "terminar matrimonio", "acuerdo de divorcio", "liquidación matrimonial"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Divorce Settlement Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Child Custody Agreement",
    aliases: ["child custody", "custody battle", "parenting plan", "custody arrangement"],
    aliases_es: ["custodia de hijos", "plan de crianza", "acuerdo de custodia"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Child Custody Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Prenuptial Agreement",
    aliases: ["prenup", "marriage contract", "before marriage agreement", "premarital agreement"],
    aliases_es: ["acuerdo prenupcial", "capitulaciones matrimoniales", "contrato matrimonial"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Prenuptial Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Mutual Non-Disclosure Agreement (NDA)",
    aliases: ["confidential", "mutual nda", "protect idea", "secret", "both ways nda"],
    aliases_es: ["confidencial", "nda mutuo", "proteger idea", "secreto", "acuerdo de confidencialidad mutuo"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Mutual Non-Disclosure Agreement (NDA)"),
    questions: [] // Placeholder
  },
   {
    name: "Unilateral Non-Disclosure Agreement (NDA)",
    aliases: ["one-way nda", "disclosing party", "receiving party", "protect my idea"],
    aliases_es: ["nda unilateral", "parte reveladora", "parte receptora", "proteger mi idea", "acuerdo de confidencialidad unilateral"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Unilateral Non-Disclosure Agreement (NDA)"),
    questions: [] // Placeholder
  },
  {
    name: "Independent Contractor Agreement",
    aliases: ["freelance", "contractor", "gig work", "1099 job", "consultant agreement"],
    aliases_es: ["freelance", "contratista", "trabajo temporal", "acuerdo de consultor", "contrato de servicios profesionales"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Independent Contractor Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Service Agreement",
    aliases: ["hire services", "service provider", "payment terms", "scope of work", "master service agreement"],
    aliases_es: ["contratar servicios", "proveedor de servicios", "condiciones de pago", "alcance del trabajo", "contrato de servicios"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Service Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Partnership Agreement",
    aliases: ["business partners", "joint venture", "partner terms", "general partnership"],
    aliases_es: ["socios de negocios", "empresa conjunta", "términos de sociedad", "sociedad colectiva"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Partnership Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Operating Agreement",
    aliases: ["LLC agreement", "limited liability company", "LLC structure"],
    aliases_es: ["acuerdo operativo", "sociedad de responsabilidad limitada", "estructura LLC"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Operating Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Bill of Sale (Vehicle)",
    aliases: ["sell car", "vehicle transfer", "buy car", "car sale contract"],
    aliases_es: ["vender coche", "transferencia de vehículo", "comprar coche", "contrato de compraventa de vehículo"],
    states: ["all"],
    category: "Transactions",
    id: generateIdFromName("Bill of Sale (Vehicle)"),
    questions: [] // Placeholder
  },
   {
    name: "Bill of Sale (General)",
    aliases: ["sell item", "purchase item", "transfer ownership"],
    aliases_es: ["vender artículo", "comprar artículo", "transferir propiedad", "contrato de compraventa general"],
    states: ["all"],
    category: "Transactions",
    id: generateIdFromName("Bill of Sale (General)"),
    questions: [] // Placeholder
  },
  {
    name: "General Power of Attorney",
    aliases: ["represent me", "act on my behalf", "authorize someone", "financial poa"],
    aliases_es: ["representarme", "actuar en mi nombre", "autorizar a alguien", "poder notarial financiero"],
    states: ["all"],
    category: "Personal Affairs",
    id: generateIdFromName("General Power of Attorney"),
    questions: [] // Placeholder
  },
   {
    name: "Healthcare Power of Attorney",
    aliases: ["medical poa", "healthcare proxy", "appoint agent for health", "medical decisions"],
    aliases_es: ["poder médico", "proxy de salud", "designar agente de salud", "decisiones médicas"],
    states: ["all"],
    category: "Personal Affairs",
    id: generateIdFromName("Healthcare Power of Attorney"),
    questions: [] // Placeholder
  },
  {
    name: "Living Will",
    aliases: ["medical wishes", "advance directive", "life support", "end of life care", "healthcare directive"],
    aliases_es: ["voluntad vital", "directiva anticipada", "soporte vital", "cuidados paliativos", "directiva de salud"],
    states: ["all"],
    category: "Estate Planning",
    id: generateIdFromName("Living Will"),
    questions: [] // Placeholder
  },
  {
    name: "Last Will and Testament",
    aliases: ["will", "testament", "estate planning", "distribute assets", "inheritance"],
    aliases_es: ["testamento", "última voluntad", "planificación patrimonial", "distribuir bienes", "herencia"],
    states: ["all"],
    category: "Estate Planning",
    id: generateIdFromName("Last Will and Testament"),
    questions: [] // Placeholder
  },
  {
    name: "Loan Agreement",
    aliases: ["borrow money", "lend funds", "repayment terms", "personal loan", "loan contract"],
    aliases_es: ["pedir dinero prestado", "prestar fondos", "condiciones de pago", "préstamo personal", "contrato de préstamo"],
    states: ["all"],
    category: "Finance",
    id: generateIdFromName("Loan Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Promissory Note",
    aliases: ["IOU", "promise to pay", "loan paper", "debt note", "pagaré"],
    aliases_es: ["pagaré", "promesa de pago", "documento de préstamo", "nota de deuda"],
    states: ["all"],
    category: "Finance",
    id: generateIdFromName("Promissory Note"),
    questions: [] // Placeholder
  },
  {
    name: "Employment Offer Letter",
    aliases: ["hire employee", "job offer", "terms of employment", "offer letter"],
    aliases_es: ["contratar empleado", "oferta de trabajo", "condiciones de empleo", "carta de oferta"],
    states: ["all"],
    category: "Employment",
    id: generateIdFromName("Employment Offer Letter"),
    questions: [] // Placeholder
  },
   {
    name: "Non-Compete Agreement",
    aliases: ["restrict competition", "former employee", "noncompete", "restrictive covenant"],
    aliases_es: ["restringir competencia", "ex empleado", "acuerdo de no competencia", "cláusula restrictiva"],
    states: ["CA", "ND", "OK", "MT"], // Example restricted states
    category: "Employment",
    description: "Restricts an employee from competing after employment ends. Note: Enforceability varies significantly by state.",
    id: generateIdFromName("Non-Compete Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Eviction Notice",
    aliases: ["remove tenant", "late rent", "kick out", "notice to vacate", "notice to quit"],
    aliases_es: ["desalojar inquilino", "renta atrasada", "echar", "aviso de desalojo", "notificación de desahucio"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Eviction Notice"),
    questions: [] // Placeholder
  },
  {
    name: "Deed", // General Deed
    aliases: ["property deed", "ownership transfer", "real estate transfer"],
    aliases_es: ["escritura de propiedad", "transferencia de propiedad", "transferencia inmobiliaria"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Deed"),
    questions: [] // Placeholder
  },
  {
    name: "Quitclaim Deed",
    aliases: ["property transfer", "quit claim deed", "release interest"],
    aliases_es: ["transferencia de propiedad", "escritura de finiquito", "liberar interés"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Quitclaim Deed"),
    questions: [] // Placeholder
  },
  {
    name: "Articles of Incorporation",
    aliases: ["form corporation", "incorporate business", "start corporation"],
    aliases_es: ["constituir sociedad anónima", "incorporar negocio", "crear corporación"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Articles of Incorporation"),
    questions: [] // Placeholder
  },
  {
    name: "Cease and Desist Letter",
    aliases: ["stop using", "infringement", "copyright violation", "stop harassment", "infringement warning", "demand letter", "stop using trademark"],
    aliases_es: ["cese y desista", "infracción", "violación de derechos de autor", "detener acoso", "advertencia de infracción", "carta de demanda", "dejar de usar marca"],
    states: ["all"],
    category: "General Legal",
    id: generateIdFromName("Cease and Desist Letter"),
    questions: [] // Placeholder
  },
  {
    name: "Demand Letter", // More general than just payment
    aliases: ["request payment", "owe money", "legal demand", "request action"],
    aliases_es: ["exigir pago", "deber dinero", "demanda legal", "solicitar acción", "carta de reclamación"],
    states: ["all"],
    category: "General Legal",
    id: generateIdFromName("Demand Letter"),
    questions: [] // Placeholder
  },
  {
    name: "Release of Liability",
    aliases: ["waiver", "hold harmless", "not responsible", "liability waiver"],
    aliases_es: ["renuncia", "exoneración de responsabilidad", "no responsable", "renuncia de responsabilidad"],
    states: ["all"],
    category: "General Legal",
    id: generateIdFromName("Release of Liability"),
    questions: [] // Placeholder
  },
  {
    name: "Affidavit",
    aliases: ["sworn statement", "declaration", "official statement", "under oath"],
    aliases_es: ["declaración jurada", "declaración oficial", "bajo juramento"],
    states: ["all"],
    category: "General Legal",
    id: generateIdFromName("Affidavit"),
    questions: [] // Placeholder
  },
  {
    name: "Court Order",
    aliases: ["judge order", "legal ruling", "court ruling"],
    aliases_es: ["orden judicial", "fallo legal", "decisión del tribunal"],
    states: ["all"],
    category: "Court",
    id: generateIdFromName("Court Order"),
    questions: [] // Placeholder
  },
  {
    name: "Restraining Order",
    aliases: ["keep away", "protection order", "order of protection"],
    aliases_es: ["orden de alejamiento", "orden de protección"],
    states: ["all"],
    category: "Court",
    id: generateIdFromName("Restraining Order"),
    questions: [] // Placeholder
  },
  {
    name: "Probate Petition",
    aliases: ["inheritance", "will court", "estate administration"],
    aliases_es: ["herencia", "tribunal testamentario", "administración de bienes", "petición de sucesión"],
    states: ["all"],
    category: "Estate Planning",
    id: generateIdFromName("Probate Petition"),
    questions: [] // Placeholder
  },
  {
    name: "Bankruptcy Filing",
    aliases: ["chapter 7", "chapter 13", "debt relief", "file bankruptcy"],
    aliases_es: ["capítulo 7", "capítulo 13", "alivio de deuda", "declararse en bancarrota"],
    states: ["all"],
    category: "Finance",
    id: generateIdFromName("Bankruptcy Filing"),
    questions: [] // Placeholder
  },
  {
    name: "Cohabitation Agreement",
    aliases: ["living together", "unmarried partners", "partner sharing assets", "domestic partnership agreement"],
    aliases_es: ["vivir juntos", "pareja de hecho", "compartir bienes", "acuerdo de convivencia"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Cohabitation Agreement"),
    questions: [] // Placeholder
  },
   {
    name: "Invoice Dispute Letter",
    aliases: ["wrong bill", "incorrect invoice", "dispute charge"],
    aliases_es: ["factura incorrecta", "cargo incorrecto", "disputar cargo", "reclamar factura"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Invoice Dispute Letter"),
    questions: [] // Placeholder
  },
  // General Inquiry Fallback (Keep last)
   {
    id: 'general-inquiry',
    name: 'General Inquiry',
    aliases: ['unsure', 'help', 'legal question', 'need advice', 'other', 'talk to someone', 'not sure'],
    aliases_es: ['no estoy seguro', 'ayuda', 'pregunta legal', 'necesito consejo', 'otro', 'hablar con alguien', 'duda'],
    states: 'all',
    category: "General Legal",
    description: 'Used when the user\'s need is unclear or doesn\'t match a specific document type.',
    questions: [
      { id: "specificNeed", label: "Can you describe your legal need in more detail?", type: "textarea", required: true, placeholder: "e.g., What are you trying to achieve or protect?" },
      { id: "involvedParties", label: "Who are the main parties involved?", type: "text", placeholder: "e.g., Myself, my business partner, my landlord" },
      { id: "desiredOutcome", label: "What is your desired outcome?", type: "textarea", placeholder: "e.g., Get paid for work, stop someone from contacting me, formalize an agreement" },
       { id: 'state', label: 'Which U.S. state is relevant? (Optional)', type: 'select', options: usStates }
    ]
  },
];


/**
 * Finds document types matching keywords or aliases (basic implementation).
 *
 * @param query - The user's input string.
 * @param language - The language code ('en' or 'es').
 * @param state - The US state code (optional).
 * @returns An array of matching LegalDocument objects.
 */
export function findMatchingDocuments(query: string, language: 'en' | 'es' = 'en', state?: string): LegalDocument[] {
  const lowerQuery = query.toLowerCase();
  return documentLibrary.filter(doc => {
    const aliases = language === 'es' ? doc.aliases_es : doc.aliases;
    const nameMatch = doc.name.toLowerCase().includes(lowerQuery);
    const aliasMatch = aliases.some(alias => lowerQuery.includes(alias.toLowerCase()));
    const stateMatch = !state || doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(state));

    return (nameMatch || aliasMatch) && stateMatch && doc.id !== 'general-inquiry';
  });
}
