'use client';

import { SchemaMarkup } from './SchemaMarkup';

interface LocalBusinessSchemaProps {
  businessName?: string;
  city?: string;
  state?: string;
  country?: string;
  serviceTypes?: string[];
  areaServed?: string[];
  description?: string;
}

export function LocalBusinessSchema({
  businessName = '123LegalDoc',
  city,
  state,
  country = 'United States',
  serviceTypes = [
    'Legal Document Preparation',
    'Legal Forms',
    'Document Templates',
  ],
  areaServed = ['United States', 'Mexico', 'Spain'],
  description = 'Professional legal document templates and forms for individuals and businesses',
}: LocalBusinessSchemaProps) {
  const address =
    city && state
      ? {
          streetAddress: '',
          addressLocality: city,
          addressRegion: state,
          postalCode: '',
          addressCountry: country,
        }
      : undefined;

  const schemaData = {
    businessName,
    address,
    url: 'https://123legaldoc.com',
    telephone: '+1-800-LEGAL-DOC',
    areaServed: areaServed,
    serviceType: serviceTypes.join(', '),
    description,
  };

  // Additional structured data for legal services
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'ProfessionalService'],
    name: businessName,
    description: description,
    url: 'https://123legaldoc.com',
    serviceType: serviceTypes,
    areaServed: areaServed.map((area) => ({
      '@type': area.includes('United States') ? 'Country' : 'Country',
      name: area,
    })),
    offers: serviceTypes.map((service) => ({
      '@type': 'Offer',
      name: service,
      description: `Professional ${service.toLowerCase()} services`,
      priceCurrency: 'USD',
      price: '0',
      availability: 'https://schema.org/InStock',
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Legal Document Templates',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Business Documents',
          description: 'LLC, Corporation, Partnership agreements and more',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Personal Documents',
          description: 'Wills, Power of Attorney, Living Trusts and more',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Real Estate Documents',
          description: 'Lease agreements, Deeds, Purchase contracts and more',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Employment Documents',
          description:
            'Employment contracts, NDAs, Termination letters and more',
        },
      ],
    },
    sameAs: [
      'https://www.facebook.com/123legaldoc',
      'https://www.twitter.com/123legaldoc',
      'https://www.linkedin.com/company/123legaldoc',
      'https://www.youtube.com/c/123legaldoc',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-LEGAL-DOC',
      contactType: 'customer service',
      availableLanguage: ['English', 'Spanish'],
      areaServed: areaServed,
    },
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address,
      },
    }),
  };

  return (
    <>
      <SchemaMarkup type="LocalBusiness" data={schemaData} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(legalServiceSchema),
        }}
      />
    </>
  );
}

// Helper component for state-specific legal service schema
export function StateSpecificLegalSchema({
  state,
  documentTypes = [],
  locale = 'en',
}: {
  state: string;
  documentTypes?: string[];
  locale?: string;
}) {
  const isSpanish = locale === 'es';

  const stateSpecificSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: isSpanish
      ? `Documentos Legales de ${state} - 123LegalDoc`
      : `${state} Legal Documents - 123LegalDoc`,
    description: isSpanish
      ? `Plantillas de documentos legales específicas para ${state}. Formularios gratuitos que cumplen con las leyes estatales.`
      : `State-specific legal document templates for ${state}. Free forms that comply with state laws.`,
    serviceType: 'Legal Document Preparation',
    areaServed: {
      '@type': 'State',
      name: state,
    },
    provider: {
      '@type': 'Organization',
      name: '123LegalDoc',
      url: 'https://123legaldoc.com',
    },
    hasOfferCatalog:
      documentTypes.length > 0
        ? {
            '@type': 'OfferCatalog',
            name: isSpanish ? `Documentos de ${state}` : `${state} Documents`,
            itemListElement: documentTypes.map((docType) => ({
              '@type': 'Offer',
              name: docType,
              description: isSpanish
                ? `Plantilla de ${docType} para ${state}`
                : `${docType} template for ${state}`,
              priceCurrency: 'USD',
              price: '0',
            })),
          }
        : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(stateSpecificSchema),
      }}
    />
  );
}
