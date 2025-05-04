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
// Expanded with more document types.
export const documentLibrary: LegalDocument[] = [
  // Existing Documents
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
        { id: 'effectiveDateType', label: 'When does this POA become effective?', type: 'select', options: [{value: 'immediately', label: 'Immediately'}, {value: 'incapacity', label: 'Upon my incapacity'}], required: true },
        { id: 'isDurable', label: 'Is this a Durable POA (remains effective after incapacity)?', type: 'select', options: [{value: 'yes', label: 'Yes (Durable)'}, {value: 'no', label: 'No (Terminates on incapacity)'}], required: true, stateSpecific: ['CA', 'NY'] }, // Example state-specific question
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
  // New Document Types Added
  {
    id: 'divorce-petition',
    name: 'Divorce Petition',
    aliases: ['file for divorce', 'dissolution of marriage', 'start divorce'],
    states: 'all', // Highly state-specific, placeholder for now
    description: 'The initial document filed with the court to begin a divorce proceeding.',
    questions: [
      { id: 'petitionerName', label: 'Petitioner Full Name', type: 'text', required: true },
      { id: 'respondentName', label: 'Respondent Full Name', type: 'text', required: true },
      { id: 'marriageDate', label: 'Date of Marriage', type: 'date', required: true },
      { id: 'separationDate', label: 'Date of Separation', type: 'date', required: true },
      { id: 'childrenInfo', label: 'Names and Birthdates of Minor Children (if any)', type: 'textarea', placeholder: 'e.g., Child 1: Name, DOB; Child 2: Name, DOB' },
      { id: 'groundsForDivorce', label: 'Grounds for Divorce (Consult state laws)', type: 'textarea', required: true, placeholder: 'e.g., Irreconcilable differences' },
      { id: 'reliefSought', label: 'Relief Sought (e.g., Custody, property division, support)', type: 'textarea', placeholder: 'e.g., Sole custody, division of assets, spousal support' },
    ]
  },
  {
    id: 'separation-agreement',
    name: 'Separation Agreement',
    aliases: ['legal separation', 'separate finances', 'marital separation agreement'],
    states: 'all', // Highly state-specific, placeholder for now
    description: 'An agreement between spouses detailing terms of separation, including property, support, and custody.',
    questions: [
      { id: 'spouse1Name', label: 'Spouse 1 Full Name', type: 'text', required: true },
      { id: 'spouse2Name', label: 'Spouse 2 Full Name', type: 'text', required: true },
      { id: 'separationDate', label: 'Date of Separation', type: 'date', required: true },
      { id: 'propertyDivision', label: 'Agreement on Division of Marital Property', type: 'textarea', required: true, placeholder: 'e.g., Spouse 1 retains house, Spouse 2 retains car...' },
      { id: 'debtDivision', label: 'Agreement on Division of Marital Debt', type: 'textarea', required: true, placeholder: 'e.g., Spouse 1 responsible for mortgage, Spouse 2 for credit card...' },
      { id: 'spousalSupport', label: 'Agreement on Spousal Support (Alimony)', type: 'textarea', placeholder: 'e.g., Spouse 1 pays Spouse 2 $X per month for Y years, or waived.' },
      { id: 'childCustody', label: 'Agreement on Child Custody (if applicable)', type: 'textarea', placeholder: 'e.g., Joint legal custody, primary physical custody with Spouse 1...' },
      { id: 'childSupport', label: 'Agreement on Child Support (if applicable)', type: 'textarea', placeholder: 'e.g., Spouse 2 pays Spouse 1 $X per month per child...' },
    ]
  },
   {
    id: 'child-custody-agreement',
    name: 'Child Custody Agreement',
    aliases: ['parenting plan', 'custody arrangement', 'visitation schedule'],
    states: 'all', // Highly state-specific, placeholder for now
    description: 'Outlines legal and physical custody arrangements for minor children between parents.',
    questions: [
      { id: 'parent1Name', label: 'Parent 1 Full Name', type: 'text', required: true },
      { id: 'parent2Name', label: 'Parent 2 Full Name', type: 'text', required: true },
      { id: 'childNamesDOB', label: 'Full Names and Dates of Birth of Children', type: 'textarea', required: true, placeholder: 'Child 1: Name, DOB; Child 2: Name, DOB' },
      { id: 'legalCustody', label: 'Legal Custody Arrangement', type: 'select', options: [{ value: 'joint', label: 'Joint' }, { value: 'soleParent1', label: 'Sole to Parent 1' }, { value: 'soleParent2', label: 'Sole to Parent 2' }], required: true },
      { id: 'physicalCustody', label: 'Primary Physical Custody', type: 'select', options: [{ value: 'joint', label: 'Joint/Shared' }, { value: 'parent1', label: 'Parent 1' }, { value: 'parent2', label: 'Parent 2' }], required: true },
      { id: 'visitationSchedule', label: 'Detailed Visitation Schedule', type: 'textarea', required: true, placeholder: 'e.g., Parent 2 has children alternating weekends, holidays divided...' },
      { id: 'decisionMaking', label: 'Major Decision-Making Authority (Health, Education, Religion)', type: 'textarea', placeholder: 'e.g., Both parents must agree, Parent 1 has final say...' },
    ]
  },
   {
    id: 'affidavit',
    name: 'Affidavit',
    aliases: ['sworn statement', 'statement under oath', 'testify in writing'],
    states: 'all',
    description: 'A written statement confirmed by oath or affirmation, for use as evidence in court or other legal proceedings.',
    questions: [
      { id: 'affiantName', label: 'Your Full Name (Affiant)', type: 'text', required: true },
      { id: 'affiantAddress', label: 'Your Full Address', type: 'textarea', required: true },
      { id: 'statement', label: 'Statement of Facts (must be truthful)', type: 'textarea', required: true, placeholder: 'Describe the events or facts you are attesting to clearly and concisely.' },
      { id: 'jurisdiction', label: 'Court/Jurisdiction (if applicable)', type: 'text', placeholder: 'e.g., Superior Court of California, County of Los Angeles' },
      { id: 'caseNumber', label: 'Case Number (if applicable)', type: 'text' },
      // Note: Requires notarization - this template can only prepare the text.
    ]
  },
   {
    id: 'living-will',
    name: 'Living Will / Advance Directive',
    aliases: ['medical directive', 'end of life care', 'healthcare instructions'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL'], // Highly state-specific
    description: 'Specifies your wishes regarding medical treatment if you are unable to communicate them yourself.',
    questions: [
      { id: 'yourName', label: 'Your Full Name', type: 'text', required: true },
      { id: 'yourAddress', label: 'Your Full Address', type: 'textarea', required: true },
      { id: 'lifeSupport', label: 'Preferences on Life-Sustaining Treatment (e.g., CPR, ventilators)', type: 'textarea', required: true, placeholder: 'e.g., I do/do not want CPR...' },
      { id: 'tubeFeeding', label: 'Preferences on Artificial Nutrition/Hydration (Tube Feeding)', type: 'textarea', required: true, placeholder: 'e.g., I do/do not want artificial nutrition...' },
      { id: 'painRelief', label: 'Preferences on Palliative Care/Pain Relief', type: 'textarea', placeholder: 'e.g., I want all measures taken for comfort, even if it hastens end of life.' },
      { id: 'otherWishes', label: 'Other Specific Wishes or Instructions', type: 'textarea' },
      // Note: Often combined with Healthcare POA. Witness/notary requirements vary by state.
    ]
  },
   {
    id: 'employment-offer-letter',
    name: 'Employment Offer Letter',
    aliases: ['job offer', 'offer of employment', 'hiring letter'],
    states: 'all',
    description: 'A formal offer of employment outlining key terms and conditions.',
    questions: [
      { id: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
      { id: 'candidateName', label: 'Candidate Full Name', type: 'text', required: true },
      { id: 'candidateAddress', label: 'Candidate Address', type: 'textarea', required: true },
      { id: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'startDate', label: 'Employment Start Date', type: 'date', required: true },
      { id: 'salary', label: 'Annual Salary or Hourly Rate', type: 'text', required: true, placeholder: 'e.g., $80,000 per year or $40 per hour' },
      { id: 'employmentType', label: 'Employment Type', type: 'select', options: [{ value: 'full-time', label: 'Full-Time' }, { value: 'part-time', label: 'Part-Time' }, { value: 'contract', label: 'Contract' }], required: true },
      { id: 'reportingTo', label: 'Reporting Manager/Title (Optional)', type: 'text' },
      { id: 'benefitsSummary', label: 'Brief Summary of Benefits (Optional)', type: 'textarea', placeholder: 'e.g., Health insurance, 401(k), paid time off...' },
      { id: 'offerExpirationDate', label: 'Offer Expiration Date', type: 'date', required: true },
    ]
  },
   {
    id: 'promissory-note',
    name: 'Promissory Note',
    aliases: ['loan agreement', 'IOU', 'borrow money', 'lend money'],
    states: 'all',
    description: 'A written promise by one party (the borrower) to pay a specified sum of money to another party (the lender).',
    questions: [
      { id: 'borrowerName', label: 'Borrower Full Name', type: 'text', required: true },
      { id: 'borrowerAddress', label: 'Borrower Address', type: 'textarea', required: true },
      { id: 'lenderName', label: 'Lender Full Name', type: 'text', required: true },
      { id: 'lenderAddress', label: 'Lender Address', type: 'textarea', required: true },
      { id: 'principalAmount', label: 'Principal Loan Amount ($)', type: 'number', required: true },
      { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'e.g., 5 (enter 0 if no interest)' },
      { id: 'loanDate', label: 'Date of Loan', type: 'date', required: true },
      { id: 'repaymentTerms', label: 'Repayment Terms', type: 'textarea', required: true, placeholder: 'e.g., Lump sum due on MM/DD/YYYY, or $X monthly payments starting MM/DD/YYYY' },
      { id: 'lateFee', label: 'Late Fee Provision (Optional)', type: 'text', placeholder: 'e.g., $25 fee for payments over 10 days late' },
    ]
  },
   {
    id: 'loan-agreement',
    name: 'Loan Agreement',
    aliases: ['formal loan', 'secured loan', 'unsecured loan', 'borrowing terms'],
    states: 'all',
    description: 'A more detailed contract specifying the terms and conditions of a loan between a lender and borrower.',
    questions: [
      // Similar to Promissory Note but potentially more detail
      { id: 'borrowerName', label: 'Borrower Full Name/Entity', type: 'text', required: true },
      { id: 'borrowerAddress', label: 'Borrower Address', type: 'textarea', required: true },
      { id: 'lenderName', label: 'Lender Full Name/Entity', type: 'text', required: true },
      { id: 'lenderAddress', label: 'Lender Address', type: 'textarea', required: true },
      { id: 'principalAmount', label: 'Principal Loan Amount ($)', type: 'number', required: true },
      { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'e.g., 5 (0 for none)' },
      { id: 'loanDate', label: 'Date Loan Disbursed', type: 'date', required: true },
      { id: 'repaymentSchedule', label: 'Detailed Repayment Schedule', type: 'textarea', required: true, placeholder: 'e.g., Monthly payments of $X starting MM/DD/YYYY for Y months.' },
      { id: 'security', label: 'Is the loan secured by collateral?', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No (Unsecured)' }], required: true },
      { id: 'collateralDescription', label: 'If secured, describe collateral', type: 'textarea', placeholder: 'e.g., 2022 Honda Civic VIN:...' },
      { id: 'defaultTerms', label: 'Conditions of Default', type: 'textarea', placeholder: 'e.g., Failure to make payment within 30 days of due date.' },
      { id: 'governingLaw', label: 'Governing State Law', type: 'select', options: usStates.map(s => ({ value: s.value, label: s.label })), required: true },
    ]
  },
   {
    id: 'prenuptial-agreement',
    name: 'Prenuptial Agreement',
    aliases: ['prenup', 'before marriage agreement', 'protect assets marriage'],
    states: 'all', // Highly state-specific, complex
    description: 'A contract entered into prior to marriage, outlining the division of assets and spousal support in case of divorce.',
    questions: [
        { id: 'party1Name', label: 'Party 1 Full Name', type: 'text', required: true },
        { id: 'party2Name', label: 'Party 2 Full Name', type: 'text', required: true },
        { id: 'separateProperty1', label: 'Party 1 Separate Property Disclosure', type: 'textarea', required: true, placeholder: 'List major assets owned before marriage (e.g., house, investments)' },
        { id: 'separateProperty2', label: 'Party 2 Separate Property Disclosure', type: 'textarea', required: true, placeholder: 'List major assets owned before marriage' },
        { id: 'maritalPropertyDefinition', label: 'Definition of Marital/Community Property', type: 'textarea', placeholder: 'e.g., Assets acquired during marriage, excluding gifts/inheritance...' },
        { id: 'propertyDivisionOnDivorce', label: 'Agreement on Property Division Upon Divorce', type: 'textarea', required: true, placeholder: 'e.g., Each party retains separate property, marital property divided 50/50...' },
        { id: 'spousalSupportWaiver', label: 'Spousal Support (Alimony) Agreement/Waiver', type: 'textarea', placeholder: 'e.g., Both parties waive rights to alimony, or specify terms.' },
        // Note: Requires independent legal counsel for each party usually. Very complex.
    ]
  },
  {
    id: 'cohabitation-agreement',
    name: 'Cohabitation Agreement',
    aliases: ['living together agreement', 'unmarried partners contract', 'domestic partnership agreement'],
    states: 'all', // State laws vary significantly
    description: 'A contract for unmarried couples living together, outlining property rights and financial responsibilities.',
    questions: [
      { id: 'partner1Name', label: 'Partner 1 Full Name', type: 'text', required: true },
      { id: 'partner2Name', label: 'Partner 2 Full Name', type: 'text', required: true },
      { id: 'sharedResidenceAddress', label: 'Shared Residence Address', type: 'textarea', required: true },
      { id: 'separateProperty1', label: 'Partner 1 Separate Property', type: 'textarea', placeholder: 'List significant assets owned individually.' },
      { id: 'separateProperty2', label: 'Partner 2 Separate Property', type: 'textarea', placeholder: 'List significant assets owned individually.' },
      { id: 'jointProperty', label: 'Agreement on Jointly Acquired Property', type: 'textarea', placeholder: 'e.g., How will property bought together be titled and divided upon separation?' },
      { id: 'expenseSharing', label: 'Agreement on Sharing Household Expenses', type: 'textarea', placeholder: 'e.g., Rent split 50/50, utilities based on usage...' },
      { id: 'supportUponSeparation', label: 'Agreement Regarding Financial Support Upon Separation (Optional)', type: 'textarea', placeholder: 'e.g., Palimony waiver or specific terms.' },
    ]
  },
   {
    id: 'eviction-notice',
    name: 'Eviction Notice',
    aliases: ['notice to quit', 'notice to vacate', 'evict tenant'],
    states: 'all', // Highly state-specific procedures/timelines
    description: 'A formal notice from a landlord to a tenant demanding they vacate the property.',
    questions: [
      { id: 'landlordName', label: 'Landlord Full Name/Company', type: 'text', required: true },
      { id: 'tenantName', label: 'Tenant Full Name(s)', type: 'text', required: true },
      { id: 'propertyAddress', label: 'Full Property Address', type: 'textarea', required: true },
      { id: 'reasonForEviction', label: 'Reason for Eviction', type: 'textarea', required: true, placeholder: 'e.g., Non-payment of rent, violation of lease terms (specify), end of lease term' },
      { id: 'noticePeriodDays', label: 'Notice Period (Days - Consult State Law)', type: 'number', required: true, placeholder: 'e.g., 3, 30, 60' },
      { id: 'dateNoticeServed', label: 'Date Notice Served to Tenant', type: 'date', required: true },
      { id: 'rentDue', label: 'If for non-payment, amount due ($) and period', type: 'text', placeholder: 'e.g., $1500 for June 2024 rent' },
      { id: 'cureOpportunity', label: 'Opportunity to Cure (if applicable)', type: 'textarea', placeholder: 'e.g., Tenant must pay rent due within X days to avoid eviction.' },
    ]
  },
   {
    id: 'non-compete-agreement',
    name: 'Non-Compete Agreement',
    aliases: ['non-competition clause', 'restrictive covenant'],
    states: ['TX', 'FL', 'GA'], // Enforceability varies greatly by state (e.g., CA largely prohibits)
    description: 'An agreement where an employee promises not to work for competing businesses for a certain period after leaving.',
    questions: [
      { id: 'employerName', label: 'Employer/Company Name', type: 'text', required: true },
      { id: 'employeeName', label: 'Employee Full Name', type: 'text', required: true },
      { id: 'restrictedActivities', label: 'Description of Restricted Activities/Business', type: 'textarea', required: true, placeholder: 'e.g., Providing software development services to direct competitors...' },
      { id: 'restrictedTerritory', label: 'Geographic Area of Restriction', type: 'text', required: true, placeholder: 'e.g., Within 50 miles of Austin, TX; State of Florida' },
      { id: 'restrictedPeriod', label: 'Duration of Restriction (Months/Years)', type: 'text', required: true, placeholder: 'e.g., 12 months after termination' },
      { id: 'consideration', label: 'Consideration Provided (What employee gets in return)', type: 'text', required: true, placeholder: 'e.g., Continued employment, specific bonus' },
    ]
  },
  // Fallback / Default
  {
    id: 'general-inquiry',
    name: 'General Inquiry',
    aliases: ['unsure', 'help', 'legal question', 'need advice', 'other'],
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

    