'use client';

import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface SchemaMarkupProps {
  type: 'LegalService' | 'FAQ' | 'HowTo' | 'LocalBusiness' | 'BreadcrumbList';
  data: {
    // LegalService schema
    serviceName?: string;
    serviceDescription?: string;
    provider?: {
      name: string;
      url: string;
    };
    areaServed?: string[];
    serviceType?: string;

    // FAQ schema
    faqs?: FAQItem[];

    // HowTo schema
    name?: string;
    description?: string;
    steps?: HowToStep[];

    // LocalBusiness schema
    businessName?: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    telephone?: string;
    url?: string;

    // BreadcrumbList schema
    breadcrumbs?: Array<{
      name: string;
      url: string;
      position: number;
    }>;
  };
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const { i18n } = useTranslation();

  const generateSchema = () => {
    const baseContext = 'https://schema.org';

    switch (type) {
      case 'LegalService':
        return {
          '@context': baseContext,
          '@type': 'LegalService',
          name: data.serviceName,
          description: data.serviceDescription,
          provider: {
            '@type': 'Organization',
            name: data.provider?.name || '123LegalDoc',
            url: data.provider?.url || 'https://123legaldoc.com',
          },
          areaServed: data.areaServed?.map((area) => ({
            '@type': 'State',
            name: area,
          })),
          serviceType: data.serviceType || 'Legal Document Preparation',
          url: typeof window !== 'undefined' ? window.location.href : '',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: '0',
            description: 'Free legal document templates',
          },
        };

      case 'FAQ':
        return {
          '@context': baseContext,
          '@type': 'FAQPage',
          mainEntity: data.faqs?.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };

      case 'HowTo':
        return {
          '@context': baseContext,
          '@type': 'HowTo',
          name: data.name,
          description: data.description,
          step: data.steps?.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            url: step.url,
          })),
        };

      case 'LocalBusiness':
        return {
          '@context': baseContext,
          '@type': 'LegalService',
          name: data.businessName || '123LegalDoc',
          address: data.address
            ? {
                '@type': 'PostalAddress',
                ...data.address,
              }
            : undefined,
          telephone: data.telephone,
          url: data.url || 'https://123legaldoc.com',
          serviceArea: data.areaServed?.map((area) => ({
            '@type': 'State',
            name: area,
          })),
        };

      case 'BreadcrumbList':
        return {
          '@context': baseContext,
          '@type': 'BreadcrumbList',
          itemListElement: data.breadcrumbs?.map((crumb) => ({
            '@type': 'ListItem',
            position: crumb.position,
            name: crumb.name,
            item: crumb.url,
          })),
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// Helper function to generate common FAQ schemas
export function generateDocumentFAQs(
  documentType: string,
  state?: string,
  locale = 'en',
) {
  const faqs: FAQItem[] = [
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

  return faqs;
}

// Helper function to generate HowTo steps for document creation
export function generateDocumentHowToSteps(documentType: string) {
  const steps: HowToStep[] = [
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

  return steps;
}
