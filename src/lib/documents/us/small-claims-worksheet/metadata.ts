import { DocumentMetadata } from '@/types/documents';

export const smallClaimsWorksheetMetadata: DocumentMetadata = {
  id: 'small-claims-worksheet',
  title: 'Small Claims Worksheet',
  slug: 'small-claims-worksheet',
  description:
    'Organize your case information and prepare for small claims court with this comprehensive worksheet and case preparation guide.',
  longDescription:
    'A Small Claims Worksheet helps you organize all the information needed for your small claims court case. This comprehensive preparation tool guides you through gathering evidence, calculating damages, and preparing your arguments for court.',
  category: 'Government & Legal Services',
  tags: [
    'small claims',
    'court preparation',
    'lawsuit',
    'case organization',
    'legal worksheet',
  ],
  difficulty: 'intermediate',
  timeToComplete: '30-45 minutes',
  price: 17.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and court procedures.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/small-claims-worksheet',
  image: '/images/documents/small-claims-worksheet.svg',
  icon: 'clipboard-document',
  whatYouGet: [
    'Comprehensive case organization worksheet',
    'Evidence tracking checklist',
    'Damages calculation guide',
    'Court appearance preparation',
    'Settlement negotiation framework',
  ],
  howItWorks: [
    'Document your case details',
    'Organize evidence and witnesses',
    'Calculate all damages and costs',
    'Prepare court presentation',
    'Consider settlement options',
  ],
  faqs: [
    {
      question: 'What types of cases can I file in small claims court?',
      answer:
        'Small claims courts handle disputes under a certain dollar amount (varies by state, typically $2,500-$25,000). Common cases include unpaid debts, property damage, broken contracts, and landlord-tenant disputes.',
    },
    {
      question: 'Do I need a lawyer for small claims court?',
      answer:
        'Most small claims courts are designed for people to represent themselves without lawyers. In fact, many states prohibit or limit attorney representation in small claims court.',
    },
    {
      question: 'What evidence should I bring to court?',
      answer:
        'Bring all relevant documents, photos, contracts, receipts, correspondence, and witness statements. Organize everything chronologically and make copies for the judge and defendant.',
    },
  ],
  relatedDocuments: [
    'demand-letter-payment',
    'breach-contract-notice',
    'service-agreement',
  ],
  seoMetadata: {
    metaTitle: 'Small Claims Worksheet | Court Case Preparation Guide',
    metaDescription:
      'Organize your small claims court case with our comprehensive worksheet. Prepare evidence, calculate damages, and plan your court presentation.',
    keywords: [
      'small claims court',
      'lawsuit preparation',
      'court worksheet',
      'case organization',
      'legal preparation',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'none',
};
