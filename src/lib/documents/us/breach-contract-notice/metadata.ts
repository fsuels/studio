import { DocumentMetadata } from '@/types/documents';

export const breachContractNoticeMetadata: DocumentMetadata = {
  id: 'breach-contract-notice',
  title: 'Breach of Contract Notice',
  slug: 'breach-contract-notice',
  description:
    'Create a formal notice to notify a party that they have breached their contractual obligations and demand appropriate remedies.',
  longDescription:
    'A Breach of Contract Notice formally notifies the other party that they have failed to fulfill their contractual obligations. This notice serves as documentation of the breach, demands specific performance or remedies, and often serves as a prerequisite to legal action or contract termination.',
  category: 'Government & Legal Services',
  tags: [
    'breach of contract',
    'contract violation',
    'legal notice',
    'contract enforcement',
    'demand letter',
  ],
  difficulty: 'intermediate',
  timeToComplete: '20-25 minutes',
  price: 22.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and contract law.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/breach-contract-notice',
  image: '/images/documents/breach-contract-notice.svg',
  icon: 'document-x',
  whatYouGet: [
    'Professional breach of contract notice',
    'Detailed breach documentation',
    'Specific performance demands',
    'Remedy and cure period options',
    'Legal consequences outline',
  ],
  howItWorks: [
    'Identify the specific breach',
    'Reference contract provisions',
    'Document the violation details',
    'Demand specific remedies',
    'Set deadline for compliance',
  ],
  faqs: [
    {
      question: 'When should I send a breach of contract notice?',
      answer:
        'Send a breach notice as soon as you become aware of a material breach. Many contracts require written notice before you can pursue legal remedies or terminate the contract.',
    },
    {
      question: 'What constitutes a material breach?',
      answer:
        'A material breach is a failure to perform that goes to the essence of the contract and defeats its purpose. Minor or technical violations may not justify contract termination but still warrant notice.',
    },
    {
      question: 'Should I give them time to cure the breach?',
      answer:
        'Often yes, especially if the contract requires it. Giving a reasonable cure period shows good faith and may be legally required before you can terminate or sue.',
    },
  ],
  relatedDocuments: [
    'demand-letter-payment',
    'cease-desist-letter',
    'force-majeure-notice',
  ],
  seoMetadata: {
    metaTitle: 'Breach of Contract Notice | Legal Contract Violation Letter',
    metaDescription:
      'Create professional breach of contract notices for contract violations. Formal legal notice with remedy demands and enforcement provisions.',
    keywords: [
      'breach of contract notice',
      'contract violation letter',
      'contract enforcement',
      'legal notice',
      'contract breach',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'optional',
};
