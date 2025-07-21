import { DocumentMetadata } from '@/types/documents';

export const covid19HealthScreeningMetadata: DocumentMetadata = {
  id: 'covid19-health-screening',
  title: 'COVID-19 Health Screening Form',
  slug: 'covid19-health-screening',
  description:
    'Create a comprehensive COVID-19 health screening questionnaire for employees, visitors, and participants.',
  longDescription:
    'A COVID-19 Health Screening Form is essential for businesses, organizations, and events to assess potential COVID-19 exposure and symptoms. This form helps maintain workplace safety, comply with health guidelines, and protect employees and visitors.',
  category: 'Risk & Liability',
  tags: [
    'covid screening',
    'health questionnaire',
    'workplace safety',
    'pandemic response',
    'health compliance',
  ],
  difficulty: 'beginner',
  timeToComplete: '5-10 minutes',
  price: 9.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and workplace safety.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/covid19-health-screening',
  image: '/images/documents/covid19-health-screening.svg',
  icon: 'shield-virus',
  whatYouGet: [
    'Comprehensive health screening questionnaire',
    'Symptom assessment checklist',
    'Exposure tracking questions',
    'Privacy compliance language',
    'Daily screening format',
  ],
  howItWorks: [
    'Customize screening questions',
    'Set organization information',
    'Add specific health protocols',
    'Include privacy notices',
    'Implement daily screening',
  ],
  faqs: [
    {
      question: 'Is this form required by law?',
      answer:
        'While not federally mandated, many states and local jurisdictions have required health screenings. OSHA also recommends screening as part of workplace safety protocols.',
    },
    {
      question: 'How should screening results be handled?',
      answer:
        'Health information must be kept confidential and separate from personnel files. Follow HIPAA guidelines and local health department protocols for reporting and isolation.',
    },
    {
      question: 'Can this be used for visitors and contractors?',
      answer:
        'Yes, this form can be adapted for employees, visitors, contractors, customers, or anyone entering your facility or participating in your activities.',
    },
  ],
  relatedDocuments: ['liability-waiver', 'incident-report', 'workplace-policy'],
  seoMetadata: {
    metaTitle:
      'COVID-19 Health Screening Form | Workplace Safety Questionnaire',
    metaDescription:
      'Create professional COVID-19 health screening forms for workplace safety. Comprehensive questionnaire for employees and visitors.',
    keywords: [
      'covid health screening',
      'workplace health questionnaire',
      'covid screening form',
      'pandemic safety',
      'health compliance',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'none',
};
