import { z } from 'zod';

export const operatingAgreementSchema = z.object({
    // Company Information
    company_name: z.string().min(1, 'Company name is required'),
    state_of_formation: z.string().min(1, 'State of formation is required'),
    effective_date: z.string().min(1, 'Effective date is required'),
    principal_office_address: z
      .string()
      .min(1, 'Principal office address is required'),
    registered_agent_name: z
      .string()
      .min(1, 'Registered agent name is required'),
    registered_agent_address: z
      .string()
      .min(1, 'Registered agent address is required'),
    federal_ein: z
      .string()
      .regex(/^\d{2}-\d{7}$/, 'EIN must be in format XX-XXXXXXX')
      .optional()
      .or(z.literal('')),
    articles_filing_date: z.string().min(1, 'Articles filing date is required'),
    business_purpose: z
      .string()
      .min(10, 'Business purpose must be at least 10 characters'),

    // Member 1 (Required)
    member_1_name: z.string().min(1, 'Member 1 name is required'),
    member_1_address: z.string().min(1, 'Member 1 address is required'),
    member_1_contribution: z
      .number()
      .min(0, 'Contribution must be 0 or greater'),
    member_1_percentage: z
      .number()
      .min(0)
      .max(100, 'Percentage must be between 0 and 100'),
    member_1_units: z.number().min(0, 'Units must be 0 or greater'),

    // Member 2 (Optional)
    member_2_name: z.string().optional(),
    member_2_address: z.string().optional(),
    member_2_contribution: z.number().min(0).optional(),
    member_2_percentage: z.number().min(0).max(100).optional(),
    member_2_units: z.number().min(0).optional(),

    // Member 3 (Optional)
    member_3_name: z.string().optional(),
    member_3_address: z.string().optional(),
    member_3_contribution: z.number().min(0).optional(),
    member_3_percentage: z.number().min(0).max(100).optional(),
    member_3_units: z.number().min(0).optional(),

    // Totals
    total_units: z.number().min(1, 'Total units must be at least 1'),
    total_initial_capital: z
      .number()
      .min(0, 'Total capital must be 0 or greater'),

    // Management
    management_type: z.enum(['member_managed', 'manager_managed']),
    member_managed: z.boolean().optional(),
    manager_managed: z.boolean().optional(),
    decision_threshold: z.string().optional(),
    ordinary_decision_authority: z
      .string()
      .min(1, 'Decision authority is required'),
    major_decision_threshold: z
      .string()
      .min(1, 'Major decision threshold is required'),

    // Financial
    distribution_frequency: z
      .string()
      .min(1, 'Distribution frequency is required'),
    distribution_criteria: z.string().default('ownership percentages'),
    distribution_decision_authority: z.string().default('majority vote'),
    fiscal_year: z.string().min(1, 'Fiscal year is required'),
    financial_statement_deadline: z
      .string()
      .min(1, 'Financial statement deadline is required'),
    banking_authority: z.string().default('Manager(s)'),

    // Transfer Restrictions
    transfer_approval_requirement: z
      .string()
      .min(1, 'Transfer approval requirement is required'),
    right_of_first_refusal: z.boolean(),
    rofr_notice_days: z.string().default('30'),
    rofr_response_days: z.string().default('30'),

    // Dispute Resolution
    mediation_required: z.boolean(),
    mediation_location: z.string().optional(),
    arbitration_required: z.boolean(),
    arbitration_location: z.string().optional(),
    arbitration_rules: z.string().default('AAA Commercial Arbitration Rules'),
    litigation_jurisdiction: z.string().optional(),
    governing_state: z.string().min(1, 'Governing state is required'),

    // Additional computed/default fields for template
    additional_contributions_allowed: z.boolean().default(false),
    additional_contribution_approval: z.string().default('majority'),
    annual_meetings_required: z.boolean().default(true),
    annual_meeting_date: z.string().default('first Monday in March'),
    special_meeting_authority: z.string().default('any Member'),
    meeting_notice_days: z.string().default('10'),
    quorum_requirement: z.string().default('majority of ownership interests'),
    amendment_requirement: z
      .string()
      .default('unanimous written consent of all Members'),
    buy_sell_provisions: z.boolean().default(false),
    buy_sell_triggers: z.string().optional(),
    valuation_method: z.string().optional(),
    buy_sell_payment_terms: z.string().optional(),
    dissolution_triggers: z.string().default('As provided by state law'),
    liquidation_authority: z.string().default('the Members'),
    additional_member_rights: z.string().optional(),
    additional_member_obligations: z.string().optional(),
    additional_major_decisions: z.string().optional(),
    additional_provisions: z.string().optional(),
    non_compete: z.boolean().default(false),
    non_compete_terms: z.string().optional(),
    fiduciary_duty_provisions: z
      .string()
      .default(
        'Members owe fiduciary duties to the Company and each other as provided by law',
      ),
    tax_elections: z
      .string()
      .default(
        'The Company shall elect to be taxed as a partnership for federal income tax purposes',
      ),
  })
  .refine(
    (data) => {
      // Validate member 2 fields if member 2 name is provided
      if (data.member_2_name) {
        return (
          data.member_2_address &&
          data.member_2_contribution !== undefined &&
          data.member_2_percentage !== undefined &&
          data.member_2_units !== undefined
        );
      }
      return true;
    },
    {
      message:
        'All Member 2 fields are required when Member 2 name is provided',
      path: ['member_2_name'],
    },
  )
  .refine(
    (data) => {
      // Validate member 3 fields if member 3 name is provided
      if (data.member_3_name) {
        return (
          data.member_3_address &&
          data.member_3_contribution !== undefined &&
          data.member_3_percentage !== undefined &&
          data.member_3_units !== undefined
        );
      }
      return true;
    },
    {
      message:
        'All Member 3 fields are required when Member 3 name is provided',
      path: ['member_3_name'],
    },
  )
  .refine(
    (data) => {
      // Validate ownership percentages add up to 100
      const totalPercentage =
        data.member_1_percentage +
        (data.member_2_percentage || 0) +
        (data.member_3_percentage || 0);
      return totalPercentage === 100;
    },
    {
      message: 'Ownership percentages must add up to 100%',
      path: ['member_1_percentage'],
    },
  )
  .refine(
    (data) => {
      // Validate total units match sum of member units
      const totalMemberUnits =
        data.member_1_units +
        (data.member_2_units || 0) +
        (data.member_3_units || 0);
      return totalMemberUnits === data.total_units;
    },
    {
      message: 'Total units must equal sum of all member units',
      path: ['total_units'],
    },
  )
  .refine(
    (data) => {
      // Validate total capital matches sum of contributions
      const totalContributions =
        data.member_1_contribution +
        (data.member_2_contribution || 0) +
        (data.member_3_contribution || 0);
      return totalContributions === data.total_initial_capital;
    },
    {
      message:
        'Total initial capital must equal sum of all member contributions',
      path: ['total_initial_capital'],
    },
  )
  .transform((data) => {
    // Set management type booleans based on selection
    return {
      ...data,
      member_managed: data.management_type === 'member_managed',
      manager_managed: data.management_type === 'manager_managed',
      // Set dispute resolution locations if needed
      mediation_location: data.mediation_required
        ? data.governing_state
        : undefined,
      arbitration_location: data.arbitration_required
        ? data.governing_state
        : undefined,
      litigation_jurisdiction: !data.arbitration_required
        ? data.governing_state
        : undefined,
    };
  });
