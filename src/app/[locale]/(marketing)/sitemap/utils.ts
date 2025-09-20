import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

export type SitemapLocale = 'en' | 'es';

export const localizedContent = {
  en: {
    heading: 'Sitemap',
    intro: 'Jump to the pages you need across our product, resources, and policy hubs.',
    metadata: {
      title: 'Sitemap | 123LegalDoc',
      description: 'Browse 123LegalDoc pages and resources.',
      keywords: '123legaldoc sitemap, legal document sitemap, legal template links',
      ogTitle: '123LegalDoc Site Map',
      ogDescription: 'Jump to legal document templates, pricing, support, and policy resources.',
    },
    sections: [
      {
        title: 'Product',
        links: [
          { href: '', label: 'Home' },
          { href: 'templates', label: 'Templates' },
          { href: 'pricing', label: 'Pricing' },
          { href: 'signwell', label: 'eSignatures' },
          { href: 'online-notary', label: 'Online Notary' },
          { href: 'partners', label: 'Partners' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { href: 'blog', label: 'Blog' },
          { href: 'faq', label: 'FAQ' },
          { href: 'support', label: 'Support' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { href: 'disclaimer', label: 'Disclaimer' },
          { href: 'terms-of-service', label: 'Terms of Service' },
          { href: 'privacy-policy', label: 'Privacy Policy' },
          { href: 'refund-policy', label: 'Refund Policy' },
        ],
      },
    ],
  },
  es: {
    heading: 'Mapa del Sitio',
    intro: 'Encuentra rA?pidamente las secciones clave del producto, los recursos y las polA-ticas.',
    metadata: {
      title: 'Mapa del Sitio | 123LegalDoc',
      description: 'Explora las pA?ginas y recursos de 123LegalDoc.',
      keywords: 'mapa del sitio 123legaldoc, mapa documentos legales, enlaces plantillas legales',
      ogTitle: 'Mapa del Sitio 123LegalDoc',
      ogDescription: 'Accede a plantillas legales, precios, soporte y recursos de polA-ticas.',
    },
    sections: [
      {
        title: 'Producto',
        links: [
          { href: '', label: 'Inicio' },
          { href: 'templates', label: 'Plantillas' },
          { href: 'pricing', label: 'Precios' },
          { href: 'signwell', label: 'Firmas ElectrA3nicas' },
          { href: 'online-notary', label: 'NotarA-a en LA-nea' },
          { href: 'partners', label: 'Socios' },
        ],
      },
      {
        title: 'Recursos',
        links: [
          { href: 'blog', label: 'Blog' },
          { href: 'faq', label: 'Preguntas Frecuentes' },
          { href: 'support', label: 'Soporte' },
        ],
      },
      {
        title: 'Legales',
        links: [
          { href: 'disclaimer', label: 'Aviso Legal' },
          { href: 'terms-of-service', label: 'TAcrminos del Servicio' },
          { href: 'privacy-policy', label: 'PolA-tica de Privacidad' },
          { href: 'refund-policy', label: 'PolA-tica de Reembolsos' },
        ],
      },
    ],
  },
} as const;

export function buildLocaleHref(locale: SitemapLocale, href: string): string {
  if (!href) {
    return '/' + locale;
  }

  if (href.startsWith('/')) {
    return ('/' + locale + href).replace('//', '/');
  }

  return '/' + locale + '/' + href;
}

export function getLocalizedSections(locale: SitemapLocale) {
  const content = localizedContent[locale];

  return content.sections.map((section) => ({
    title: section.title,
    links: section.links.map((link) => {
      const href = buildLocaleHref(locale, link.href);
      return { ...link, href };
    }),
  }));
}

export function buildSitemapStructuredData(locale: SitemapLocale): string {
  const siteUrl = getSiteUrl();
  const content = localizedContent[locale];
  const sections = getLocalizedSections(locale);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.metadata.title,
    description: content.metadata.description,
    url: siteUrl + '/' + locale + '/sitemap/',
    inLanguage: LOCALE_LANGUAGE_TAGS[locale],
    hasPart: sections.map((section) => ({
      '@type': 'ItemList',
      name: section.title,
      itemListElement: section.links.map((link, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: link.label,
        url: siteUrl + link.href,
      })),
    })),
  };

  return JSON.stringify(structuredData).replace(/</g, '\\u003c');
}
