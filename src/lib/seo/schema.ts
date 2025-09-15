// Server-safe helpers for generating schema-related data

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function generateDocumentFAQs(
  documentType: string,
  state?: string,
  _locale: 'en' | 'es' = 'en',
): FAQItem[] {
  return [
    {
      question: `What is a ${documentType}?`,
      answer: `A ${documentType} is a legal document that serves specific purposes under ${state || 'US'} law. Our template ensures compliance with local requirements.`,
    },
    {
      question: `Do I need a lawyer to create a ${documentType}?`,
      answer: `While not always required, our ${documentType} template is designed to meet legal standards. For complex situations, consulting an attorney is recommended.`,
    },
    {
      question: `Is this ${documentType} template valid in ${state || 'all US states'}?`,
      answer: `Yes, our ${documentType} template is specifically designed for ${state || 'US'} requirements and includes state-specific provisions where necessary.`,
    },
    {
      question: `How long does it take to complete a ${documentType}?`,
      answer: `Most users complete their ${documentType} in 10-15 minutes using our guided questionnaire.`,
    },
    {
      question: `Can I edit the ${documentType} after downloading?`,
      answer: `Yes, you receive both PDF and editable Word versions of your ${documentType}.`,
    },
  ];
}

export function generateDocumentHowToSteps(documentType: string): HowToStep[] {
  return [
    {
      name: 'Choose Your Document',
      text: `Select the ${documentType} template that matches your needs.`,
    },
    {
      name: 'Answer Questions',
      text: `Complete our guided questionnaire with your specific information.`,
    },
    {
      name: 'Review & Customize',
      text: `Review your ${documentType} and make any necessary adjustments.`,
    },
    {
      name: 'Download & Use',
      text: `Download your completed ${documentType} in PDF and Word formats.`,
    },
  ];
}

