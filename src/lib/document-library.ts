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
  /** Optional list of key clauses or sections available for this document */
  clauses?: string[];
  /** Brief description for display or AI context */
  description?: string;
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


// Mock data for the document library - In a real app, this would come from a database or CMS.
export const documentLibrary: LegalDocument[] = [
  {
    id: 'residential-lease',
    name: 'Residential Lease Agreement',
    aliases: ['renting apartment', 'lease house', 'tenant agreement', 'rental contract'],
    states: 'all',
    clauses: ['pets', 'late fees', 'security deposit', 'subletting', 'utilities'],
    description: 'A contract between a landlord and tenant for renting residential property.',
    questions: [
        { id: "tenantName", label: "Tenant's Full Name", type: "text", required: true, placeholder: "e.g., Jane Doe" },
        { id: "landlordName", label: "Landlord's Full Name or Company", type: "text", required: true, placeholder: "e.g., Acme Property Management" },
        { id: "propertyAddress", label: "Full Property Address", type: "textarea", required: true, placeholder: "e.g., 123 Main St, Unit 4B, Anytown, USA 12345" },
        { id: "rentAmount", label: "Monthly Rent Amount ($)", type: "number", required: true, placeholder: "e.g., 1500" },
        { id: "rentDueDate", label: "Rent Due Date (e.g., 1st of month)", type: "text", required: true, placeholder: "e.g., 1st" },
        { id: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
        { id: "leaseTermMonths", label: "Lease Term (Months)", type: "number", required: true, placeholder: "e.g., 12" },
        { id: "securityDeposit", label: "Security Deposit Amount ($)", type: "number", placeholder: "e.g., 1500" },
        { id: "petsAllowed", label: "Pets Allowed?", type: "select", options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}, {value: 'specific', label: 'Yes, with conditions'}], required: true },
        { id: "petConditions", label: "If pets allowed, specify conditions (type, size, deposit)", type: "textarea", placeholder: "e.g., One cat allowed, $200 pet deposit", required: false }, // Conditionally required later?
        { id: "lateFeePolicy", label: "Late Fee Policy", type: "textarea", placeholder: "e.g., $50 fee after 5 days late", stateSpecific: ['CA', 'NY'] }, // Example state-specific question
    ]
  },
  {
    id: 'nda-mutual',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    aliases: ['confidentiality agreement', 'secret information', 'protect business idea', 'mutual NDA'],
    states: 'all',
    description: 'An agreement where two parties agree not to disclose confidential information shared with each other.',
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
    id: 'nda-unilateral',
    name: 'Unilateral Non-Disclosure Agreement (NDA)',
    aliases: ['one-way NDA', 'disclosing party', 'receiving party'],
    states: 'all',
    description: 'An agreement where one party agrees not to disclose confidential information received from another party.',
    questions: [
        { id: "disclosingPartyName", label: "Disclosing Party Full Name/Company", type: "text", required: true },
        { id: "disclosingPartyAddress", label: "Disclosing Party Address", type: "textarea", required: true },
        { id: "receivingPartyName", label: "Receiving Party Full Name/Company", type: "text", required: true },
        { id: "receivingPartyAddress", label: "Receiving Party Address", type: "textarea", required: true },
        { id: "effectiveDate", label: "Effective Date of Agreement", type: "date", required: true },
        { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "e.g., Evaluating potential investment, providing consulting services" },
        { id: "confidentialInfoDescription", label: "Brief Description of Confidential Information", type: "textarea", placeholder: "e.g., Financial projections, marketing strategies" },
        { id: "termYears", label: "Term of Obligation (Years, 0 for indefinite)", type: "number", placeholder: "e.g., 5" },
    ]
  },
  {
    id: 'bill-of-sale-vehicle',
    name: 'Bill of Sale (Vehicle)',
    aliases: ['sell car', 'buy vehicle', 'transfer car ownership', 'proof of purchase car'],
    states: 'all', // Note: Actual forms can be state-specific
    description: 'A document confirming the transfer of ownership of a vehicle from a seller to a buyer.',
    questions: [
        { id: 'buyer_name', label: 'What is the full name of the buyer?', placeholder: 'John Doe', required: true, type: 'text' },
        { id: 'buyer_address', label: 'What is the full address of the buyer?', placeholder: '456 Oak Ave, Townsville', required: true, type: 'textarea' },
        { id: 'seller_name', label: 'What is the full name of the seller?', placeholder: 'Jane Smith', required: true, type: 'text' },
        { id: 'seller_address', label: 'What is the full address of the seller?', placeholder: '789 Pine St, Cityville', required: true, type: 'textarea' },
        { id: 'vehicle_make', label: 'Vehicle Make', placeholder: 'e.g., Toyota', required: true, type: 'text' },
        { id: 'vehicle_model', label: 'Vehicle Model', placeholder: 'e.g., Camry', required: true, type: 'text' },
        { id: 'vehicle_year', label: 'Vehicle Year', placeholder: 'e.g., 2020', required: true, type: 'number' },
        { id: 'vehicle_vin', label: 'What is the Vehicle Identification Number (VIN)?', placeholder: '1HGCM82633A123456', required: true, type: 'text' },
        { id: 'vehicle_odometer', label: 'Odometer Reading at Sale', placeholder: 'e.g., 35000', required: true, type: 'number' },
        { id: 'sale_date', label: 'Date of Sale', required: true, type: 'date' },
        { id: 'sale_price', label: 'What is the agreed sale price ($)?', placeholder: 'e.g., 15000', required: true, type: 'number' },
        // { id: 'state', label: 'Which U.S. state is this sale taking place in?', type: 'select', options: usStates.map(s => ({ value: s.value, label: s.label })), required: true }, // Use already selected state?
        { id: 'as_is', label: 'Is the vehicle sold "as-is"?', type: 'select', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No, with warranties'}], required: true },
        { id: 'warranty_details', label: 'If warranties provided, describe them', type: 'textarea', placeholder: 'e.g., 30-day warranty on drivetrain', required: false },
    ]
  },
  {
    id: 'power-of-attorney-general',
    name: 'General Power of Attorney',
    aliases: ['POA', 'appoint agent', 'act on my behalf', 'financial decisions'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL'], // Example state specificity
    description: 'Authorizes an agent to handle a broad range of financial and legal matters on behalf of the principal.',
    questions: [
        { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
        { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
        { id: 'agentName', label: 'Agent\'s Full Name (Person receiving power)', type: 'text', required: true },
        { id: 'agentAddress', label: 'Agent\'s Full Address', type: 'textarea', required: true },
        { id: 'alternateAgentName', label: 'Alternate Agent\'s Full Name (Optional)', type: 'text' },
        { id: 'effectiveDate', label: 'When does this POA become effective?', type: 'select', options: [{value: 'immediately', label: 'Immediately'}, {value: 'incapacity', label: 'Upon my incapacity'}], required: true },
        { id: 'termination', label: 'Does this POA terminate upon incapacity (Durable)?', type: 'select', options: [{value: 'no', label: 'No (Durable POA)'}, {value: 'yes', label: 'Yes (Terminates)'}], required: true, stateSpecific: ['CA', 'NY'] }, // State specific wording might vary
    ]
  },
    {
    id: 'power-of-attorney-healthcare',
    name: 'Healthcare Power of Attorney',
    aliases: ['medical POA', 'healthcare proxy', 'advance directive', 'medical decisions'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL'], // Example state specificity
    description: 'Authorizes an agent to make healthcare decisions for the principal if they become incapacitated.',
    questions: [
        { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
        { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
        { id: 'agentName', label: 'Healthcare Agent\'s Full Name', type: 'text', required: true },
        { id: 'agentAddress', label: 'Healthcare Agent\'s Full Address', type: 'textarea', required: true },
        { id: 'alternateAgentName', label: 'Alternate Healthcare Agent\'s Full Name (Optional)', type: 'text' },
        { id: 'lifeSupportPreferences', label: 'Preferences regarding life support (Optional)', type: 'textarea', placeholder: 'e.g., I do/do not want artificial respiration...' },
    ]
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    aliases: ['contractor agreement', 'freelance contract', 'scope of work', 'consulting agreement'],
    states: 'all',
    description: 'A contract outlining the terms of service between a service provider and a client.',
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
    ]
  },
    {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    aliases: ['business partners', 'starting business together', 'partner roles'],
    states: 'all',
    description: 'Defines the terms, responsibilities, and profit/loss distribution for a business partnership.',
    questions: [
         { id: "partner1Name", label: "Partner 1 Full Name", type: "text", required: true, placeholder: "e.g., John Smith" },
         { id: "partner1Address", label: "Partner 1 Address", type: "textarea", required: true },
         { id: "partner2Name", label: "Partner 2 Full Name", type: "text", required: true, placeholder: "e.g., Alice Brown" },
         { id: "partner2Address", label: "Partner 2 Address", type: "textarea", required: true },
         { id: "partner3Name", label: "Partner 3 Full Name (Optional)", type: "text", placeholder: "e.g., Bob Green" },
         { id: "partner3Address", label: "Partner 3 Address (Optional)", type: "textarea" },
         { id: "businessName", label: "Partnership Business Name", type: "text", required: true, placeholder: "e.g., Acme Innovations LLC" },
         { id: "businessAddress", label: "Principal Business Address", type: "textarea", required: true },
         { id: "startDate", label: "Partnership Start Date", type: "date", required: true },
         { id: "capitalContributions", label: "Initial Capital Contributions (describe)", type: "textarea", required: true, placeholder: "e.g., Partner 1: $10,000 cash, Partner 2: Equipment valued at $5,000" },
         { id: "profitSplit", label: "Profit/Loss Sharing Arrangement", type: "textarea", required: true, placeholder: "e.g., 50/50 split after expenses, or based on capital contribution" },
         { id: "managementRoles", label: "Management Roles & Responsibilities", type: "textarea", placeholder: "e.g., Partner 1: Operations, Partner 2: Marketing. Major decisions require unanimous vote." },
         { id: "dissolutionTerms", label: "Terms for Dissolution/Partner Exit", type: "textarea", placeholder: "e.g., Buyout options, asset distribution procedure" },
    ]
  },
   {
    id: 'invoice-dispute-letter',
    name: 'Invoice Dispute Letter',
    aliases: ['dispute bill', 'incorrect charge', 'billing error'],
    states: 'all',
    description: 'A formal letter sent to contest charges on an invoice.',
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
    id: 'cease-and-desist-letter',
    name: 'Cease and Desist Letter',
    aliases: ['stop harassment', 'infringement notice', 'demand letter'],
    states: 'all',
    description: 'A formal demand for an individual or entity to stop a specific activity.',
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
    id: 'will-last-testament',
    name: 'Last Will and Testament',
    aliases: ['will', 'inheritance', 'distribute assets', 'executor'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL'], // Wills are highly state-specific
    description: 'A legal document outlining how a person\'s assets should be distributed after their death.',
    questions: [
        { id: 'testatorName', label: 'Your Full Name (Testator)', type: 'text', required: true },
        { id: 'testatorAddress', label: 'Your Full Address', type: 'textarea', required: true },
        { id: 'executorName', label: 'Executor Full Name', type: 'text', required: true },
        { id: 'executorAddress', label: 'Executor Address', type: 'textarea', required: true },
        { id: 'alternateExecutorName', label: 'Alternate Executor Full Name (Optional)', type: 'text' },
        { id: 'beneficiaries', label: 'Beneficiaries and Asset Distribution', type: 'textarea', required: true, placeholder: 'e.g., My house at 123 Main St to my daughter Jane Doe. My savings account to my son John Doe. Residue to...' },
        { id: 'guardianForMinors', label: 'Guardian for Minor Children (if applicable)', type: 'text', placeholder: 'Full name of guardian' },
    ]
  },
  // Add more document types here...
  {
    id: 'general-inquiry',
    name: 'General Inquiry',
    aliases: ['unsure', 'help', 'legal question', 'need advice'],
    states: 'all',
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
    const matchesAlias = doc.aliases.some(alias => lowerQuery.includes(alias.toLowerCase()));
    const stateMatch = !state || doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(state));
    return matchesAlias && stateMatch && doc.id !== 'general-inquiry'; // Exclude general inquiry from keyword match
  });
}
