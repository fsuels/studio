// Non-Disclosure Agreement (NDA)
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  // Disclosing Party Information
  disclosing_party_name: z.string().min(1, 'Disclosing party name is required'),
  disclosing_party_type: z.enum(['Individual', 'LLC', 'Corporation', 'Partnership', 'Other']),
  disclosing_party_address: z.string().min(1, 'Disclosing party address is required'),
  disclosing_party_contact: z.string().optional(),
  disclosing_party_representative: z.string().optional(),
  disclosing_party_title: z.string().optional(),
  
  // Receiving Party Information
  receiving_party_name: z.string().min(1, 'Receiving party name is required'),
  receiving_party_type: z.enum(['Individual', 'LLC', 'Corporation', 'Partnership', 'Other']),
  receiving_party_address: z.string().min(1, 'Receiving party address is required'),
  receiving_party_contact: z.string().optional(),
  receiving_party_representative: z.string().optional(),
  receiving_party_title: z.string().optional(),
  
  // Agreement Details
  mutual_nda: z.boolean().optional(),
  effective_date: z.string().min(1, 'Effective date is required'),
  disclosure_purpose: z.string().min(1, 'Purpose of disclosure is required'),
  
  // Confidential Information
  confidential_information_types: z.string().min(1, 'Types of confidential information required'),
  
  // Duration and Terms
  agreement_duration: z.string().optional(),
  confidentiality_survival_period: z.string().min(1, 'Confidentiality survival period is required'),
  termination_notice_period: z.string().optional(),
  
  // Remedies
  liquidated_damages: z.boolean().optional(),
  liquidated_damages_amount: z.string().optional(),
  
  // Legal
  governing_state: z.string().min(1, 'Governing state is required'),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  
  // Additional Terms
  additional_terms: z.string().optional(),
  evaluation_period: z.boolean().optional(),
  evaluation_period_duration: z.string().optional(),
  authorized_recipients: z.string().optional(),
  gift_limit: z.string().optional(),
  prohibited_use_restrictions: z.string().optional(),
});

