// Employment Contract
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  // Company Information
  company_name: z.string().min(1, 'Company name is required'),
  company_representative_name: z.string().min(1, 'Company representative name is required'),
  company_representative_title: z.string().min(1, 'Company representative title is required'),
  
  // Employee Information
  employee_name: z.string().min(1, 'Employee name is required'),
  position_title: z.string().min(1, 'Position title is required'),
  department: z.string().optional(),
  supervisor_name: z.string().optional(),
  job_description: z.string().min(1, 'Job description is required'),
  work_location: z.string().min(1, 'Work location is required'),
  
  // Employment Details
  employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Temporary']),
  employment_classification: z.enum(['Exempt', 'Non-exempt']),
  flsa_status: z.enum(['Exempt', 'Non-exempt']),
  start_date: z.string().min(1, 'Start date is required'),
  
  // Compensation
  salary_based: z.boolean().optional(),
  annual_salary: z.number().min(0).optional(),
  pay_frequency: z.enum(['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']).optional(),
  gross_pay_per_period: z.number().min(0).optional(),
  
  hourly_based: z.boolean().optional(),
  hourly_rate: z.number().min(0).optional(),
  standard_hours: z.number().min(0).optional(),
  overtime_rate: z.string().optional(),
  overtime_threshold: z.number().optional(),
  
  // Benefits
  benefits_offered: z.boolean().optional(),
  health_insurance_details: z.string().optional(),
  retirement_plan_details: z.string().optional(),
  pto_details: z.string().optional(),
  sick_leave_details: z.string().optional(),
  other_benefits: z.string().optional(),
  
  // Work Schedule
  work_schedule: z.string().optional(),
  work_days: z.string().optional(),
  break_schedule: z.string().optional(),
  remote_work_allowed: z.boolean().optional(),
  remote_work_policy: z.string().optional(),
  
  // Legal Terms
  at_will_employment: z.boolean().optional(),
  non_compete_included: z.boolean().optional(),
  non_compete_duration: z.string().optional(),
  geographic_restriction: z.string().optional(),
  non_solicitation_duration: z.string().optional(),
  
  // Termination
  employee_notice_period: z.string().optional(),
  company_notice_period: z.string().optional(),
  final_pay_timeframe: z.string().optional(),
  
  // Other
  governing_state: z.string().min(1, 'Governing state is required'),
  sign_date: z.string().min(1, 'Signature date is required'),
  review_frequency: z.enum(['Annually', 'Semi-annually', 'Quarterly']).optional(),
  arbitration_required: z.boolean().optional(),
  arbitration_location: z.string().optional(),
});

