import { DocumentMetadata } from '@/types/documents';

export const accidentReportMetadata: DocumentMetadata = {
  id: 'accident-report',
  title: 'Accident Report',
  slug: 'accident-report',
  description:
    'Create a comprehensive accident report form for documenting vehicle accidents, workplace accidents, and other incidents.',
  longDescription:
    'An Accident Report is a detailed form used to document accidents involving vehicles, workplace incidents, or other accidents. This comprehensive report helps with insurance claims, legal proceedings, and safety analysis by capturing all relevant details about the accident.',
  category: 'Risk & Liability',
  tags: [
    'accident report',
    'vehicle accident',
    'insurance claim',
    'incident documentation',
    'legal records',
  ],
  difficulty: 'beginner',
  timeToComplete: '15-20 minutes',
  price: 16.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and accident documentation.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/accident-report',
  image: '/images/documents/accident-report.svg',
  icon: 'car-crash',
  whatYouGet: [
    'Detailed accident report form',
    'Vehicle information sections',
    'Driver and passenger details',
    'Insurance information fields',
    'Witness statement areas',
  ],
  howItWorks: [
    'Enter accident basic information',
    'Record all parties involved',
    'Document vehicle details',
    'Collect witness information',
    'Describe accident circumstances',
  ],
  faqs: [
    {
      question: 'When should I file an accident report?',
      answer:
        'File an accident report immediately after any accident involving injury, significant property damage, or when required by law. Even minor accidents should be documented for insurance purposes.',
    },
    {
      question: 'What information do I need to complete the report?',
      answer:
        "You'll need driver's licenses, insurance information, vehicle details, witness contact information, and a detailed description of how the accident occurred.",
    },
    {
      question: 'Can I use this for workplace accidents?',
      answer:
        'While this form is designed primarily for vehicle accidents, it can be adapted for workplace or other types of accidents. Consider using our specific Incident Report for workplace incidents.',
    },
  ],
  relatedDocuments: ['incident-report', 'liability-waiver', 'insurance-claim'],
  seoMetadata: {
    metaTitle: 'Accident Report Form | Vehicle & Incident Documentation',
    metaDescription:
      'Create detailed accident reports for insurance claims and legal purposes. Comprehensive form for vehicle accidents and incident documentation.',
    keywords: [
      'accident report form',
      'vehicle accident report',
      'car accident documentation',
      'insurance claim form',
      'incident report',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'optional',
};
