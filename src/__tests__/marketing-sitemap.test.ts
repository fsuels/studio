import { buildSitemapStructuredData, generateMetadata, localizedContent } from '@/app/[locale]/(marketing)/sitemap/page';

describe('marketing sitemap localization', () => {
  it('returns localized metadata and hreflang alternates for Spanish locale', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'es' }) });

    expect(metadata.title).toBe(localizedContent.es.metadata.title);
    expect(metadata.description).toBe(localizedContent.es.metadata.description);
    expect(metadata.alternates?.canonical).toBe('/es/sitemap/');
    expect(metadata.alternates?.languages?.es).toBe('https://123legaldoc.com/es/sitemap/');
    expect(metadata.alternates?.languages?.en).toBe('https://123legaldoc.com/en/sitemap/');
    expect(metadata.openGraph?.locale).toBe('es-US');
    expect(metadata.openGraph?.alternateLocale).toContain('en-US');
  });

  it('builds JSON-LD with locale-prefixed URLs', () => {
    const structured = JSON.parse(buildSitemapStructuredData('es')) as {
      url: string;
      hasPart: Array<{ name: string; itemListElement: Array<{ url: string }> }>;
    };

    expect(structured.url).toBe('https://123legaldoc.com/es/sitemap/');

    const productList = structured.hasPart.find((part) => part.name === 'Producto');
    expect(productList).toBeDefined();
    expect(productList?.itemListElement[0].url).toBe('https://123legaldoc.com/es');
  });
});
