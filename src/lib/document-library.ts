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
  /** Keywords or phrases users might use to describe needing this document */
  aliases: string[];
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

// Updated document library with comprehensive list and IDs
export const documentLibrary: LegalDocument[] = [
  {
    name: "Residential Lease Agreement",
    aliases: ["rent apartment", "tenant", "lease form", "landlord agreement"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Residential Lease Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Divorce Settlement Agreement",
    aliases: ["divorce", "separation", "end marriage", "get divorced"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Divorce Settlement Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Child Custody Agreement",
    aliases: ["child custody", "custody battle", "parenting plan"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Child Custody Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Prenuptial Agreement",
    aliases: ["prenup", "marriage contract", "before marriage agreement"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Prenuptial Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Mutual Non-Disclosure Agreement (NDA)", // Use this specific name for lookup
    aliases: ["confidential", "mutual nda", "protect idea", "secret", "both ways nda"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Mutual Non-Disclosure Agreement (NDA)"),
    questions: [] // Placeholder
  },
   {
    name: "Unilateral Non-Disclosure Agreement (NDA)", // Use this specific name
    aliases: ["one-way nda", "disclosing party", "receiving party", "protect my idea"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Unilateral Non-Disclosure Agreement (NDA)"),
    questions: [] // Placeholder
  },
  {
    name: "Independent Contractor Agreement",
    aliases: ["freelance", "contractor", "gig work", "1099 job"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Independent Contractor Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Service Agreement",
    aliases: ["hire services", "service provider", "payment terms", "scope of work"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Service Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Partnership Agreement",
    aliases: ["business partners", "joint venture", "partner terms"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Partnership Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Operating Agreement",
    aliases: ["LLC agreement", "limited liability company"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Operating Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Bill of Sale (Vehicle)", // Use this specific name
    aliases: ["sell car", "used item sale", "vehicle transfer", "buy car"],
    states: ["all"],
    category: "Transactions",
    id: generateIdFromName("Bill of Sale (Vehicle)"),
    questions: [] // Placeholder
  },
  {
    name: "General Power of Attorney", // Use this specific name
    aliases: ["represent me", "act on my behalf", "authorize someone", "financial poa"],
    states: ["all"],
    category: "Personal Affairs",
    id: generateIdFromName("General Power of Attorney"),
    questions: [] // Placeholder
  },
   {
    name: "Healthcare Power of Attorney", // Use this specific name
    aliases: ["medical poa", "healthcare proxy", "appoint agent for health"],
    states: ["all"],
    category: "Personal Affairs",
    id: generateIdFromName("Healthcare Power of Attorney"),
    questions: [] // Placeholder
  },
  {
    name: "Living Will",
    aliases: ["medical wishes", "advance directive", "life support", "end of life care"],
    states: ["all"],
    category: "Estate Planning", // Updated category
    id: generateIdFromName("Living Will"),
    questions: [] // Placeholder
  },
  {
    name: "Last Will and Testament", // Use this specific name
    aliases: ["will", "testament", "estate planning", "distribute assets"],
    states: ["all"],
    category: "Estate Planning",
    id: generateIdFromName("Last Will and Testament"),
    questions: [] // Placeholder
  },
  {
    name: "Loan Agreement",
    aliases: ["borrow money", "lend funds", "repayment terms", "personal loan"],
    states: ["all"],
    category: "Finance",
    id: generateIdFromName("Loan Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Promissory Note",
    aliases: ["IOU", "promise to pay", "loan paper", "debt note"],
    states: ["all"],
    category: "Finance",
    id: generateIdFromName("Promissory Note"),
    questions: [] // Placeholder
  },
  {
    name: "Employment Offer Letter",
    aliases: ["hire employee", "job offer", "terms of employment", "offer letter"],
    states: ["all"],
    category: "Employment",
    id: generateIdFromName("Employment Offer Letter"),
    questions: [] // Placeholder
  },
   {
    name: "Non-Compete Agreement",
    aliases: ["restrict competition", "former employee", "noncompete", "restrictive covenant"],
    states: ["CA", "ND", "OK", "MT"], // Example restricted states
    category: "Employment",
    description: "Restricts an employee from competing after employment ends. Note: Enforceability varies significantly by state.",
    id: generateIdFromName("Non-Compete Agreement"),
    questions: [] // Placeholder
  },
  {
    name: "Eviction Notice",
    aliases: ["remove tenant", "late rent", "kick out", "notice to vacate"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Eviction Notice"),
    questions: [] // Placeholder
  },
  {
    name: "Deed",
    aliases: ["property deed", "ownership transfer"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Deed"),
    questions: [] // Placeholder
  },
  {
    name: "Quitclaim Deed",
    aliases: ["property transfer", "quit claim deed"],
    states: ["all"],
    category: "Real Estate",
    id: generateIdFromName("Quitclaim Deed"),
    questions: [] // Placeholder
  },
  {
    name: "Articles of Incorporation",
    aliases: ["form corporation", "incorporate business"],
    states: ["all"],
    category: "Business",
    id: generateIdFromName("Articles of Incorporation"),
    questions: [] // Placeholder
  },
  {
    name: "Cease and Desist Letter",
    aliases: ["stop using", "infringement", "copyright violation", "stop harassment", "infringement warning", "demand letter", "stop using trademark"],
    states: ["all"],
    category: "General Legal", // Updated category
    id: generateIdFromName("Cease and Desist Letter"),
    questions: [] // Placeholder
  },
  {
    name: "Demand Letter",
    aliases: ["request payment", "owe money", "legal demand"],
    states: ["all"],
    category: "General Legal", // Updated category
    id: generateIdFromName("Demand Letter"),
    questions: [] // Placeholder
  },
  {
    name: "Release of Liability",
    aliases: ["waiver", "hold harmless", "not responsible"],
    states: ["all"],
    category: "General Legal", // Updated category
    id: generateIdFromName("Release of Liability"),
    questions: [] // Placeholder
  },
  {
    name: "Affidavit",
    aliases: ["sworn statement", "declaration", "official statement", "under oath"],
    states: ["all"],
    category: "General Legal",
    id: generateIdFromName("Affidavit"),
    questions: [] // Placeholder
  },
  {
    name: "Court Order",
    aliases: ["judge order", "legal ruling"],
    states: ["all"],
    category: "Court",
    id: generateIdFromName("Court Order"),
    questions: [] // Placeholder
  },
  {
    name: "Restraining Order",
    aliases: ["keep away", "protection order"],
    states: ["all"],
    category: "Court",
    id: generateIdFromName("Restraining Order"),
    questions: [] // Placeholder
  },
  {
    name: "Probate Petition",
    aliases: ["inheritance", "will court", "estate administration"],
    states: ["all"],
    category: "Estate Planning", // Updated category
    id: generateIdFromName("Probate Petition"),
    questions: [] // Placeholder
  },
  {
    name: "Bankruptcy Filing",
    aliases: ["chapter 7", "chapter 13", "debt relief"],
    states: ["all"],
    category: "Finance",
    id: generateIdFromName("Bankruptcy Filing"),
    questions: [] // Placeholder
  },
  {
    name: "Cohabitation Agreement",
    aliases: ["living together", "unmarried partners", "partner sharing assets", "domestic partnership agreement"],
    states: ["all"],
    category: "Family Law",
    id: generateIdFromName("Cohabitation Agreement"),
    questions: [] // Placeholder
  },
   {
    name: "Invoice Dispute Letter", // Added
    aliases: ["wrong bill", "incorrect invoice", "dispute charge"],
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
 * Finds document types matching keywords or aliases.
 * Basic example; a real implementation might use fuzzy search or embeddings.
 *
 * @param query - The user's input string.
 * @param state - The US state code (optional).
 * @returns An array of matching LegalDocument objects.
 */
export function findMatchingDocuments(query: string, state?: string): LegalDocument[] {
  const lowerQuery = query.toLowerCase();
  return documentLibrary.filter(doc => {
    // Check if query matches document name or any alias
    const nameMatch = doc.name.toLowerCase().includes(lowerQuery);
    const aliasMatch = doc.aliases.some(alias => lowerQuery.includes(alias.toLowerCase()));

    // Check state compatibility
    const stateMatch = !state || doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(state));

    // Document matches if query matches name/alias AND state is compatible
    // Exclude 'General Inquiry' from keyword matches, it's a fallback.
    return (nameMatch || aliasMatch) && stateMatch && doc.id !== 'general-inquiry';
  });
}
