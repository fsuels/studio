// src/lib/documents/us/job-application-form/questions.ts
import type { FormQuestion } from '@/types/documents';

export const jobApplicationFormQuestions: FormQuestion[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter your company name',
    required: true,
    group: 'company',
  },
  {
    id: 'positionTitle',
    type: 'text',
    label: 'Position Title',
    placeholder: 'e.g., Software Developer, Marketing Manager',
    required: true,
    group: 'company',
  },
  {
    id: 'department',
    type: 'text',
    label: 'Department',
    placeholder: 'e.g., Engineering, Marketing, Sales',
    required: false,
    group: 'company',
  },
  {
    id: 'applicationDate',
    type: 'date',
    label: 'Application Date',
    required: true,
    group: 'company',
  },
  {
    id: 'collectPersonalInfo',
    type: 'checkbox',
    label: 'Collect personal information (name, address, phone)',
    required: false,
    group: 'sections',
  },
  {
    id: 'collectEducation',
    type: 'checkbox',
    label: 'Collect education information',
    required: false,
    group: 'sections',
  },
  {
    id: 'collectExperience',
    type: 'checkbox',
    label: 'Collect work experience/employment history',
    required: false,
    group: 'sections',
  },
  {
    id: 'collectReferences',
    type: 'checkbox',
    label: 'Collect references',
    required: false,
    group: 'sections',
  },
  {
    id: 'requireSSN',
    type: 'checkbox',
    label: 'Require Social Security Number',
    required: false,
    group: 'personal-fields',
  },
  {
    id: 'requireDOB',
    type: 'checkbox',
    label: 'Require Date of Birth',
    required: false,
    group: 'personal-fields',
  },
  {
    id: 'requireCitizenship',
    type: 'checkbox',
    label: 'Ask about citizenship/work authorization',
    required: false,
    group: 'personal-fields',
  },
  {
    id: 'minEmploymentHistory',
    type: 'number',
    label: 'Number of Previous Employers to Collect',
    placeholder: '3',
    required: false,
    min: 0,
    max: 10,
    group: 'employment',
  },
  {
    id: 'requireEmploymentGaps',
    type: 'checkbox',
    label: 'Require explanation of employment gaps',
    required: false,
    group: 'employment',
  },
  {
    id: 'requireSalaryHistory',
    type: 'checkbox',
    label: 'Ask for salary history (check local laws)',
    required: false,
    group: 'employment',
  },
  {
    id: 'requireHighSchool',
    type: 'checkbox',
    label: 'Require high school information',
    required: false,
    group: 'education',
  },
  {
    id: 'requireCollege',
    type: 'checkbox',
    label: 'Require college/university information',
    required: false,
    group: 'education',
  },
  {
    id: 'requireProfessionalCerts',
    type: 'checkbox',
    label: 'Ask for professional certifications',
    required: false,
    group: 'education',
  },
  {
    id: 'minReferences',
    type: 'number',
    label: 'Number of References Required',
    placeholder: '3',
    required: false,
    min: 0,
    max: 10,
    group: 'references',
  },
  {
    id: 'backgroundCheckConsent',
    type: 'checkbox',
    label: 'Include background check consent',
    required: false,
    group: 'background',
  },
  {
    id: 'drugTestConsent',
    type: 'checkbox',
    label: 'Include drug test consent',
    required: false,
    group: 'background',
  },
  {
    id: 'criminalHistoryDisclosure',
    type: 'checkbox',
    label: 'Ask about criminal history (check local laws)',
    required: false,
    group: 'background',
  },
  {
    id: 'collectSkills',
    type: 'checkbox',
    label: 'Collect skills and abilities',
    required: false,
    group: 'qualifications',
  },
  {
    id: 'collectCertifications',
    type: 'checkbox',
    label: 'Collect professional certifications',
    required: false,
    group: 'qualifications',
  },
  {
    id: 'collectLanguages',
    type: 'checkbox',
    label: 'Collect language skills',
    required: false,
    group: 'qualifications',
  },
  {
    id: 'collectAvailability',
    type: 'checkbox',
    label: 'Ask about availability/schedule preferences',
    required: false,
    group: 'availability',
  },
  {
    id: 'collectStartDate',
    type: 'checkbox',
    label: 'Ask for desired start date',
    required: false,
    group: 'availability',
  },
  {
    id: 'collectSalaryExpectations',
    type: 'checkbox',
    label: 'Ask for salary expectations (check local laws)',
    required: false,
    group: 'availability',
  },
  {
    id: 'requireTransportation',
    type: 'checkbox',
    label: 'Ask about reliable transportation',
    required: false,
    group: 'transportation',
  },
  {
    id: 'requireDriversLicense',
    type: 'checkbox',
    label: "Require valid driver's license",
    required: false,
    group: 'transportation',
  },
  {
    id: 'requireEmergencyContact',
    type: 'checkbox',
    label: 'Collect emergency contact information',
    required: false,
    group: 'emergency',
  },
  {
    id: 'equalOpportunityStatement',
    type: 'checkbox',
    label: 'Include Equal Opportunity Employer statement',
    required: false,
    group: 'legal',
  },
  {
    id: 'atWillStatement',
    type: 'checkbox',
    label: 'Include at-will employment statement',
    required: false,
    group: 'legal',
  },
  {
    id: 'accommodationsStatement',
    type: 'checkbox',
    label: 'Include reasonable accommodations statement',
    required: false,
    group: 'legal',
  },
  {
    id: 'requireSignature',
    type: 'checkbox',
    label: 'Require applicant signature',
    required: false,
    group: 'submission',
  },
  {
    id: 'requireDate',
    type: 'checkbox',
    label: 'Require signature date',
    required: false,
    group: 'submission',
  },
  {
    id: 'applicationInstructions',
    type: 'textarea',
    label: 'Application Instructions',
    placeholder:
      'Provide instructions for completing and submitting the application',
    required: false,
    group: 'submission',
  },
];
