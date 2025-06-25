import { DocumentMetadata } from '@/types/documents';

export const indemnityAgreementMetadata: DocumentMetadata = {
  id: 'indemnity-agreement',
  title: 'Indemnity Agreement',
  slug: 'indemnity-agreement',
  description:
    'Secure financial protection against business losses and unexpected liabilities. Ensure compensation when things go wrong.',
  longDescription:
    'An Indemnity Agreement is a contractual obligation where one party (the indemnitor) agrees to compensate another party (the indemnitee) for losses or damages that may occur. This comprehensive document is commonly used in business transactions, construction projects, service agreements, and situations where financial protection against potential liabilities is needed.',
  category: 'Risk & Liability',
  tags: [
    'indemnification',
    'liability protection',
    'compensation agreement',
    'risk transfer',
    'financial protection',
  ],
  difficulty: 'advanced',
  timeToComplete: '20-25 minutes',
  price: 29.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and risk management.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/indemnity-agreement',
  image: '/images/documents/indemnity-agreement.svg',
  icon: 'shield-dollar',
  whatYouGet: [
    'Comprehensive indemnity agreement',
    'Clear compensation terms',
    'Scope of coverage definitions',
    'Limitation of liability clauses',
    'Insurance and bonding provisions',
  ],
  howItWorks: [
    'Identify parties and relationship',
    'Define covered activities or transactions',
    'Specify indemnification scope',
    'Set limits and exclusions',
    'Finalize and execute agreement',
  ],
  faqs: [
    {
      question: "What's the difference between indemnity and hold harmless?",
      answer:
        'Indemnity requires one party to compensate for losses, while hold harmless prevents liability claims. Many agreements combine both for comprehensive protection.',
    },
    {
      question: 'Can indemnity agreements cover future unknown risks?',
      answer:
        'Yes, broad indemnity agreements can cover unknown future risks, but courts may limit enforcement if the language is too vague or unconscionable.',
    },
    {
      question: 'Are there limits to indemnification?',
      answer:
        'Yes, indemnification typically cannot cover intentional wrongdoing, criminal acts, or gross negligence. Some states also limit indemnity for sole negligence.',
    },
  ],
  relatedDocuments: [
    'hold-harmless-agreement',
    'liability-waiver',
    'service-agreement',
  ],
  seoMetadata: {
    metaTitle: 'Indemnity Agreement Template | Legal Indemnification Form',
    metaDescription:
      'Create a professional indemnity agreement to protect against financial losses. Comprehensive template with customizable terms. Download instantly.',
    keywords: [
      'indemnity agreement',
      'indemnification form',
      'liability compensation',
      'risk transfer agreement',
      'financial protection',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'recommended',
};
