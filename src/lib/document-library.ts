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
  category: string; // Category for grouping (e.g., 'Real Estate', 'Family Law')
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


// The main library of legal documents - Updated with new structure
export const documentLibrary: LegalDocument[] = [
  {
    "id": "powerOfAttorney", // Changed from generateIdFromName to match provided ID
    "name": "Power of Attorney",
    "category": "Personal & Family",
    "description": "Authorize someone to act on your behalf legally.",
    "description_es": "Autorizar a alguien para actuar en su nombre legalmente.", // Added Spanish description
    "languageSupport": ["en", "es"],
    "requiresNotarization": true,
    "canBeRecorded": false,
    "offerNotarization": true,
    "offerRecordingHelp": false,
    "basePrice": 5,
    "upsellClauses": [
      {
        "id": "medicalOnly",
        "description": "Limit to medical decisions only",
        "description_es": "Limitar solo a decisiones médicas", // Added Spanish
        "price": 1
      },
      {
        "id": "addWitnessClause",
        "description": "Add witness clause for extra protection",
        "description_es": "Añadir cláusula de testigo para protección adicional", // Added Spanish
        "price": 2
      }
    ],
     "questions": [ // Kept existing questions for POA
        { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
        { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
        { id: 'agentName', label: 'Agent\'s Full Name (Person receiving power)', type: 'text', required: true },
        { id: 'agentAddress', label: 'Agent\'s Full Address', type: 'textarea', required: true },
        { id: 'alternateAgentName', label: 'Alternate Agent\'s Full Name (Optional)', type: 'text' },
        { id: 'effectiveDateType', label: 'When does this POA become effective?', type: 'select', options: [{value: 'immediately', label: 'Immediately'}, {value: 'incapacity', label: 'Upon my incapacity'}], required: true },
        { id: 'isDurable', label: 'Is this a Durable POA (remains effective after incapacity)?', type: 'select', options: [{value: 'yes', label: 'Yes (Durable)'}, {value: 'no', label: 'No (Terminates on incapacity)'}], required: true },
        { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
    ]
  },
  {
    "id": "leaseAgreement", // Changed from generateIdFromName
    "name": "Lease Agreement", // Keeping 'Lease Agreement' instead of 'Residential Lease Agreement' for consistency
    "category": "Real Estate",
    "description": "Set terms for renting a property between landlord and tenant.",
    "description_es": "Establecer términos para alquilar una propiedad entre propietario e inquilino.", // Added Spanish description
    "languageSupport": ["en", "es"],
    "requiresNotarization": false,
    "canBeRecorded": true,
    "offerNotarization": false,
    "offerRecordingHelp": true,
    "basePrice": 5,
    "upsellClauses": [
      {
        "id": "lateFeeClause",
        "description": "Add late rent fee clause",
        "description_es": "Añadir cláusula de cargo por pago tardío de alquiler", // Added Spanish
        "price": 1
      },
      {
        "id": "petPolicy",
        "description": "Include a pet policy section",
        "description_es": "Incluir una sección de política de mascotas", // Added Spanish
        "price": 1
      }
    ],
     "questions": [ // Kept existing questions for Lease Agreement
        { id: "landlordName", label: "Landlord's Full Name", type: "text", required: true },
        { id: "tenantName", label: "Tenant's Full Name", type: "text", required: true },
        { id: "propertyAddress", label: "Full Property Address", type: "textarea", required: true },
        { id: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
        { id: "monthlyRent", label: "Monthly Rent Amount ($)", type: "number", required: true },
        // Add other relevant lease questions here
    ]
  },
  {
    "id": "nda", // Changed from generateIdFromName
    "name": "Non-Disclosure Agreement (NDA)",
    "category": "Contracts & Agreements", // Updated category
    "description": "Protect confidential information between two parties.",
    "description_es": "Proteger información confidencial entre dos partes.", // Added Spanish description
    "languageSupport": ["en", "es"],
    "requiresNotarization": false,
    "canBeRecorded": false,
    "offerNotarization": false,
    "offerRecordingHelp": false,
    "basePrice": 5,
    "upsellClauses": [
      {
        "id": "extendedTerm",
        "description": "Extend NDA duration beyond 1 year",
        "description_es": "Extender la duración del NDA más allá de 1 año", // Added Spanish
        "price": 1
      },
      {
        "id": "mutualProtection",
        "description": "Make NDA mutual instead of one-sided",
        "description_es": "Hacer que el NDA sea mutuo en lugar de unilateral", // Added Spanish
        "price": 2
      }
    ],
     "questions": [ // Kept existing questions for Mutual NDA
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
   // --- Add the rest of the documents from the previous list, adapted to the new structure ---
   // Example for Divorce Settlement:
   {
     id: generateIdFromName("Divorce Settlement Agreement"),
     name: "Divorce Settlement Agreement",
     name_es: "Acuerdo de Divorcio",
     category: "Family Law",
     description: "Formalizes the terms of a divorce, including property division, support, and custody.",
     description_es: "Formaliza los términos de un divorcio, incluyendo división de bienes, manutención y custodia.",
     languageSupport: ["en", "es"],
     requiresNotarization: true,
     canBeRecorded: true,
     offerNotarization: true,
     offerRecordingHelp: true,
     basePrice: 5,
     states: "all",
     upsellClauses: [
         { id: "spousalSupportWaiver", description: "Include waiver of spousal support", description_es: "Incluir renuncia a la manutención conyugal", price: 2 },
         { id: "retirementSplit", description: "Specify division of retirement accounts", description_es: "Especificar división de cuentas de jubilación", price: 2 },
     ],
     questions: [ // Example questions
         { id: "spouse1Name", label: "Spouse 1 Full Name", type: "text", required: true },
         { id: "spouse2Name", label: "Spouse 2 Full Name", type: "text", required: true },
         { id: "dateOfMarriage", label: "Date of Marriage", type: "date", required: true },
         { id: "dateOfSeparation", label: "Date of Separation", type: "date", required: true },
         // Add many more: property division details, spousal support, child support, child custody...
     ]
   },
   // ... Add other documents similarly ...

   // General Inquiry - Keep this as a fallback
    {
      id: generateIdFromName("General Inquiry"),
      name: "General Inquiry",
      name_es: "Consulta General",
      category: "Miscellaneous",
      description: "For situations where a specific document isn't immediately clear.",
      description_es: "Para situaciones donde un documento específico no está claro de inmediato.",
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
        return documentLibrary.filter(doc => doc.id !== 'general-inquiry'); // Return all except General Inquiry if no filter
    }

    return documentLibrary.filter(doc => {
        if (doc.id === 'general-inquiry') return false; // Always exclude General Inquiry from search/filter results

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
             const aliasesMatch = language === 'es' ? doc.aliases_es : doc.aliases; // Use optional aliases

             if (nameMatch?.includes(lowerQuery)) return true;
             if (descriptionMatch?.includes(lowerQuery)) return true;
             if (aliasesMatch?.some(alias => alias.toLowerCase().includes(lowerQuery))) return true; // Check optional aliases

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
