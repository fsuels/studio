import { z } from 'zod';

export const powerOfAttorneySchema = z.object({
  // Principal Information
  principal_name: z.string().min(1, "Principal's name is required"),
  principal_address: z.string().min(1, "Principal's address is required"),
  principal_city: z.string().min(1, "Principal's city is required"),
  principal_state: z.string().min(1, "Principal's state is required"),
  principal_zip: z.string().min(5, "Principal's ZIP code is required"),
  principal_phone: z.string().optional(),
  principal_dob: z.string().optional(),
  principal_ssn_last_four: z.string().optional(),
  
  // Agent Information
  agent_name: z.string().min(1, "Agent's name is required"),
  agent_address: z.string().min(1, "Agent's address is required"),
  agent_city: z.string().min(1, "Agent's city is required"),
  agent_state: z.string().min(1, "Agent's state is required"),
  agent_zip: z.string().min(5, "Agent's ZIP code is required"),
  agent_phone: z.string().optional(),
  relationship_to_principal: z.string().optional(),
  
  // Successor Agent
  successor_agent: z.boolean().optional(),
  successor_agent_name: z.string().optional(),
  successor_agent_address: z.string().optional(),
  successor_agent_phone: z.string().optional(),
  successor_relationship: z.string().optional(),
  
  // POA Type and Powers
  poa_type: z.enum(['General', 'Limited', 'Durable', 'Springing']),
  general_powers: z.boolean().optional(),
  limited_powers: z.boolean().optional(),
  
  // Specific Powers
  banking_powers: z.boolean().optional(),
  real_estate_powers: z.boolean().optional(),
  investment_powers: z.boolean().optional(),
  business_powers: z.boolean().optional(),
  insurance_powers: z.boolean().optional(),
  tax_powers: z.boolean().optional(),
  benefits_powers: z.boolean().optional(),
  personal_powers: z.boolean().optional(),
  healthcare_powers: z.boolean().optional(),
  
  // Effective Period
  immediate_effective: z.boolean().optional(),
  springing_poa: z.boolean().optional(),
  springing_condition: z.string().optional(),
  durable_poa: z.boolean().optional(),
  expiration_date: z.string().optional(),
  
  // Agent Duties and Limitations
  agent_compensation: z.boolean().optional(),
  compensation_terms: z.string().optional(),
  gift_limit: z.string().optional(),
  agent_limitations: z.string().optional(),
  additional_agent_duties: z.string().optional(),
  
  // Healthcare (if applicable)
  healthcare_decision_authority: z.string().optional(),
  healthcare_limitations: z.string().optional(),
  
  // Witnesses and Notarization
  witnesses_required: z.boolean().optional(),
  witness1_name: z.string().optional(),
  witness1_address: z.string().optional(),
  witness2_name: z.string().optional(),
  witness2_address: z.string().optional(),
  
  // Notary Information
  notary_state: z.string().optional(),
  notary_county: z.string().optional(),
  notary_date: z.string().optional(),
  notary_commission_expires: z.string().optional(),
  
  // Legal and Dates
  governing_state: z.string().min(1, 'Governing state is required'),
  effective_date: z.string().min(1, 'Effective date is required'),
  
  // Agent Acceptance
  agent_acceptance: z.boolean().optional(),
  
  // Additional Terms
  additional_banking_powers: z.string().optional(),
  additional_real_estate_powers: z.string().optional(),
  additional_investment_powers: z.string().optional(),
  additional_business_powers: z.string().optional(),
  additional_insurance_powers: z.string().optional(),
  additional_tax_powers: z.string().optional(),
  additional_benefits_powers: z.string().optional(),
  additional_personal_powers: z.string().optional(),
  additional_expectations: z.string().optional(),
});
