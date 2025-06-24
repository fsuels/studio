import { MetadataRoute } from 'next';
import { usStates, allDocuments } from '@/lib/document-library';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://123legaldoc.com';
  const locales = ['en', 'es'];
  const sitemap: MetadataRoute.Sitemap = [];
  
  // Get current date for lastModified
  const currentDate = new Date();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Add homepage
  locales.forEach((locale) => {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          es: `${baseUrl}/es`,
        },
      },
    });
  });

  // Add main pages
  const mainPages = [
    'docs',
    'templates',
    'pricing',
    'features',
    'support',
    'faq',
    'blog',
    'privacy-policy',
    'terms-of-service',
    'about',
    'contact',
    'marketplace',
    'electronic-signature',
    'online-notary',
  ];
  
  // Add category navigation pages
  const categoryPages = [
    'agreements-contracts',
    'letters-notices', 
    'forms-authorizations',
    'family-personal',
    'business-commercial',
  ];

  mainPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/${page}`,
            es: `${baseUrl}/es/${page}`,
          },
        },
      });
    });
  });

  // Add category navigation pages
  categoryPages.forEach((category) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/categories/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/categories/${category}`,
            es: `${baseUrl}/es/categorias/${category}`,
          },
        },
      });
    });
  });

  // Add state pages
  usStates.forEach((state) => {
    const stateSlug = state.label.toLowerCase().replace(/\s+/g, '-');

    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/${stateSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/${stateSlug}`,
            es: `${baseUrl}/es/${stateSlug}`,
          },
        },
      });
    });
  });

  // Add document pages
  const documents = allDocuments.filter((doc) => doc.id !== 'general-inquiry');
  documents.forEach((doc) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/docs/${doc.id}`,
        lastModified: lastWeek,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/docs/${doc.id}`,
            es: `${baseUrl}/es/docs/${doc.id}`,
          },
        },
      });
    });
  });

  // Add state-specific document pages
  usStates.forEach((state) => {
    const stateSlug = state.label.toLowerCase().replace(/\s+/g, '-');

    documents.forEach((doc) => {
      // Check if document is available for this state
      if (
        doc.states === 'all' ||
        (Array.isArray(doc.states) && doc.states.includes(state.value))
      ) {
        locales.forEach((locale) => {
          sitemap.push({
            url: `${baseUrl}/${locale}/${stateSlug}/${doc.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9, // High priority for state-specific pages
            alternates: {
              languages: {
                en: `${baseUrl}/en/${stateSlug}/${doc.id}`,
                es: `${baseUrl}/es/${stateSlug}/${doc.id}`,
              },
            },
          });
        });
      }
    });
  });

  // Add document category pages
  const categories = Array.from(
    new Set(documents.map((doc) => doc.category).filter(Boolean)),
  );
  categories.forEach((category) => {
    const categorySlug = category!.toLowerCase().replace(/\s+/g, '-');

    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/docs/category/${categorySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
        alternates: {
          languages: {
            en: `${baseUrl}/en/docs/category/${categorySlug}`,
            es: `${baseUrl}/es/docs/category/${categorySlug}`,
          },
        },
      });
    });
  });

  // Add major cities (local SEO)
  const majorCities = [
    { name: 'New York', state: 'NY' },
    { name: 'Los Angeles', state: 'CA' },
    { name: 'Chicago', state: 'IL' },
    { name: 'Houston', state: 'TX' },
    { name: 'Phoenix', state: 'AZ' },
    { name: 'Philadelphia', state: 'PA' },
    { name: 'San Antonio', state: 'TX' },
    { name: 'San Diego', state: 'CA' },
    { name: 'Dallas', state: 'TX' },
    { name: 'San Jose', state: 'CA' },
    { name: 'Austin', state: 'TX' },
    { name: 'Jacksonville', state: 'FL' },
    { name: 'Fort Worth', state: 'TX' },
    { name: 'Columbus', state: 'OH' },
    { name: 'Charlotte', state: 'NC' },
    { name: 'San Francisco', state: 'CA' },
    { name: 'Indianapolis', state: 'IN' },
    { name: 'Seattle', state: 'WA' },
    { name: 'Denver', state: 'CO' },
    { name: 'Boston', state: 'MA' },
    { name: 'Miami', state: 'FL' },
    { name: 'Atlanta', state: 'GA' },
    { name: 'Las Vegas', state: 'NV' },
    { name: 'Detroit', state: 'MI' },
    { name: 'Nashville', state: 'TN' },
  ];

  majorCities.forEach((city) => {
    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');

    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/legal-documents-${citySlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/legal-documents-${citySlug}`,
            es: `${baseUrl}/es/documentos-legales-${citySlug}`,
          },
        },
      });
    });
  });

  // Add generated SEO content pages
  const seoContentTypes = [
    'city-pages',
    'comparison-pages', 
    'faq-pages',
    'how-to-guides',
    'industry-pages',
    'legal-updates',
    'state-documents',
    'template-pages'
  ];

  seoContentTypes.forEach((contentType) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/resources/${contentType}`,
        lastModified: lastWeek,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/resources/${contentType}`,
            es: `${baseUrl}/es/recursos/${contentType}`,
          },
        },
      });
    });
  });

  // Add all US state-specific document combinations for high-value keywords
  const highValueDocuments = [
    'vehicle-bill-of-sale',
    'lease-agreement', 
    'employment-contract',
    'llc-operating-agreement',
    'last-will-testament',
    'power-of-attorney',
    'non-disclosure-agreement',
    'independent-contractor-agreement'
  ];

  usStates.forEach((state) => {
    const stateSlug = state.label.toLowerCase().replace(/\s+/g, '-');
    
    highValueDocuments.forEach((docId) => {
      locales.forEach((locale) => {
        sitemap.push({
          url: `${baseUrl}/${locale}/states/${stateSlug}/${docId}`,
          lastModified: currentDate,
          changeFrequency: 'monthly', 
          priority: 0.9, // High priority for state-specific high-value docs
          alternates: {
            languages: {
              en: `${baseUrl}/en/states/${stateSlug}/${docId}`,
              es: `${baseUrl}/es/estados/${stateSlug}/${docId}`,
            },
          },
        });
      });
    });
  });

  return sitemap;
}

// Generate robots.txt
export function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '/dashboard/',
        '/generate/',
      ],
    },
    sitemap: 'https://123legaldoc.com/sitemap.xml',
    host: 'https://123legaldoc.com',
  };
}
