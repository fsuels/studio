import { DocumentMetadata } from '@/types/documents';

export const incidentReportMetadata: DocumentMetadata = {
  id: 'incident-report',
  title: 'Incident Report',
  slug: 'incident-report',
  description: 'Create a professional incident report form to document workplace incidents, accidents, and safety concerns.',
  longDescription: 'An Incident Report is a formal document used to record details of workplace incidents, accidents, near-misses, or safety violations. This comprehensive form helps organizations maintain proper records for insurance, legal compliance, and safety improvement purposes.',
  category: 'Risk & Liability',
  tags: ['incident report', 'workplace safety', 'accident documentation', 'safety compliance', 'legal records'],
  difficulty: 'beginner',
  timeToComplete: '10-15 minutes',
  price: 14.95,
  state: 'US',
  author: {
    name: '123LegalDoc Team',
    title: 'Legal Document Specialists',
    bio: 'Expert team specializing in legal document preparation and workplace safety.'
  },
  lastUpdated: new Date().toISOString(),
  url: '/documents/incident-report',
  image: '/images/documents/incident-report.svg',
  icon: 'clipboard-list',
  whatYouGet: [
    'Comprehensive incident report form',
    'Witness information sections',
    'Injury and damage assessment',
    'Root cause analysis fields',
    'Follow-up action tracking'
  ],
  howItWorks: [
    'Enter incident basic information',
    'Describe what happened in detail',
    'Record witness statements',
    'Document injuries and damages',
    'Plan corrective actions'
  ],
  faqs: [
    {
      question: 'When should an incident report be filed?',
      answer: 'Incident reports should be filed immediately after any workplace accident, injury, near-miss, property damage, or safety violation occurs, regardless of severity.'
    },
    {
      question: 'Who should complete the incident report?',
      answer: 'The report should be completed by the person who witnessed the incident, the injured party (if able), or their supervisor. Multiple reports may be needed for complex incidents.'
    },
    {
      question: 'How long should incident reports be kept?',
      answer: 'Incident reports should be retained for at least 5 years, or longer if required by state law or industry regulations. Some injuries may require longer retention periods.'
    }
  ],
  relatedDocuments: ['accident-report', 'liability-waiver', 'safety-checklist'],
  seoMetadata: {
    metaTitle: 'Incident Report Form | Workplace Safety Documentation',
    metaDescription: 'Create professional incident reports for workplace accidents and safety incidents. Comprehensive form for legal compliance and insurance purposes.',
    keywords: ['incident report form', 'workplace accident report', 'safety incident documentation', 'injury report', 'workplace safety']
  },
  isAvailableInSpanish: true,
  notarizationRequired: 'none'
};