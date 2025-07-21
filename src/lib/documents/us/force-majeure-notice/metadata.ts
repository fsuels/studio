import { DocumentMetadata } from '@/types/documents';

export const forceMajeureNoticeMetadata: DocumentMetadata = {
  id: 'force-majeure-notice',
  title: 'Force Majeure Notice',
  slug: 'force-majeure-notice',
  description:
    'Create a formal notice to invoke force majeure provisions due to unforeseeable circumstances beyond your control.',
  longDescription:
    'A Force Majeure Notice formally notifies contracting parties that you cannot fulfill contractual obligations due to extraordinary circumstances beyond your control. This notice helps protect against breach of contract claims during events like natural disasters, pandemics, government actions, or other unforeseeable events.',
  category: 'Risk & Liability',
  tags: [
    'force majeure',
    'contract excuse',
    'unforeseeable circumstances',
    'contract performance',
    'legal notice',
  ],
  difficulty: 'advanced',
  timeToComplete: '20-30 minutes',
  price: 24.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and contract law.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/force-majeure-notice',
  image: '/images/documents/force-majeure-notice.svg',
  icon: 'exclamation-triangle',
  whatYouGet: [
    'Professional force majeure notice',
    'Detailed event documentation',
    'Impact assessment on obligations',
    'Mitigation efforts description',
    'Timeline for resumed performance',
  ],
  howItWorks: [
    'Identify the force majeure event',
    'Reference contract provisions',
    'Document impact on performance',
    'Describe mitigation efforts',
    'Provide notice timeline',
  ],
  faqs: [
    {
      question: 'What qualifies as a force majeure event?',
      answer:
        'Force majeure events are typically unforeseeable circumstances beyond your control, such as natural disasters, wars, pandemics, government actions, or acts of God. The specific events are usually defined in your contract.',
    },
    {
      question: 'Do I need a force majeure clause in my contract?',
      answer:
        'Yes, most force majeure protections require a specific clause in your contract. Without such a clause, you may need to rely on other legal doctrines like impossibility or frustration of purpose.',
    },
    {
      question: 'How quickly must I give notice?',
      answer:
        'Force majeure clauses typically require prompt notice, often within a specific timeframe (e.g., 30 days). Check your contract for specific notice requirements and deadlines.',
    },
  ],
  relatedDocuments: [
    'breach-contract-notice',
    'service-agreement',
    'commercial-lease-agreement',
  ],
  seoMetadata: {
    metaTitle: 'Force Majeure Notice Template | Contract Performance Excuse',
    metaDescription:
      'Create professional force majeure notices for unforeseeable circumstances. Protect against breach claims during emergencies and disasters.',
    keywords: [
      'force majeure notice',
      'contract excuse',
      'unforeseeable circumstances',
      'act of god',
      'contract performance',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'optional',
};
