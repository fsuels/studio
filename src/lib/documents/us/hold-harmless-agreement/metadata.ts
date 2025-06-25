import { DocumentMetadata } from '@/types/documents';

export const holdHarmlessAgreementMetadata: DocumentMetadata = {
  id: 'hold-harmless-agreement',
  title: 'Hold Harmless Agreement',
  slug: 'hold-harmless-agreement',
  description:
    'Protect your business from costly lawsuits and liability claims. Essential protection for high-risk activities and business operations.',
  longDescription:
    'A Hold Harmless Agreement, also known as an indemnity agreement or release of liability, is a legal contract where one party agrees not to hold another party responsible for any damages, injuries, or losses that may occur. This document is commonly used in business transactions, construction projects, event planning, and various activities where risk is involved.',
  category: 'Risk & Liability',
  tags: [
    'liability',
    'risk management',
    'indemnification',
    'release',
    'protection',
  ],
  difficulty: 'intermediate',
  timeToComplete: '10-15 minutes',
  price: 19.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and risk management.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/hold-harmless-agreement',
  image: '/images/documents/hold-harmless-agreement.svg',
  icon: 'shield',
  whatYouGet: [
    'Customized Hold Harmless Agreement',
    'Clear liability protection terms',
    'Indemnification clauses',
    'Scope of coverage definitions',
    'Legal enforceability provisions',
  ],
  howItWorks: [
    'Enter party information',
    'Describe the activity or situation',
    'Specify risks and exclusions',
    'Review and finalize agreement',
    'Download and sign',
  ],
  faqs: [
    {
      question: 'When do I need a Hold Harmless Agreement?',
      answer:
        'You need this agreement when engaging in activities that involve potential risk, such as construction projects, event hosting, property rentals, or providing services where injuries or damages could occur.',
    },
    {
      question: 'Is a Hold Harmless Agreement legally binding?',
      answer:
        'Yes, when properly drafted and signed, these agreements are legally binding. However, they cannot protect against gross negligence, intentional harm, or illegal activities.',
    },
    {
      question:
        "What's the difference between mutual and unilateral agreements?",
      answer:
        'A unilateral agreement protects only one party, while a mutual agreement provides protection to both parties involved in the activity or transaction.',
    },
  ],
  relatedDocuments: [
    'liability-waiver',
    'indemnity-agreement',
    'service-agreement',
  ],
  seoMetadata: {
    metaTitle: 'Hold Harmless Agreement | Free Template & Legal Form',
    metaDescription:
      'Create a professional Hold Harmless Agreement to protect against liability. Customizable template with indemnification clauses. Download instantly.',
    keywords: [
      'hold harmless agreement',
      'indemnity agreement',
      'liability protection',
      'release of liability',
      'legal protection',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'recommended',
};
