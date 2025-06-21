// Residential Lease Agreement
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  // Property Information
  property_address: z.string().min(1, 'Property address is required'),
  unit_number: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(5, 'ZIP code is required'),
  property_description: z.string().optional(),
  
  // Landlord Information
  landlord_name: z.string().min(1, 'Landlord name is required'),
  landlord_address: z.string().min(1, 'Landlord address is required'),
  landlord_phone: z.string().min(1, 'Landlord phone is required'),
  landlord_email: z.string().email('Valid email required').optional(),
  
  // Tenant Information
  tenant_names: z.string().min(1, 'At least one tenant name is required'),
  
  // Lease Terms
  lease_type: z.enum(['Fixed-term', 'Month-to-month', 'Week-to-week']),
  lease_start_date: z.string().min(1, 'Lease start date is required'),
  lease_end_date: z.string().optional(),
  lease_duration: z.string().optional(),
  max_occupants: z.number().min(1, 'Maximum occupants must be at least 1'),
  
  // Financial Terms
  monthly_rent: z.number().min(0, 'Monthly rent must be positive'),
  rent_due_date: z.string().min(1, 'Rent due date is required'),
  late_fee_amount: z.string().optional(),
  late_fee_grace_period: z.string().optional(),
  payment_method: z.string().optional(),
  security_deposit: z.number().min(0, 'Security deposit must be positive'),
  
  // Property Rules
  pets_allowed: z.boolean().optional(),
  pet_deposit: z.number().min(0).optional(),
  pet_policy_details: z.string().optional(),
  smoking_policy: z.string().optional(),
  
  // Utilities and Services
  utilities_included: z.string().optional(),
  utilities_tenant_pays: z.string().optional(),
  
  // Maintenance
  included_appliances: z.string().optional(),
  repair_request_method: z.string().optional(),
  emergency_contact: z.string().optional(),
  
  // Access and Entry
  entry_notice_period: z.string().optional(),
  
  // Parking and Storage
  parking_spaces: z.string().optional(),
  parking_rules: z.string().optional(),
  
  // Insurance
  renters_insurance_required: z.boolean().optional(),
  insurance_minimum_amount: z.number().min(0).optional(),
  
  // Termination
  early_termination_allowed: z.boolean().optional(),
  early_termination_notice: z.string().optional(),
  early_termination_fee: z.string().optional(),
  move_out_notice: z.string().optional(),
  deposit_return_timeframe: z.string().optional(),
  
  // Legal
  governing_state: z.string().min(1, 'Governing state is required'),
  agreement_date: z.string().min(1, 'Agreement date is required'),
  
  // Additional Terms
  additional_lease_terms: z.string().optional(),
  lead_paint_disclosure: z.string().optional(),
});

