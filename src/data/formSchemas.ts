// src/data/formSchemas.ts

export type FormField = {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  type: 'text' | 'select' | 'date' | 'number' | 'textarea' // Added textarea
  options?: {value: string, label: string}[] // Changed to object for select options
  tooltip?: string // NEW: optional hover hint
  helperText?: string // NEW: optional helper copy under the input
}

export type FormSchema = {
  [docType: string]: FormField[]
}

// Define US States for reuse
const usStatesOptions = [
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
    { value: 'Other', label: 'Other/Not Applicable' } // Added 'Other' option
]


export const formSchemas: FormSchema = {
  'Bill of Sale (Vehicle)': [ // Matched name from documentLibrary
    {
      id: 'buyer_name',
      label: 'Buyer\'s Full Name', // Clarified label
      placeholder: 'John Doe',
      required: true,
      type: 'text',
    },
    {
      id: 'buyer_address', // Added address field
      label: 'Buyer\'s Full Address',
      placeholder: '456 Oak Ave, Townsville, State 54321',
      required: true,
      type: 'textarea',
    },
    {
      id: 'seller_name',
      label: 'Seller\'s Full Name', // Clarified label
      placeholder: 'Jane Smith',
      required: true,
      type: 'text',
    },
     {
      id: 'seller_address', // Added address field
      label: 'Seller\'s Full Address',
      placeholder: '789 Pine St, Cityville, State 12345',
      required: true,
      type: 'textarea',
    },
    {
      id: 'item_description', // Made more specific
      label: 'Vehicle Description (Year, Make, Model)',
      placeholder: 'e.g., 2020 Toyota Camry',
      required: true,
      type: 'text',
    },
    {
      id: 'vehicle_vin', // Added VIN
      label: 'Vehicle Identification Number (VIN)',
      placeholder: '1HGCM82633A123456',
      required: true,
      type: 'text',
    },
    {
      id: 'vehicle_odometer', // Added Odometer
      label: 'Odometer Reading (miles)',
      placeholder: 'e.g., 35000',
      required: true,
      type: 'number',
    },
    {
      id: 'sale_price',
      label: 'Sale Price ($)', // Clarified label
      placeholder: 'e.g., 15000',
      required: true,
      type: 'number', // Changed to number for validation
    },
    {
      id: 'sale_date', // Added Sale Date
      label: 'Date of Sale',
      required: true,
      type: 'date',
    },
    {
      id: 'state',
      label: 'State of Sale', // Clarified label
      type: 'select',
      required: true,
      options: usStatesOptions.filter(opt => opt.value !== 'Other'), // Use defined options, exclude 'Other' if not desired
    },
     { id: 'as_is', label: 'Is the vehicle sold "as-is"?', type: 'select', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No, with warranties'}], required: true },
     { id: 'warranty_details', label: 'If warranties provided, describe them', type: 'textarea', placeholder: 'e.g., 30-day warranty on drivetrain', required: false }, // Conditionally required later
  ],

  'Residential Lease Agreement': [
    {
      id: 'landlord_name',
      label: 'Landlord\'s Full Name or Company', // Clarified
      required: true,
      type: 'text',
       placeholder: "e.g., Acme Property Management"
    },
    {
      id: 'tenant_name',
      label: 'Tenant\'s Full Name',
      required: true,
      type: 'text',
      placeholder: "e.g., Jane Doe"
    },
    {
      id: 'property_address',
      label: 'Full Property Address (incl. unit #)',
      required: true,
      type: 'textarea', // Changed to textarea for longer addresses
       placeholder: "e.g., 123 Main St, Unit 4B, Anytown, USA 12345"
    },
    {
      id: 'lease_start',
      label: 'Lease Start Date',
      required: true,
      type: 'date',
    },
    {
      id: 'lease_term', // Added lease term
      label: 'Lease Term (Months)',
      required: true,
      type: 'number',
      placeholder: 'e.g., 12'
    },
    {
      id: 'monthly_rent',
      label: 'Monthly Rent Amount ($)', // Clarified
      required: true,
      type: 'number', // Changed to number
      placeholder: "e.g., 1500"
    },
     {
      id: 'rent_due_date', // Added due date
      label: 'Rent Due Date (e.g., 1st of month)',
      required: true,
      type: 'text', // Could be number or text
       placeholder: "e.g., 1st"
    },
     {
      id: 'security_deposit', // Added security deposit
      label: 'Security Deposit Amount ($)',
      type: 'number', // Changed to number
      placeholder: "e.g., 1500"
    },
     {
      id: 'pets_allowed', // Added pets
      label: 'Are Pets Allowed?',
      type: 'select',
      required: true,
      options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}, {value: 'specific', label: 'Yes, with conditions'}],
    },
    {
      id: 'pet_conditions', // Conditional details for pets
      label: 'Pet Conditions (if allowed)',
      type: 'textarea',
      placeholder: 'e.g., One cat under 15 lbs allowed with $200 pet deposit.',
      required: false, // Make conditionally required based on pets_allowed
    },
     {
      id: 'late_fee_policy', // Added Late Fees
      label: 'Late Fee Policy (Optional)',
      type: 'textarea',
      placeholder: 'e.g., $50 fee if rent is more than 5 days late.',
      required: false,
    },
     {
      id: 'state', // Added State
      label: 'State Governing Lease',
      type: 'select',
      required: true,
      options: usStatesOptions.filter(opt => opt.value !== 'Other'),
    }
  ],

   // Add more schemas based on documentLibrary
  'Mutual Non-Disclosure Agreement (NDA)': [
       { id: "party1Name", label: "Party 1 Full Name/Company", type: "text", required: true },
       { id: "party1Address", label: "Party 1 Address", type: "textarea", required: true },
       { id: "party2Name", label: "Party 2 Full Name/Company", type: "text", required: true },
       { id: "party2Address", label: "Party 2 Address", type: "textarea", required: true },
       { id: "effectiveDate", label: "Effective Date of Agreement", type: "date", required: true },
       { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "e.g., Discussing potential business partnership, evaluating software" },
       { id: "confidentialInfoDescription", label: "Brief Description of Confidential Information", type: "textarea", placeholder: "e.g., Business plans, customer lists, source code" },
       { id: "termYears", label: "Term of Agreement (Years, 0 for indefinite)", type: "number", placeholder: "e.g., 3" },
   ],

   'Unilateral Non-Disclosure Agreement (NDA)': [
        { id: "disclosingPartyName", label: "Disclosing Party Full Name/Company", type: "text", required: true },
        { id: "disclosingPartyAddress", label: "Disclosing Party Address", type: "textarea", required: true },
        { id: "receivingPartyName", label: "Receiving Party Full Name/Company", type: "text", required: true },
        { id: "receivingPartyAddress", label: "Receiving Party Address", type: "textarea", required: true },
        { id: "effectiveDate", label: "Effective Date of Agreement", type: "date", required: true },
        { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "e.g., Evaluating potential investment, providing consulting services" },
        { id: "confidentialInfoDescription", label: "Brief Description of Confidential Information", type: "textarea", placeholder: "e.g., Financial projections, marketing strategies" },
        { id: "termYears", label: "Term of Obligation (Years, 0 for indefinite)", type: "number", placeholder: "e.g., 5" },
   ],

   // Add other schemas similarly...
   'General Power of Attorney': [
        { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
        { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
        { id: 'agentName', label: 'Agent\'s Full Name (Person receiving power)', type: 'text', required: true },
        { id: 'agentAddress', label: 'Agent\'s Full Address', type: 'textarea', required: true },
        { id: 'alternateAgentName', label: 'Alternate Agent\'s Full Name (Optional)', type: 'text' },
        { id: 'effectiveDateType', label: 'When does this POA become effective?', type: 'select', options: [{value: 'immediately', label: 'Immediately'}, {value: 'incapacity', label: 'Upon my incapacity'}], required: true },
        { id: 'isDurable', label: 'Is this a Durable POA (remains effective after incapacity)?', type: 'select', options: [{value: 'yes', label: 'Yes (Durable)'}, {value: 'no', label: 'No (Terminates on incapacity)'}], required: true },
        { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStatesOptions.filter(opt => ['CA', 'NY', 'TX', 'FL', 'IL', 'Other'].includes(opt.value)) } // Example limited states + Other
   ],
   'Healthcare Power of Attorney': [
       { id: 'principalName', label: 'Principal\'s Full Name (Person granting power)', type: 'text', required: true },
       { id: 'principalAddress', label: 'Principal\'s Full Address', type: 'textarea', required: true },
       { id: 'agentName', label: 'Healthcare Agent\'s Full Name', type: 'text', required: true },
       { id: 'agentAddress', label: 'Healthcare Agent\'s Full Address', type: 'textarea', required: true },
       { id: 'alternateAgentName', label: 'Alternate Healthcare Agent\'s Full Name (Optional)', type: 'text' },
       { id: 'lifeSupportPreferences', label: 'Preferences regarding life support (Optional)', type: 'textarea', placeholder: 'e.g., I do/do not want artificial respiration...' },
       { id: 'state', label: 'State Governing the POA', type: 'select', required: true, options: usStatesOptions.filter(opt => ['CA', 'NY', 'TX', 'FL', 'IL', 'Other'].includes(opt.value)) }
   ],
   'Service Agreement': [
        { id: 'clientName', label: 'Client Full Name/Company', type: 'text', required: true },
        { id: 'clientAddress', label: 'Client Address', type: 'textarea', required: true },
        { id: 'providerName', label: 'Service Provider Full Name/Company', type: 'text', required: true },
        { id: 'providerAddress', label: 'Service Provider Address', type: 'textarea', required: true },
        { id: 'serviceDescription', label: 'Description of Services to be Provided', type: 'textarea', required: true, placeholder: 'e.g., Web design, marketing consulting, writing services' },
        { id: 'startDate', label: 'Service Start Date', type: 'date', required: true },
        { id: 'endDate', label: 'Service End Date (Optional, for fixed term)', type: 'date' },
        { id: 'paymentTerms', label: 'Payment Amount and Terms', type: 'textarea', required: true, placeholder: 'e.g., $50/hour billed monthly, $1000 fixed fee upon completion' },
        { id: 'confidentialityClause', label: 'Include Confidentiality Clause?', type: 'select', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}], required: true },
        { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStatesOptions }
   ],
   'Partnership Agreement': [
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
         { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStatesOptions }
   ],
   'Invoice Dispute Letter': [
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
   ],
   'Cease and Desist Letter': [
        { id: 'senderName', label: 'Your Full Name/Company (Sender)', type: 'text', required: true },
        { id: 'senderAddress', label: 'Your Address', type: 'textarea', required: true },
        { id: 'recipientName', label: 'Recipient Full Name/Company', type: 'text', required: true },
        { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
        { id: 'activityToCease', label: 'Specific Activity Recipient Must Cease', type: 'textarea', required: true, placeholder: 'e.g., Using copyrighted material, making defamatory statements, trespassing' },
        { id: 'legalBasis', label: 'Legal Basis for Demand (Optional but recommended)', type: 'textarea', placeholder: 'e.g., Copyright infringement under Title 17 USC, defamation laws' },
        { id: 'deadlineForCompliance', label: 'Deadline for Compliance (e.g., 14 days)', type: 'text', placeholder: 'e.g., 14 days from the date of this letter' },
        { id: 'consequences', label: 'Consequences of Non-Compliance', type: 'textarea', placeholder: 'e.g., We will pursue legal action including seeking damages and injunctive relief' },
        { id: 'dateSent', label: 'Date Letter Sent', type: 'date', required: true },
   ],
    'Last Will and Testament': [
        { id: 'testatorName', label: 'Your Full Name (Testator)', type: 'text', required: true },
        { id: 'testatorAddress', label: 'Your Full Address', type: 'textarea', required: true },
        { id: 'executorName', label: 'Executor Full Name', type: 'text', required: true },
        { id: 'executorAddress', label: 'Executor Address', type: 'textarea', required: true },
        { id: 'alternateExecutorName', label: 'Alternate Executor Full Name (Optional)', type: 'text' },
        { id: 'beneficiaries', label: 'Beneficiaries and Asset Distribution', type: 'textarea', required: true, placeholder: 'e.g., My house at 123 Main St to my daughter Jane Doe. My savings account to my son John Doe. Residue to...' },
        { id: 'guardianForMinors', label: 'Guardian for Minor Children (if applicable)', type: 'text', placeholder: 'Full name of guardian' },
         { id: 'state', label: 'State Governing the Will', type: 'select', required: true, options: usStatesOptions.filter(opt => ['CA', 'NY', 'TX', 'FL', 'IL', 'Other'].includes(opt.value)) }
    ],
    'General Inquiry': [
       { id: "specificNeed", label: "Can you describe your legal need in more detail?", type: "textarea", required: true, placeholder: "e.g., What are you trying to achieve or protect?" },
       { id: "involvedParties", label: "Who are the main parties involved?", type: "text", placeholder: "e.g., Myself, my business partner, my landlord" },
       { id: "desiredOutcome", label: "What is your desired outcome?", type: "textarea", placeholder: "e.g., Get paid for work, stop someone from contacting me, formalize an agreement" },
       { id: 'state', label: 'Which U.S. state is relevant? (Optional)', type: 'select', options: usStatesOptions }
    ],
    // Add a default or fallback schema if needed
    'default': [
        { id: "details", label: "Please describe the situation", type: "textarea", required: true },
    ]
};

