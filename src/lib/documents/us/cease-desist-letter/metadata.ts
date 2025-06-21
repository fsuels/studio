import { DocumentMetadata } from '@/types/documents';

export const ceaseDesistLetterMetadata: DocumentMetadata = {
  id: 'cease-desist-letter',
  title: 'Cease & Desist Letter',
  slug: 'cease-desist-letter',
  description:
    'Create a professional cease and desist letter to demand someone stop harmful or illegal activities.',
  longDescription:
    'A Cease & Desist Letter is a formal legal notice demanding that an individual or organization immediately stop specified activities that are harmful, illegal, or infringing on your rights. This document serves as evidence of notice and can be used before pursuing legal action.',
  category: 'Government & Legal Services',
  tags: [
    'cease desist',
    'legal notice',
    'infringement',
    'harassment',
    'trademark violation',
  ],
  difficulty: 'intermediate',
  timeToComplete: '15-20 minutes',
  price: 19.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and intellectual property protection.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/cease-desist-letter',
  image: '/images/documents/cease-desist-letter.svg',
  icon: 'stop-circle',
  whatYouGet: [
    'Professional cease and desist letter',
    'Clear demand for specific actions',
    'Legal basis and evidence section',
    'Consequences of non-compliance',
    'Proof of service provisions',
  ],
  howItWorks: [
    'Identify the harmful activity',
    'Gather evidence and documentation',
    'Specify demanded actions',
    'Set compliance deadline',
    'Send via certified mail',
  ],
  faqs: [
    {
      question: 'When should I send a cease and desist letter?',
      answer:
        "Send one when someone is infringing your rights, harassing you, using your intellectual property without permission, or engaging in defamatory activities. It's often a required first step before legal action.",
    },
    {
      question: 'Is a cease and desist letter legally binding?',
      answer:
        'The letter itself is not legally binding, but it serves as formal notice. Ignoring it can strengthen your case in court and may lead to additional damages or injunctive relief.',
    },
    {
      question: 'Should I hire a lawyer to send this letter?',
      answer:
        'While not required, having an attorney send the letter often carries more weight. However, a well-drafted letter from you can be effective and much less expensive.',
    },
  ],
  relatedDocuments: ['demand-letter-payment', 'breach-contract-notice', 'nda'],
  seoMetadata: {
    metaTitle:
      'Cease & Desist Letter Template | Stop Harassment & Infringement',
    metaDescription:
      'Create professional cease and desist letters to stop harassment, trademark infringement, and other harmful activities. Legal template with enforcement provisions.',
    keywords: [
      'cease and desist letter',
      'stop harassment letter',
      'trademark infringement',
      'legal notice',
      'demand letter',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'none',
};
