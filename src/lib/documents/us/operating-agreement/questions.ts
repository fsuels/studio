import type { Question } from '@/types/documents';

export const operatingAgreementQuestions: Question[] = [
  // === STEP 1: BASIC COMPANY INFO ===
  {
    id: 'company_name',
    label: "What is your LLC's legal name?",
    type: 'text',
    required: true,
    placeholder: 'e.g., Smith & Associates LLC',
    tooltip:
      'This must exactly match the name filed with your state. Include "LLC" or "Limited Liability Company"',
    section: 'Company Basics',
  },
  {
    id: 'state_of_formation',
    label: 'In which state is your LLC registered?',
    type: 'select',
    required: true,
    options: [
      { value: 'Alabama', label: 'Alabama' },
      { value: 'Alaska', label: 'Alaska' },
      { value: 'Arizona', label: 'Arizona' },
      { value: 'Arkansas', label: 'Arkansas' },
      { value: 'California', label: 'California' },
      { value: 'Colorado', label: 'Colorado' },
      { value: 'Connecticut', label: 'Connecticut' },
      { value: 'Delaware', label: 'Delaware' },
      { value: 'Florida', label: 'Florida' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Hawaii', label: 'Hawaii' },
      { value: 'Idaho', label: 'Idaho' },
      { value: 'Illinois', label: 'Illinois' },
      { value: 'Indiana', label: 'Indiana' },
      { value: 'Iowa', label: 'Iowa' },
      { value: 'Kansas', label: 'Kansas' },
      { value: 'Kentucky', label: 'Kentucky' },
      { value: 'Louisiana', label: 'Louisiana' },
      { value: 'Maine', label: 'Maine' },
      { value: 'Maryland', label: 'Maryland' },
      { value: 'Massachusetts', label: 'Massachusetts' },
      { value: 'Michigan', label: 'Michigan' },
      { value: 'Minnesota', label: 'Minnesota' },
      { value: 'Mississippi', label: 'Mississippi' },
      { value: 'Missouri', label: 'Missouri' },
      { value: 'Montana', label: 'Montana' },
      { value: 'Nebraska', label: 'Nebraska' },
      { value: 'Nevada', label: 'Nevada' },
      { value: 'New Hampshire', label: 'New Hampshire' },
      { value: 'New Jersey', label: 'New Jersey' },
      { value: 'New Mexico', label: 'New Mexico' },
      { value: 'New York', label: 'New York' },
      { value: 'North Carolina', label: 'North Carolina' },
      { value: 'North Dakota', label: 'North Dakota' },
      { value: 'Ohio', label: 'Ohio' },
      { value: 'Oklahoma', label: 'Oklahoma' },
      { value: 'Oregon', label: 'Oregon' },
      { value: 'Pennsylvania', label: 'Pennsylvania' },
      { value: 'Rhode Island', label: 'Rhode Island' },
      { value: 'South Carolina', label: 'South Carolina' },
      { value: 'South Dakota', label: 'South Dakota' },
      { value: 'Tennessee', label: 'Tennessee' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Utah', label: 'Utah' },
      { value: 'Vermont', label: 'Vermont' },
      { value: 'Virginia', label: 'Virginia' },
      { value: 'Washington', label: 'Washington' },
      { value: 'West Virginia', label: 'West Virginia' },
      { value: 'Wisconsin', label: 'Wisconsin' },
      { value: 'Wyoming', label: 'Wyoming' },
    ],
    tooltip: 'This is the state where you filed your Articles of Organization',
    section: 'Company Basics',
  },
  {
    id: 'business_purpose',
    label: "What is your LLC's primary business purpose?",
    type: 'textarea',
    required: true,
    placeholder: 'e.g., Providing consulting services for small businesses',
    tooltip:
      'Describe the main activities your LLC will engage in. Be specific but not overly restrictive.',
    section: 'Company Basics',
  },

  // === STEP 2: KEY DATES ===
  {
    id: 'effective_date',
    label: 'When should this operating agreement take effect?',
    type: 'date',
    required: true,
    tooltip:
      "This is typically today's date or the date you want the agreement to begin",
    section: 'Important Dates',
  },
  {
    id: 'articles_filing_date',
    label: 'When were your Articles of Organization filed?',
    type: 'date',
    required: true,
    tooltip: 'This is the date your LLC was officially formed with the state',
    section: 'Important Dates',
  },

  // === STEP 3: ADDRESSES ===
  {
    id: 'principal_office_address',
    label: "What is your LLC's main business address?",
    type: 'address',
    required: true,
    placeholder: 'Enter your primary business location',
    tooltip: 'This is where your LLC conducts its main business operations',
    section: 'Business Addresses',
  },
  {
    id: 'registered_agent_name',
    label: 'Who is your registered agent?',
    type: 'text',
    required: true,
    placeholder: 'Full name or company name',
    tooltip:
      'The person or company designated to receive legal documents on behalf of your LLC',
    section: 'Business Addresses',
  },
  {
    id: 'registered_agent_address',
    label: "What is your registered agent's address?",
    type: 'address',
    required: true,
    placeholder: 'Registered agent address',
    tooltip:
      'This must be a physical address in your state of formation where legal documents can be served',
    section: 'Business Addresses',
  },

  // === STEP 4: MEMBER 1 (PRIMARY) ===
  {
    id: 'member_1_name',
    label: "What is the first member's full legal name?",
    type: 'text',
    required: true,
    placeholder: 'e.g., John Smith',
    tooltip: 'Use the exact legal name as it appears on official documents',
    section: 'Primary Member',
  },
  {
    id: 'member_1_address',
    label: "What is the first member's address?",
    type: 'address',
    required: true,
    tooltip: 'Personal address of the first member',
    section: 'Primary Member',
  },
  {
    id: 'member_1_percentage',
    label: 'What percentage of the LLC does the first member own?',
    type: 'number',
    required: true,
    placeholder: '100',
    min: 0,
    max: 100,
    tooltip:
      'Enter a number between 0 and 100. If this is a single-member LLC, enter 100.',
    section: 'Primary Member',
  },
  {
    id: 'member_1_contribution',
    label: "How much is the first member's initial investment?",
    type: 'number',
    required: true,
    placeholder: '0',
    min: 0,
    tooltip:
      'Enter the dollar amount the first member is contributing to start the LLC. Enter 0 if no cash investment.',
    section: 'Primary Member',
  },

  // === STEP 5: ADDITIONAL MEMBERS (CONDITIONAL) ===
  {
    id: 'has_additional_members',
    label: 'Are there additional members in this LLC?',
    type: 'radio',
    required: true,
    options: [
      { value: 'no', label: 'No, this is a single-member LLC' },
      { value: 'yes', label: 'Yes, there are additional members' },
    ],
    tooltip: 'Choose whether this LLC has multiple members or just one',
    section: 'Additional Members',
  },
  {
    id: 'member_2_name',
    label: "What is the second member's full legal name?",
    type: 'text',
    required: false,
    placeholder: 'e.g., Jane Doe',
    tooltip: 'Leave blank if there is no second member',
    conditionalOn: { field: 'has_additional_members', value: 'yes' },
    section: 'Additional Members',
  },
  {
    id: 'member_2_address',
    label: "What is the second member's address?",
    type: 'address',
    required: false,
    conditionalOn: { field: 'has_additional_members', value: 'yes' },
    section: 'Additional Members',
  },
  {
    id: 'member_2_percentage',
    label: 'What percentage does the second member own?',
    type: 'number',
    required: false,
    placeholder: '0',
    min: 0,
    max: 100,
    conditionalOn: { field: 'has_additional_members', value: 'yes' },
    section: 'Additional Members',
  },
  {
    id: 'member_2_contribution',
    label: "How much is the second member's initial investment?",
    type: 'number',
    required: false,
    placeholder: '0',
    min: 0,
    conditionalOn: { field: 'has_additional_members', value: 'yes' },
    section: 'Additional Members',
  },

  // === STEP 6: MANAGEMENT STRUCTURE ===
  {
    id: 'management_type',
    label: 'How will your LLC be managed?',
    type: 'radio',
    required: true,
    options: [
      {
        value: 'member_managed',
        label: 'Member-Managed (all members can make business decisions)',
      },
      {
        value: 'manager_managed',
        label: 'Manager-Managed (designated managers make business decisions)',
      },
    ],
    tooltip:
      'Member-managed is simpler and common for small LLCs. Manager-managed gives control to specific people.',
    section: 'Management Structure',
  },
  {
    id: 'decision_threshold',
    label: 'What vote is needed for major business decisions?',
    type: 'select',
    required: true,
    options: [
      { value: 'majority', label: 'Majority (more than 50%)' },
      { value: 'unanimous', label: 'Unanimous (100% agreement)' },
      { value: 'two-thirds', label: 'Two-thirds (66.67%)' },
    ],
    tooltip:
      'This determines how important decisions like selling the business or adding new members will be made',
    section: 'Management Structure',
  },

  // === STEP 7: FINANCIAL BASICS ===
  {
    id: 'distribution_frequency',
    label: 'How often will profits be distributed to members?',
    type: 'select',
    required: true,
    options: [
      {
        value: 'as determined by members',
        label: 'As determined by members (flexible)',
      },
      { value: 'annually', label: 'Once per year' },
      { value: 'quarterly', label: 'Every quarter' },
      { value: 'no regular distributions', label: 'No regular distributions' },
    ],
    tooltip:
      'This sets expectations for when members will receive their share of profits',
    section: 'Financial Arrangements',
  },
  {
    id: 'fiscal_year',
    label: "What is your LLC's fiscal year?",
    type: 'select',
    required: true,
    options: [
      {
        value: 'calendar year',
        label: 'Calendar Year (January 1 - December 31)',
      },
      { value: 'July 1 - June 30', label: 'July 1 - June 30' },
      { value: 'October 1 - September 30', label: 'October 1 - September 30' },
    ],
    tooltip: 'Most small businesses use the calendar year for simplicity',
    section: 'Financial Arrangements',
  },

  // === STEP 8: LEGAL PREFERENCES ===
  {
    id: 'governing_state',
    label: "Which state's laws should govern this agreement?",
    type: 'select',
    required: true,
    options: [
      {
        value: 'same_as_formation',
        label: 'Same as formation state (recommended)',
      },
      { value: 'Delaware', label: 'Delaware' },
      { value: 'Nevada', label: 'Nevada' },
      { value: 'California', label: 'California' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Florida', label: 'Florida' },
      { value: 'New York', label: 'New York' },
    ],
    tooltip: 'Usually best to choose the same state where your LLC is formed',
    section: 'Legal Preferences',
  },
  {
    id: 'transfer_restrictions',
    label: 'Should there be restrictions on selling membership interests?',
    type: 'radio',
    required: true,
    options: [
      {
        value: 'yes_strict',
        label: 'Yes, require unanimous consent from all members',
      },
      {
        value: 'yes_moderate',
        label: 'Yes, require majority consent from members',
      },
      {
        value: 'minimal',
        label: 'Minimal restrictions (allow most transfers)',
      },
    ],
    tooltip:
      'Transfer restrictions protect members from unwanted partners joining the LLC',
    section: 'Legal Preferences',
  },

  // === OPTIONAL FIELDS (ADVANCED) ===
  {
    id: 'federal_ein',
    label: 'Federal EIN (if already obtained)',
    type: 'text',
    required: false,
    placeholder: 'XX-XXXXXXX',
    pattern: '^\\d{2}-\\d{7}$',
    tooltip:
      "Enter your Federal Employer Identification Number if you have one. You can skip this if you haven't applied yet.",
    section: 'Optional Information',
  },
];