export const employmentContract: LegalDocument = {
  id: 'employment-contract',
  name: 'Employment Contract',
  category: 'Employment',
  schema,
  questions: [
    // Company Information
    {
      id: 'company_name',
      label: 'Company Name',
      type: 'text',
      required: true,
      placeholder: 'Enter company name...',
    },
    {
      id: 'company_representative_name',
      label: 'Company Representative Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name of person signing for company...',
    },
    {
      id: 'company_representative_title',
      label: 'Company Representative Title',
      type: 'text',
      required: true,
      placeholder: 'e.g., CEO, HR Director, Manager...',
    },
    
    // Employee Information
    {
      id: 'employee_name',
      label: 'Employee Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter employee full name...',
    },
    {
      id: 'position_title',
      label: 'Job Title/Position',
      type: 'text',
      required: true,
      placeholder: 'Enter job title...',
    },
    {
      id: 'department',
      label: 'Department',
      type: 'text',
      required: false,
      placeholder: 'Enter department (optional)...',
    },
    {
      id: 'supervisor_name',
      label: 'Supervisor Name',
      type: 'text',
      required: false,
      placeholder: 'Enter supervisor name (optional)...',
    },
    {
      id: 'job_description',
      label: 'Job Responsibilities',
      type: 'textarea',
      required: true,
      placeholder: 'Describe key job responsibilities and duties...',
    },
    {
      id: 'work_location',
      label: 'Work Location',
      type: 'text',
      required: true,
      placeholder: 'Enter primary work location...',
    },
    
    // Employment Details
    {
      id: 'employment_type',
      label: 'Employment Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Temporary', label: 'Temporary' },
      ],
    },
    {
      id: 'employment_classification',
      label: 'Employment Classification',
      type: 'select',
      required: true,
      options: [
        { value: 'Exempt', label: 'Exempt (Salaried)' },
        { value: 'Non-exempt', label: 'Non-exempt (Hourly)' },
      ],
    },
    {
      id: 'start_date',
      label: 'Employment Start Date',
      type: 'date',
      required: true,
      placeholder: 'Select start date...',
    },
    
    // Compensation Type
    {
      id: 'salary_based',
      label: 'Salary-based compensation?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes - Annual Salary' },
        { value: false, label: 'No - Hourly Rate' },
      ],
    },
    {
      id: 'annual_salary',
      label: 'Annual Salary',
      type: 'number',
      required: false,
      placeholder: 'Enter annual salary...',
      conditional: { field: 'salary_based', value: true },
    },
    {
      id: 'pay_frequency',
      label: 'Pay Frequency',
      type: 'select',
      required: false,
      options: [
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Bi-weekly', label: 'Bi-weekly' },
        { value: 'Semi-monthly', label: 'Semi-monthly' },
        { value: 'Monthly', label: 'Monthly' },
      ],
      conditional: { field: 'salary_based', value: true },
    },
    {
      id: 'hourly_rate',
      label: 'Hourly Rate',
      type: 'number',
      required: false,
      placeholder: 'Enter hourly rate...',
      conditional: { field: 'salary_based', value: false },
    },
    {
      id: 'standard_hours',
      label: 'Standard Hours per Week',
      type: 'number',
      required: false,
      placeholder: 'Enter standard hours per week...',
      conditional: { field: 'salary_based', value: false },
    },
    
    // Benefits
    {
      id: 'benefits_offered',
      label: 'Benefits Package Offered?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'health_insurance_details',
      label: 'Health Insurance Details',
      type: 'textarea',
      required: false,
      placeholder: 'Describe health insurance coverage...',
      conditional: { field: 'benefits_offered', value: true },
    },
    {
      id: 'pto_details',
      label: 'Paid Time Off Policy',
      type: 'textarea',
      required: false,
      placeholder: 'Describe PTO policy...',
      conditional: { field: 'benefits_offered', value: true },
    },
    
    // Work Schedule
    {
      id: 'work_schedule',
      label: 'Work Schedule',
      type: 'text',
      required: false,
      placeholder: 'e.g., Monday-Friday 9AM-5PM...',
    },
    {
      id: 'remote_work_allowed',
      label: 'Remote Work Allowed?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'remote_work_policy',
      label: 'Remote Work Policy',
      type: 'textarea',
      required: false,
      placeholder: 'Describe remote work policy...',
      conditional: { field: 'remote_work_allowed', value: true },
    },
    
    // Legal Terms
    {
      id: 'at_will_employment',
      label: 'At-Will Employment?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes - At-will employment' },
        { value: false, label: 'No - Contract with specific terms' },
      ],
    },
    {
      id: 'non_compete_included',
      label: 'Include Non-Compete Agreement?',
      type: 'radio',
      required: false,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'non_compete_duration',
      label: 'Non-Compete Duration',
      type: 'text',
      required: false,
      placeholder: 'e.g., 12 months, 2 years...',
      conditional: { field: 'non_compete_included', value: true },
    },
    {
      id: 'geographic_restriction',
      label: 'Geographic Restriction',
      type: 'text',
      required: false,
      placeholder: 'e.g., within 50 miles, same state...',
      conditional: { field: 'non_compete_included', value: true },
    },
    
    // Legal Details
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
      id: 'sign_date',
      label: 'Agreement Date',
      type: 'date',
      required: true,
      placeholder: 'Select agreement date...',
    },
  ],
  offerNotarization: false,
  states: 'all',
  complexity: 'medium',
  estimatedTime: '10-20 minutes',
  tags: ['employment', 'medium', 'legal', 'template', 'popular'],
  translations: {
    en: {
      name: 'Employment Contract',
      description:
        'Create a legally binding Employment Contract with our easy-to-use template. State-specific requirements included.',
      aliases: ['employment agreement'],
    },
    es: {
      name: 'Contrato de Empleo',
      description:
        'Crea un Empleo Contrato legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [],
    },
  },
};
