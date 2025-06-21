import { DocumentMetadata } from '@/types/documents';

export const liabilityWaiverMetadata: DocumentMetadata = {
  id: 'liability-waiver',
  title: 'Liability Waiver',
  slug: 'liability-waiver',
  description:
    'Create a comprehensive liability waiver to protect your business from legal claims related to injuries, damages, or losses.',
  longDescription:
    'A Liability Waiver, also known as a release form or disclaimer, is a legal document that participants sign to acknowledge the risks involved in an activity and agree not to hold the organizer liable for injuries or damages. This document is essential for businesses offering potentially risky activities, sports facilities, event organizers, and service providers.',
  category: 'Risk & Liability',
  tags: [
    'waiver',
    'release form',
    'liability protection',
    'risk management',
    'legal protection',
  ],
  difficulty: 'intermediate',
  timeToComplete: '15-20 minutes',
  price: 24.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and risk management.',
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/liability-waiver',
  image: '/images/documents/liability-waiver.svg',
  icon: 'shield-check',
  whatYouGet: [
    'Comprehensive liability waiver form',
    'Clear assumption of risk language',
    'Medical emergency provisions',
    'Photo/video release options',
    'Parental consent for minors',
  ],
  howItWorks: [
    'Enter business/activity information',
    'Describe risks and activities',
    'Add emergency contact requirements',
    'Include additional clauses as needed',
    'Download and implement',
  ],
  faqs: [
    {
      question: 'Are liability waivers legally enforceable?',
      answer:
        'Yes, when properly written and signed, liability waivers are generally enforceable. However, they cannot protect against gross negligence, intentional harm, or violations of law.',
    },
    {
      question: 'Can minors sign liability waivers?',
      answer:
        'Minors cannot legally sign binding contracts. A parent or legal guardian must sign on their behalf, though some states may still allow the minor to pursue claims.',
    },
    {
      question: 'What activities require liability waivers?',
      answer:
        'Any activity with inherent risks should use waivers, including sports, fitness activities, adventure tourism, workshops with equipment, and events where injuries could occur.',
    },
  ],
  relatedDocuments: [
    'hold-harmless-agreement',
    'indemnity-agreement',
    'incident-report',
  ],
  seoMetadata: {
    metaTitle: 'Liability Waiver Form | Free Template & Legal Release',
    metaDescription:
      'Create a professional liability waiver to protect your business. Comprehensive release form with assumption of risk clauses. Download instantly.',
    keywords: [
      'liability waiver',
      'release form',
      'waiver template',
      'legal release',
      'risk waiver',
    ],
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'optional',
};
