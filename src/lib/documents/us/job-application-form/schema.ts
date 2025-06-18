// src/lib/documents/us/job-application-form/schema.ts
import { z } from 'zod';

export const JobApplicationFormSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  positionTitle: z.string().min(1, 'Position title is required'),
  department: z.string().optional(),
  applicationDate: z.string().min(1, 'Application date is required'),
  
  // Applicant Information Sections
  collectPersonalInfo: z.boolean().default(true),
  collectContactInfo: z.boolean().default(true),
  collectEducation: z.boolean().default(true),
  collectExperience: z.boolean().default(true),
  collectReferences: z.boolean().default(true),
  
  // Personal Information Fields
  requireSSN: z.boolean().default(false),
  requireDOB: z.boolean().default(false),
  requireGender: z.boolean().default(false),
  requireMaritalStatus: z.boolean().default(false),
  requireCitizenship: z.boolean().default(true),
  
  // Employment History
  minEmploymentHistory: z.number().min(0).max(10).default(3),
  requireEmploymentGaps: z.boolean().default(true),
  requireSalaryHistory: z.boolean().default(false),
  
  // Education
  requireHighSchool: z.boolean().default(true),
  requireCollege: z.boolean().default(false),
  requireProfessionalCerts: z.boolean().default(false),
  
  // References
  minReferences: z.number().min(0).max(10).default(3),
  referenceTypes: z.array(z.string()).default(['professional', 'personal']),
  
  // Background Check
  backgroundCheckConsent: z.boolean().default(false),
  drugTestConsent: z.boolean().default(false),
  criminalHistoryDisclosure: z.boolean().default(false),
  
  // Skills and Qualifications
  collectSkills: z.boolean().default(true),
  collectCertifications: z.boolean().default(false),
  collectLanguages: z.boolean().default(false),
  
  // Availability
  collectAvailability: z.boolean().default(true),
  collectStartDate: z.boolean().default(true),
  collectSalaryExpectations: z.boolean().default(false),
  
  // Transportation
  requireTransportation: z.boolean().default(false),
  requireDriversLicense: z.boolean().default(false),
  
  // Emergency Contact
  requireEmergencyContact: z.boolean().default(true),
  
  // Legal Disclosures
  equalOpportunityStatement: z.boolean().default(true),
  atWillStatement: z.boolean().default(true),
  accommodationsStatement: z.boolean().default(true),
  
  // Additional Questions
  customQuestions: z.array(z.object({
    question: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'checkbox']),
    required: z.boolean().default(false),
  })).default([]),
  
  // Application Submission
  requireSignature: z.boolean().default(true),
  requireDate: z.boolean().default(true),
  applicationInstructions: z.string().optional(),
});