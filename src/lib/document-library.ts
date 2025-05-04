// src/lib/document-library.ts

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
  /** Optional list of key clauses or sections available for this document */
  clauses?: string[];
  /** Brief description for display or AI context */
  description?: string;
}

// Mock data for the document library - In a real app, this would come from a database or CMS.
export const documentLibrary: LegalDocument[] = [
  {
    id: 'residential-lease',
    name: 'Residential Lease Agreement',
    aliases: ['renting apartment', 'lease house', 'tenant agreement', 'rental contract'],
    states: 'all',
    clauses: ['pets', 'late fees', 'security deposit', 'subletting', 'utilities'],
    description: 'A contract between a landlord and tenant for renting residential property.',
  },
  {
    id: 'nda-mutual',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    aliases: ['confidentiality agreement', 'secret information', 'protect business idea', 'mutual NDA'],
    states: 'all',
    description: 'An agreement where two parties agree not to disclose confidential information shared with each other.',
  },
  {
    id: 'nda-unilateral',
    name: 'Unilateral Non-Disclosure Agreement (NDA)',
    aliases: ['one-way NDA', 'disclosing party', 'receiving party'],
    states: 'all',
    description: 'An agreement where one party agrees not to disclose confidential information received from another party.',
  },
  {
    id: 'bill-of-sale-vehicle',
    name: 'Bill of Sale (Vehicle)',
    aliases: ['sell car', 'buy vehicle', 'transfer car ownership', 'proof of purchase car'],
    states: 'all', // Note: Actual forms can be state-specific
    description: 'A document confirming the transfer of ownership of a vehicle from a seller to a buyer.',
  },
  {
    id: 'power-of-attorney-general',
    name: 'General Power of Attorney',
    aliases: ['POA', 'appoint agent', 'act on my behalf', 'financial decisions'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL', /* ... add more states */], // Example state specificity
    description: 'Authorizes an agent to handle a broad range of financial and legal matters on behalf of the principal.',
  },
    {
    id: 'power-of-attorney-healthcare',
    name: 'Healthcare Power of Attorney',
    aliases: ['medical POA', 'healthcare proxy', 'advance directive', 'medical decisions'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL', /* ... add more states */], // Example state specificity
    description: 'Authorizes an agent to make healthcare decisions for the principal if they become incapacitated.',
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    aliases: ['contractor agreement', 'freelance contract', 'scope of work', 'consulting agreement'],
    states: 'all',
    description: 'A contract outlining the terms of service between a service provider and a client.',
  },
    {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    aliases: ['business partners', 'starting business together', 'partner roles'],
    states: 'all',
    description: 'Defines the terms, responsibilities, and profit/loss distribution for a business partnership.',
  },
   {
    id: 'invoice-dispute-letter',
    name: 'Invoice Dispute Letter',
    aliases: ['dispute bill', 'incorrect charge', 'billing error'],
    states: 'all',
    description: 'A formal letter sent to contest charges on an invoice.',
  },
   {
    id: 'cease-and-desist-letter',
    name: 'Cease and Desist Letter',
    aliases: ['stop harassment', 'infringement notice', 'demand letter'],
    states: 'all',
    description: 'A formal demand for an individual or entity to stop a specific activity.',
  },
   {
    id: 'will-last-testament',
    name: 'Last Will and Testament',
    aliases: ['will', 'inheritance', 'distribute assets', 'executor'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL', /* ... add more states */], // Wills are highly state-specific
    description: 'A legal document outlining how a person\'s assets should be distributed after their death.',
  },
  // Add more document types here...
  {
    id: 'general-inquiry',
    name: 'General Inquiry',
    aliases: ['unsure', 'help', 'legal question', 'need advice'],
    states: 'all',
    description: 'Used when the user\'s need is unclear or doesn\'t match a specific document type.',
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
    const matchesAlias = doc.aliases.some(alias => lowerQuery.includes(alias.toLowerCase()));
    const stateMatch = !state || doc.states === 'all' || doc.states.includes(state);
    return matchesAlias && stateMatch && doc.id !== 'general-inquiry'; // Exclude general inquiry from keyword match
  });
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