export const nonDisclosureAgreement: LegalDocument = {
  id: 'non-disclosure-agreement',
  name: 'Non-Disclosure Agreement (NDA)',
  category: 'Business',
  schema,
  questions: [
    // NDA Type
    {
      id: 'mutual_nda',
      label: 'Type of NDA',
      type: 'radio',
      required: true,
      options: [
        { value: false, label: 'Unilateral NDA (One party discloses)' },
        { value: true, label: 'Mutual NDA (Both parties disclose)' },
      ],
    },
    
    // Disclosing Party Information
    {
      id: 'disclosing_party_name',
      label: 'Disclosing Party Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name of party sharing confidential information...',
    },
    {
      id: 'disclosing_party_type',
      label: 'Disclosing Party Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Individual', label: 'Individual' },
        { value: 'LLC', label: 'LLC' },
        { value: 'Corporation', label: 'Corporation' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      id: 'disclosing_party_address',
      label: 'Disclosing Party Address',
      type: 'address',
      required: true,
      placeholder: 'Enter disclosing party address...',
    },
    {
      id: 'disclosing_party_contact',
      label: 'Disclosing Party Contact',
      type: 'text',
      required: false,
      placeholder: 'Phone or email...',
    },
    {
      id: 'disclosing_party_representative',
      label: 'Disclosing Party Representative',
      type: 'text',
      required: false,
      placeholder: 'Name of person signing for disclosing party...',
    },
    {
      id: 'disclosing_party_title',
      label: 'Representative Title',
      type: 'text',
      required: false,
      placeholder: 'Title of representative...',
    },
    
    // Receiving Party Information
    {
      id: 'receiving_party_name',
      label: 'Receiving Party Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name of party receiving confidential information...',
    },
    {
      id: 'receiving_party_type',
      label: 'Receiving Party Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Individual', label: 'Individual' },
        { value: 'LLC', label: 'LLC' },
        { value: 'Corporation', label: 'Corporation' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      id: 'receiving_party_address',
      label: 'Receiving Party Address',
      type: 'address',
      required: true,
      placeholder: 'Enter receiving party address...',
    },
    {
      id: 'receiving_party_contact',
      label: 'Receiving Party Contact',
      type: 'text',
      required: false,
      placeholder: 'Phone or email...',
    },
    {
      id: 'receiving_party_representative',
      label: 'Receiving Party Representative',
      type: 'text',
      required: false,
      placeholder: 'Name of person signing for receiving party...',
    },
    {
      id: 'receiving_party_title',
      label: 'Representative Title',
      type: 'text',
      required: false,
      placeholder: 'Title of representative...',
    },
    
    // Agreement Details
    {
      id: 'effective_date',
      label: 'Effective Date',
      type: 'date',
      required: true,
      placeholder: 'Select effective date...',
    },
    {
      id: 'disclosure_purpose',
      label: 'Purpose of Disclosure',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the business purpose for sharing confidential information...',
    },
    {
      id: 'evaluation_period',
      label: 'Is this for a specific evaluation period?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'evaluation_period_duration',
      label: 'Evaluation Period Duration',
      type: 'text',
      required: false,
      placeholder: 'e.g., 6 months, 1 year...',
      conditional: { field: 'evaluation_period', value: true },
    },
    
    // Confidential Information
    {
      id: 'confidential_information_types',
      label: 'Types of Confidential Information',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the types of confidential information to be shared (business plans, technical data, customer lists, etc.)...',
    },
    {
      id: 'authorized_recipients',
      label: 'Authorized Recipients',
      type: 'textarea',
      required: false,
      placeholder: 'Specific individuals authorized to receive confidential information...',
    },
    {
      id: 'prohibited_use_restrictions',
      label: 'Additional Use Restrictions',
      type: 'textarea',
      required: false,
      placeholder: 'Any additional restrictions on how confidential information can be used...',
    },
    
    // Duration and Terms
    {
      id: 'agreement_duration',
      label: 'Agreement Duration',
      type: 'text',
      required: false,
      placeholder: 'How long the NDA lasts (leave blank for indefinite)...',
    },
    {
      id: 'confidentiality_survival_period',
      label: 'Confidentiality Survival Period',
      type: 'select',
      required: true,
      options: [
        { value: '2 years', label: '2 years' },
        { value: '3 years', label: '3 years' },
        { value: '5 years', label: '5 years' },
        { value: '7 years', label: '7 years' },
        { value: '10 years', label: '10 years' },
        { value: 'indefinitely', label: 'Indefinitely' },
      ],
    },
    {
      id: 'termination_notice_period',
      label: 'Termination Notice Period',
      type: 'select',
      required: false,
      options: [
        { value: '30 days', label: '30 days' },
        { value: '60 days', label: '60 days' },
        { value: '90 days', label: '90 days' },
      ],
    },
    
    // Remedies
    {
      id: 'liquidated_damages',
      label: 'Include Liquidated Damages?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'liquidated_damages_amount',
      label: 'Liquidated Damages Amount',
      type: 'text',
      required: false,
      placeholder: 'e.g., $10,000, $50,000...',
      conditional: { field: 'liquidated_damages', value: true },
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
      id: 'jurisdiction',
      label: 'Jurisdiction for Disputes',
      type: 'text',
      required: true,
      placeholder: 'e.g., New York County, California...',
    },
    
    // Additional Terms
    {
      id: 'additional_terms',
      label: 'Additional Terms',
      type: 'textarea',
      required: false,
      placeholder: 'Any additional terms or conditions...',
    },
  ],
  offerNotarization: false,
  states: 'all',
  complexity: 'medium',
  estimatedTime: '10-20 minutes',
  tags: ['business', 'medium', 'legal', 'template', 'popular'],
  translations: {
    en: {
      name: 'Non-Disclosure Agreement (NDA)',
      description:
        'Create a legally binding Non-Disclosure Agreement (NDA) with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'non-disclosure contract (nda)',
        'business document',
        'commercial agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Confidencialidad (NDA)',
      description:
        'Crea un Confidencialidad Acuerdo (NDA) legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [],
    },
  },
};