/* ─────────────────────────────────────────────────────────────────
   NEW form fields for high-demand templates added 2024-06
   ───────────────────────────────────────────────────────────────── */
/* ------------------------------------------------------------------ */
/*  HIGH‑DEMAND ADD‑ONS – drop these under the big `formSchemas`       */
/* ------------------------------------------------------------------ */
export const formSchemasAdditions: FormSchema = {
  /* ===== EMPLOYMENT ================================================= */
  'Employment Termination Letter': [
    { id: 'employerName',  label: 'Employer / Company Name',           type: 'text',     required: true },
    { id: 'employerAddress', label: 'Employer Address',                type: 'textarea', required: true },
    { id: 'employeeName',  label: 'Employee Full Name',                type: 'text',     required: true },
    { id: 'employeePosition', label: 'Position / Job Title',           type: 'text' },
    { id: 'terminationDate', label: 'Termination Effective Date',      type: 'date',     required: true },
    { id: 'terminationReason', label: 'Reason for Termination (brief)',type: 'textarea',
    { id: 'terminationDate', label: 'Termination Date', type: 'date', required: true },
    { id: 'companyName', label: 'Company Name', type: 'text', required: true },
    { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
    { id: 'reasonForTermination', label: 'Reason for Termination', type: 'select', options: [{ value: 'performance', label: 'Performance' }, { value: 'misconduct', label: 'Misconduct' }, { value: 'restructuring', label: 'Restructuring' }, { value: 'other', label: 'Other' }], required: true },
    { id: 'otherReasonDetails', label: 'Details of Other Reason', type: 'textarea', required: false },
    { id: 'severanceOffered', label: 'Severance Offered?', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], required: true },
    { id: 'severanceDetails', label: 'Severance Details (if applicable)', type: 'textarea', required: false, placeholder: 'e.g., 2 weeks pay, continued benefits' },
    { id: 'returnOfProperty', label: 'Return of Company Property?', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], required: true },
    { id: 'returnPropertyDetails', label: 'Details of Property to Return', type: 'textarea', required: false, placeholder: 'e.g., laptop, phone, badge' },
    { id: 'confidentialityObligations', label: 'Confidentiality Obligations?', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], required: true },
  ],
      placeholder: 'e.g. position eliminated, misconduct, performance' },
    { id: 'finalPayAmount', label: 'Final Pay Amount (USD)',           type: 'number',
      helperText: 'Include accrued PTO if applicable' },
    { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStatesOptions },
  ],

  'At‑Will Employment Agreement': [
    { id: 'employerName', label: 'Employer / Company Name',            type: 'text',     required: true },
    { id: 'employeeName', label: 'Employee Full Name', type: 'text', required: true },
    { id: 'position', label: 'Position / Job Title', type: 'text', required: true },
    { id: 'position',     label: 'Position / Job Title',               type: 'text',     required: true },
    { id: 'startDate',    label: 'Employment Start Date',              type: 'date',     required: true },
    { id: 'compensation', label: 'Compensation (USD, per hour / year)',type: 'text',
      placeholder: 'e.g. $25 per hour or $60 000 annual' },
    { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStatesOptions },
  ],

  'Employee Non‑Compete Agreement': [
    { id: 'employerName',   label: 'Employer / Company Name',          type: 'text',     required: true },
    { id: 'employeeName',   label: 'Employee Full Name',               type: 'text',     required: true },
    { id: 'effectiveDate',  label: 'Agreement Effective Date',        type: 'date',     required: true },
    { id: 'durationMonths', label: 'Restriction Duration (months)',   type: 'number',   required: true,
      tooltip: 'Typical range 6‑24 months' },
    { id: 'restrictedTerritory', label: 'Restricted Territory',       type: 'text',
      placeholder: 'e.g. 50 mile radius, entire USA' },
    { id: 'scope',          label: 'Scope of Restricted Activities',  type: 'textarea',
      helperText: 'Describe competing services / roles to be avoided' },
    { id: 'consideration',  label: 'Consideration (if any)',          type: 'textarea',
      placeholder: 'e.g. $1 000, promotion, access to trade secrets' },
    { id: 'state',          label: 'Governing State Law',             type: 'select',   required: true,
      options: usStatesOptions },
  ],
  'Employee Handbook Template': [
    { id: 'companyName', label: 'Company Name', type: 'text', required: true },
    { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
    { id: 'introduction', label: 'Introduction Text (Optional)', type: 'textarea' },
    { id: 'equalOpportunityPolicy', label: 'Equal Opportunity Policy', type: 'textarea', required: true, placeholder: 'e.g., We are an equal opportunity employer.' },
    { id: 'codeOfConduct', label: 'Code of Conduct', type: 'textarea', required: true },
    { id: 'attendancePolicy', label: 'Attendance Policy', type: 'textarea', required: true },
    { id: 'benefitsOverview', label: 'Benefits Overview', type: 'textarea' },
    { id: 'disciplinaryProcedure', label: 'Disciplinary Procedure', type: 'textarea' },
    { id: 'state', label: 'Governing State Law', type: 'select', required: true, options: usStatesOptions },
  ],
  'Website Privacy Policy': [
    { id: 'websiteName', label: 'Website Name', type: 'text', required: true },
    { id: 'websiteUrl', label: 'Website URL', type: 'text', required: true },
    { id: 'companyName', label: 'Company Name', type: 'text', required: true },
    { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
    { id: 'dataCollection', label: 'Data Collection Description', type: 'textarea', required: true, placeholder: 'e.g., We collect your name, email, and IP address.' },
    { id: 'dataUse', label: 'Data Use Description', type: 'textarea', required: true, placeholder: 'e.g., We use your data to personalize your experience and send you updates.' },
    { id: 'dataSharing', label: 'Data Sharing Description', type: 'textarea', placeholder: 'e.g., We do not share your data with third parties.' },
    { id: 'dataSecurity', label: 'Data Security Measures', type: 'textarea', placeholder: 'e.g., We use encryption and secure servers.' },
    { id: 'cookieUse', label: 'Cookie Use Description', type: 'textarea', required: true, placeholder: 'e.g., We use cookies to improve your experience.' },
    { id: 'userRights', label: 'User Rights Description', type: 'textarea', placeholder: 'e.g., You have the right to access and delete your data.' },
  ],
  'Website Terms of Service': [
    { id: 'websiteName', label: 'Website Name', type: 'text', required: true },
    { id: 'websiteUrl', label: 'Website URL', type: 'text', required: true },
    { id: 'companyName', label: 'Company Name', type: 'text', required: true },
    { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
    { id: 'userConduct', label: 'User Conduct Guidelines', type: 'textarea', required: true, placeholder: 'e.g., No illegal activity, no spam.' },
    { id: 'intellectualProperty', label: 'Intellectual Property Description', type: 'textarea', required: true, placeholder: 'e.g., All content is our property.' },
    { id: 'disclaimerOfWarranty', label: 'Disclaimer of Warranty', type: 'textarea', required: true },
    { id: 'limitationOfLiability', label: 'Limitation of Liability', type: 'textarea', required: true },
    { id: 'governingLaw', label: 'Governing Law (State)', type: 'select', required: true, options: usStatesOptions },
  ],
  'GDPR Data-Processing Addendum': [
    { id: 'controllerName', label: 'Controller Name (Your Company)', type: 'text', required: true },
    { id: 'controllerAddress', label: 'Controller Address', type: 'textarea', required: true },
    { id: 'processorName', label: 'Processor Name (Third Party)', type: 'text', required: true },
    { id: 'processorAddress', label: 'Processor Address', type: 'textarea', required: true },
    { id: 'dataProtectionOfficer', label: 'Data Protection Officer (Optional)', type: 'text' },
    { id: 'dataDescription', label: 'Description of Personal Data', type: 'textarea', required: true, placeholder: 'e.g., User names, emails, IP addresses' },
    { id: 'processingActivities', label: 'Description of Processing Activities', type: 'textarea', required: true, placeholder: 'e.g., Data storage, analytics, email marketing' },
    { id: 'securityMeasures', label: 'Security Measures', type: 'textarea', required: true, placeholder: 'e.g., Encryption, access controls, secure servers' },
    { id: 'dataBreachNotification', label: 'Data Breach Notification Procedure', type: 'textarea', required: true },
    { id: 'dataTransfers', label: 'Cross-Border Data Transfer', type: 'textarea', placeholder: 'e.g., Data may be transferred to the US' },
  ],
  'Cookie Banner & Preference Text': [
    { id: 'websiteName', label: 'Website Name', type: 'text', required: true },
    { id: 'bannerText', label: 'Cookie Banner Text', type: 'textarea', required: true, placeholder: 'e.g., We use cookies to enhance your experience...' },
    { id: 'functionalCookieDescription', label: 'Description of Functional Cookies', type: 'textarea', required: true, placeholder: 'e.g., These cookies enable core functionality...' },
    { id: 'analyticsCookieDescription', label: 'Description of Analytics Cookies', type: 'textarea', required: true, placeholder: 'e.g., These cookies help us understand how you use our site...' },
    { id: 'marketingCookieDescription', label: 'Description of Marketing Cookies', type: 'textarea', placeholder: 'e.g., These cookies are used to deliver targeted ads...' },
    { id: 'cookiePreferencesLink', label: 'Link to Cookie Preferences', type: 'text', placeholder: 'e.g., /cookie-preferences' },
  ],
};
/* ─────────────────────────────────────────────────────────────────
   NEW form fields for high-demand templates added 2024-06
   ───────────────────────────────────────────────────────────────── */

/* ──── AUTO‑ADDED “MINIMUM VIABLE” SCHEMAS ──── */

const generic = (placeholder = 'Enter details here…') => [
  { id: 'details', label: 'Key details', type: 'textarea', placeholder, required: true }
];

// Employment
formSchemas['Employee Non‑Compete Agreement']        = generic();
formSchemas['Employee Handbook (Template)']          = generic();
formSchemas['Employment Termination Letter']         = [
  { id: 'employeeName', label: 'Employee Full Name', type: 'text', required: true },
  { id: 'lastDay', label: 'Last Day of Employment', type: 'date', required: true },
  { id: 'reason', label: 'Reason (optional)', type: 'textarea' }
];
formSchemas['At‑Will Employment Agreement']          = [
  { id: 'employeeName', label: 'Employee Full Name', type: 'text', required: true },
  { id: 'position',     label: 'Position / Title',   type: 'text', required: true },
  { id: 'startDate',    label: 'Start Date',         type: 'date', required: true }
];

// Website / Online business
formSchemas['Website Privacy Policy']                = generic('What kinds of data do you collect?');
formSchemas['Website Terms of Service']              = generic();
formSchemas['GDPR Data‑Processing Addendum']         = generic('Controller + Processor names');
formSchemas['Cookie‑Banner Text']                    = generic('Site name & cookies used');

// Real‑estate purchase & addenda
formSchemas['Real‑Estate Purchase & Sale Agreement'] = generic('Property address, price, closing date');
formSchemas['Land Contract (Installment Sale)']      = generic('Property, term, balloon payment');
formSchemas['Lease Addendum – Smoking Policy']       = generic('Allowed / prohibited areas');
formSchemas['Lease Addendum – Pets']                 = generic('Species, weight limits, deposits');
formSchemas['Lease Addendum – Furnishings Inventory']= generic('List furniture & appliances');
formSchemas['Roommate Agreement']                    = generic('Rent split, chores, quiet hours');

// Finance
formSchemas['Bill of Sale (Personal Property)']      = generic('Describe the item sold');
formSchemas['Installment Promissory Note']           = generic('Principal, interest, payment schedule');
formSchemas['Debt Settlement Letter']                = generic('Debt amount, settlement offer');

// Family
formSchemas['Post‑Nuptial Agreement']                = generic('Assets & debts to be covered');
formSchemas['Separation Agreement']                  = generic('Property, support, custody');
formSchemas['Travel Consent for Minor']              = generic('Child, destination, guardians');
formSchemas['Pet Custody Agreement']                 = generic('Pet name, visitation');

// IP / Creative
formSchemas['Copyright Transfer Agreement']          = generic('Work title & transfer terms');
formSchemas['Model Release']                         = generic('Model name, usage');
formSchemas['Photo License Agreement']               = generic('Image description, license scope');

// Corporate
formSchemas['Corporate Bylaws']                      = generic('Corporation name & state');
formSchemas['Board Resolution']                      = generic('Resolution text');
formSchemas['Corporate Meeting Minutes']             = generic('Meeting date & decisions');
formSchemas['Stock Purchase Agreement']              = generic('Shares, price, closing date');
/* ─────────────────────────────────────────────────────────────────
   NEW second wave of form fields for high-demand templates 2024-06
   ───────────────────────────────────────────────────────────────── */
export const formSchemasAdditions2: FormSchema = {
    'Promissory Note': [
        { id: 'lenderName', label: 'Lender Name', type: 'text', required: true },
        { id: 'borrowerName', label: 'Borrower Name', type: 'text', required: true },
        { id: 'principalAmount', label: 'Loan Amount ($)', type: 'number', required: true },
        { id: 'interestRate', label: 'Interest Rate (%)', type: 'number' },
        { id: 'repaymentTerms', label: 'Repayment Terms', type: 'textarea', required: true },
    ]
    // add more...

}
/* -------------------------------------------------------------------
   MERGE HELPER (concatenate your baseline with additions)
   ------------------------------------------------------------------- */
/**
 * A utility function that merges two `FormSchema` objects together.
 * It iterates through the properties of `schemaToAdd`, and for each property:
 * - If the property does not exist in `baseSchema`, it's directly added.
 * - If the property exists in `baseSchema`, it is merged by concatenating the arrays.
 *
 * This approach safely adds new schemas and extends existing ones without directly mutating the `baseSchema`.
 *
 * @param {FormSchema} baseSchema - The baseline form schemas to be extended.
 * @param {FormSchema} schemaToAdd - The additional form schemas to be added.
 * @returns {FormSchema} A new `FormSchema` that is a merge of the two inputs.
 */
export function mergeFormSchemas(baseSchema: FormSchema, schemaToAdd: FormSchema): FormSchema {
  const mergedSchemas: FormSchema = { ...baseSchema }; // clone

  for (const docType in schemaToAdd) {
    if (!mergedSchemas[docType]) {
      // Does not exist: Add the new key
      mergedSchemas[docType] = schemaToAdd[docType];
    } else {
      // Exists: Append to array
      mergedSchemas[docType] = [
        ...(mergedSchemas[docType] ?? []),
        ...schemaToAdd[docType],
      ];
    }
  }

  return mergedSchemas;
}

// Use it like this:
// export const allFormSchemas = mergeFormSchemas(mergeFormSchemas(formSchemas, formSchemasAdditions), formSchemasAdditions2)