export const residentialLeaseAgreement: LegalDocument = {
  id: 'residential-lease-agreement',
  name: 'Residential Lease Agreement',
  category: 'Real Estate',
  schema,
  questions: [
    // Property Information
    {
      id: 'property_address',
      label: 'Property Address',
      type: 'address',
      required: true,
      placeholder: 'Enter full property address...',
    },
    {
      id: 'unit_number',
      label: 'Unit/Apartment Number',
      type: 'text',
      required: false,
      placeholder: 'Enter unit number (if applicable)...',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      required: true,
      placeholder: 'Enter city...',
    },
    {
      id: 'state',
      label: 'State',
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
    },
    {
      id: 'zip_code',
      label: 'ZIP Code',
      type: 'text',
      required: true,
      placeholder: 'Enter ZIP code...',
    },
    {
      id: 'property_description',
      label: 'Property Description',
      type: 'textarea',
      required: false,
      placeholder: 'Brief description of property (bedrooms, bathrooms, etc.)...',
    },
    
    // Landlord Information
    {
      id: 'landlord_name',
      label: 'Landlord Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter landlord full name...',
    },
    {
      id: 'landlord_address',
      label: 'Landlord Address',
      type: 'address',
      required: true,
      placeholder: 'Enter landlord address...',
    },
    {
      id: 'landlord_phone',
      label: 'Landlord Phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter landlord phone number...',
    },
    {
      id: 'landlord_email',
      label: 'Landlord Email',
      type: 'email',
      required: false,
      placeholder: 'Enter landlord email (optional)...',
    },
    
    // Tenant Information
    {
      id: 'tenant_names',
      label: 'Tenant Names',
      type: 'textarea',
      required: true,
      placeholder: 'Enter all tenant names (one per line)...',
    },
    
    // Lease Terms
    {
      id: 'lease_type',
      label: 'Lease Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Fixed-term', label: 'Fixed-term Lease' },
        { value: 'Month-to-month', label: 'Month-to-month' },
        { value: 'Week-to-week', label: 'Week-to-week' },
      ],
    },
    {
      id: 'lease_start_date',
      label: 'Lease Start Date',
      type: 'date',
      required: true,
      placeholder: 'Select lease start date...',
    },
    {
      id: 'lease_end_date',
      label: 'Lease End Date',
      type: 'date',
      required: false,
      placeholder: 'Select lease end date (if fixed-term)...',
      conditional: { field: 'lease_type', value: 'Fixed-term' },
    },
    {
      id: 'max_occupants',
      label: 'Maximum Number of Occupants',
      type: 'number',
      required: true,
      placeholder: 'Enter maximum occupants...',
    },
    
    // Financial Terms
    {
      id: 'monthly_rent',
      label: 'Monthly Rent Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter monthly rent amount...',
    },
    {
      id: 'rent_due_date',
      label: 'Rent Due Date',
      type: 'select',
      required: true,
      options: [
        { value: '1st', label: '1st of the month' },
        { value: '5th', label: '5th of the month' },
        { value: '10th', label: '10th of the month' },
        { value: '15th', label: '15th of the month' },
        { value: '20th', label: '20th of the month' },
        { value: '25th', label: '25th of the month' },
      ],
    },
    {
      id: 'late_fee_amount',
      label: 'Late Fee Amount',
      type: 'text',
      required: false,
      placeholder: 'e.g., $50 or 5% of rent...',
    },
    {
      id: 'late_fee_grace_period',
      label: 'Late Fee Grace Period',
      type: 'text',
      required: false,
      placeholder: 'e.g., 5 days...',
    },
    {
      id: 'payment_method',
      label: 'Accepted Payment Methods',
      type: 'text',
      required: false,
      placeholder: 'e.g., Check, bank transfer, online portal...',
    },
    {
      id: 'security_deposit',
      label: 'Security Deposit Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter security deposit amount...',
    },
    
    // Property Rules
    {
      id: 'pets_allowed',
      label: 'Are Pets Allowed?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'pet_deposit',
      label: 'Pet Deposit Amount',
      type: 'number',
      required: false,
      placeholder: 'Enter pet deposit amount...',
      conditional: { field: 'pets_allowed', value: true },
    },
    {
      id: 'pet_policy_details',
      label: 'Pet Policy Details',
      type: 'textarea',
      required: false,
      placeholder: 'Describe pet restrictions, breed limits, etc...',
      conditional: { field: 'pets_allowed', value: true },
    },
    {
      id: 'smoking_policy',
      label: 'Smoking Policy',
      type: 'select',
      required: false,
      options: [
        { value: 'No smoking allowed', label: 'No smoking allowed anywhere' },
        { value: 'Smoking allowed outside only', label: 'Smoking allowed outside only' },
        { value: 'Smoking allowed in designated areas', label: 'Smoking allowed in designated areas' },
        { value: 'No restrictions', label: 'No smoking restrictions' },
      ],
    },
    
    // Utilities
    {
      id: 'utilities_included',
      label: 'Utilities Included in Rent',
      type: 'textarea',
      required: false,
      placeholder: 'List utilities included (water, electric, gas, internet, etc.)...',
    },
    {
      id: 'utilities_tenant_pays',
      label: 'Utilities Tenant Pays',
      type: 'textarea',
      required: false,
      placeholder: 'List utilities tenant is responsible for...',
    },
    
    // Maintenance
    {
      id: 'included_appliances',
      label: 'Included Appliances',
      type: 'textarea',
      required: false,
      placeholder: 'List appliances included (refrigerator, stove, washer/dryer, etc.)...',
    },
    {
      id: 'repair_request_method',
      label: 'How to Request Repairs',
      type: 'text',
      required: false,
      placeholder: 'e.g., Phone, email, online portal...',
    },
    {
      id: 'emergency_contact',
      label: 'Emergency Contact',
      type: 'text',
      required: false,
      placeholder: 'Emergency contact number...',
    },
    
    // Access and Entry
    {
      id: 'entry_notice_period',
      label: 'Entry Notice Period',
      type: 'select',
      required: false,
      options: [
        { value: '24', label: '24 hours' },
        { value: '48', label: '48 hours' },
        { value: '72', label: '72 hours' },
      ],
    },
    
    // Parking
    {
      id: 'parking_spaces',
      label: 'Parking Spaces',
      type: 'text',
      required: false,
      placeholder: 'Number and type of parking spaces...',
    },
    {
      id: 'parking_rules',
      label: 'Parking Rules',
      type: 'textarea',
      required: false,
      placeholder: 'Describe parking rules and restrictions...',
    },
    
    // Insurance
    {
      id: 'renters_insurance_required',
      label: 'Is Renters Insurance Required?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'insurance_minimum_amount',
      label: 'Minimum Insurance Coverage',
      type: 'number',
      required: false,
      placeholder: 'Enter minimum coverage amount...',
      conditional: { field: 'renters_insurance_required', value: true },
    },
    
    // Termination
    {
      id: 'early_termination_allowed',
      label: 'Early Termination Allowed?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'early_termination_notice',
      label: 'Early Termination Notice Period',
      type: 'text',
      required: false,
      placeholder: 'e.g., 30 days, 60 days...',
      conditional: { field: 'early_termination_allowed', value: true },
    },
    {
      id: 'early_termination_fee',
      label: 'Early Termination Fee',
      type: 'text',
      required: false,
      placeholder: 'e.g., One month rent, $500...',
      conditional: { field: 'early_termination_allowed', value: true },
    },
    {
      id: 'move_out_notice',
      label: 'Move-out Notice Required',
      type: 'select',
      required: false,
      options: [
        { value: '30 days', label: '30 days' },
        { value: '60 days', label: '60 days' },
        { value: '90 days', label: '90 days' },
      ],
    },
    {
      id: 'deposit_return_timeframe',
      label: 'Deposit Return Timeframe',
      type: 'select',
      required: false,
      options: [
        { value: '14 days', label: '14 days' },
        { value: '21 days', label: '21 days' },
        { value: '30 days', label: '30 days' },
      ],
    },
    
    // Legal
    {
      id: 'governing_state',
      label: 'Governing State',
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
    },
    {
      id: 'agreement_date',
      label: 'Agreement Date',
      type: 'date',
      required: true,
      placeholder: 'Select agreement date...',
    },
    
    // Additional Terms
    {
      id: 'additional_lease_terms',
      label: 'Additional Lease Terms',
      type: 'textarea',
      required: false,
      placeholder: 'Any additional terms or conditions...',
    },
    {
      id: 'lead_paint_disclosure',
      label: 'Lead Paint Disclosure',
      type: 'textarea',
      required: false,
      placeholder: 'Lead paint disclosure information (required for pre-1978 properties)...',
    },
  ],
  offerNotarization: false,
  states: 'all',
  complexity: 'medium',
  estimatedTime: '10-20 minutes',
  tags: ['real estate', 'medium', 'legal', 'template', 'popular'],
  translations: {
    en: {
      name: 'Residential Lease Agreement',
      description:
        'Create a legally binding Residential Lease Agreement with our easy-to-use template. State-specific requirements included.',
      aliases: ['residential lease contract'],
    },
    es: {
      name: 'Contrato de Arrendamiento Residencial',
      description:
        'Crea un Residential Arrendamiento Acuerdo legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [],
    },
  },
};
