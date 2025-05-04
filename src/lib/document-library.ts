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


// Mock data for the document library - Updated list.
// Added IDs and empty questions array to satisfy the interface.
export const documentLibrary: LegalDocument[] = [
   {
    id: "residential-lease-agreement",
    name: "Residential Lease Agreement",
    aliases: ["rent apartment", "tenant", "lease form", "landlord agreement"],
    states: ["all"],
    category: "Real Estate",
    questions: [] // Added empty questions
  },
  {
    id: "divorce-settlement-agreement",
    name: "Divorce Settlement Agreement",
    aliases: ["divorce", "separation", "end marriage", "get divorced"],
    states: ["all"],
    category: "Family Law",
    questions: []
  },
  {
    id: "child-custody-agreement",
    name: "Child Custody Agreement",
    aliases: ["child custody", "custody battle", "parenting plan"],
    states: ["all"],
    category: "Family Law",
    questions: []
  },
  {
    id: "prenuptial-agreement",
    name: "Prenuptial Agreement",
    aliases: ["prenup", "marriage contract", "before marriage agreement"],
    states: ["all"],
    category: "Family Law",
    questions: []
  },
  {
    id: "non-disclosure-agreement-nda",
    name: "Non-Disclosure Agreement (NDA)",
    aliases: ["confidential", "nda", "protect idea", "secret"],
    states: ["all"],
    category: "Business",
    questions: []
  },
  {
    id: "independent-contractor-agreement",
    name: "Independent Contractor Agreement",
    aliases: ["freelance", "contractor", "gig work", "1099 job"],
    states: ["all"],
    category: "Business",
    questions: []
  },
  {
    id: "service-agreement",
    name: "Service Agreement",
    aliases: ["hire services", "service provider", "payment terms"],
    states: ["all"],
    category: "Business",
    questions: []
  },
  {
    id: "bill-of-sale",
    name: "Bill of Sale",
    aliases: ["sell car", "used item sale", "vehicle transfer"],
    states: ["all"],
    category: "Transactions",
    questions: []
  },
  {
    id: "power-of-attorney",
    name: "Power of Attorney",
    aliases: ["represent me", "act on my behalf", "authorize someone"],
    states: ["all"],
    category: "Personal Affairs",
    questions: []
  },
  {
    id: "living-will",
    name: "Living Will",
    aliases: ["medical wishes", "advance directive", "life support"],
    states: ["all"],
    category: "Estate",
    questions: []
  },
  {
    id: "loan-agreement",
    name: "Loan Agreement",
    aliases: ["borrow money", "lend funds", "repayment terms"],
    states: ["all"],
    category: "Finance",
    questions: []
  },
  {
    id: "employment-offer-letter",
    name: "Employment Offer Letter",
    aliases: ["hire employee", "job offer", "terms of employment"],
    states: ["all"],
    category: "Employment",
    questions: []
  },
  {
    id: "eviction-notice",
    name: "Eviction Notice",
    aliases: ["remove tenant", "late rent", "kick out"],
    states: ["all"],
    category: "Real Estate",
    questions: []
  },
  {
    id: "affidavit",
    name: "Affidavit",
    aliases: ["sworn statement", "declaration", "official statement"],
    states: ["all"],
    category: "General Legal",
    questions: []
  },
  {
    id: "promissory-note",
    name: "Promissory Note",
    aliases: ["IOU", "promise to pay", "loan paper"],
    states: ["all"],
    category: "Finance",
    questions: []
  },
  {
    id: "cohabitation-agreement",
    name: "Cohabitation Agreement",
    aliases: ["living together", "roommate agreement", "partner sharing"],
    states: ["all"],
    category: "Family Law",
    questions: []
  },
  {
    id: "non-compete-agreement",
    name: "Non-Compete Agreement",
    aliases: ["restrict competition", "former employee", "noncompete"],
    states: ["all"],
    category: "Employment",
    questions: []
  },
    // Add the General Inquiry fallback
    {
    id: 'general-inquiry',
    name: 'General Inquiry',
    aliases: ['unsure', 'help', 'legal question', 'need advice', 'other'],
    states: 'all',
    category: "General Legal",
    description: 'Used when the user\'s need is unclear or doesn\'t match a specific document type.',
    questions: [
      { id: "specificNeed", label: "Can you describe your legal need in more detail?", type: "textarea", required: true, placeholder: "e.g., What are you trying to achieve or protect?" },
      { id: "involvedParties", label: "Who are the main parties involved?", type: "text", placeholder: "e.g., Myself, my business partner, my landlord" },
      { id: "desiredOutcome", label: "What is your desired outcome?", type: "textarea", placeholder: "e.g., Get paid for work, stop someone from contacting me, formalize an agreement" },
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