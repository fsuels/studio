import { generateMetadata as generateHomeMetadata } from '@/app/[locale]/page';
import { generateMetadata as generatePricingMetadata } from '@/app/[locale]/(marketing)/pricing/page';
import { generateMetadata as generateFeaturesMetadata } from '@/app/[locale]/(marketing)/features/page';
import { generateMetadata as generateTemplatesMetadata } from '@/app/[locale]/(marketing)/templates/page';
import { generateMetadata as generateBlogIndexMetadata } from '@/app/[locale]/(marketing)/blog/page';
import { generateMetadata as generateBlogArticleMetadata } from '@/app/[locale]/(marketing)/blog/[slug]/page';
import { generateMetadata as generateSignwellMetadata } from '@/app/[locale]/(marketing)/signwell/page';
import { generateMetadata as generateOnlineNotaryMetadata } from '@/app/[locale]/(marketing)/online-notary/page';
import { generateMetadata as generatePartnersMetadata } from '@/app/[locale]/(marketing)/partners/page';
import { generateMetadata as generateSupportMetadata } from '@/app/[locale]/(marketing)/support/page';
import { generateMetadata as generateFaqMetadata } from '@/app/[locale]/(marketing)/faq/page';
import { generateMetadata as generateSitemapMetadata } from '@/app/[locale]/(marketing)/sitemap/page';
import { blogArticles } from '@/data/blogArticles';
import { LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

jest.mock('@/app/[locale]/HomePageClient', () => ({
  __esModule: true,
  default: () => null,
}));

type Locale = 'en' | 'es';

type MetadataPromise = ReturnType<typeof generateHomeMetadata>;

const locales: Locale[] = ['en', 'es'];
const siteUrl = 'https://123legaldoc.com';
const sampleSlug = blogArticles[0]?.slug;

if (!sampleSlug) {
  throw new Error('blogArticles fixture must include at least one entry for metadata coverage tests.');
}

type RouteDefinition = {
  name: string;
  canonical: (locale: Locale) => string;
  getMetadata: (locale: Locale) => MetadataPromise;
};

const routeDefinitions: RouteDefinition[] = [
  {
    name: 'homepage',
    canonical: (locale) => '/' + locale + '/',
    getMetadata: (locale) => generateHomeMetadata({ params: { locale } }),
  },
  {
    name: 'pricing',
    canonical: (locale) => '/' + locale + '/pricing/',
    getMetadata: (locale) => generatePricingMetadata({ params: { locale } }),
  },
  {
    name: 'features',
    canonical: (locale) => '/' + locale + '/features/',
    getMetadata: (locale) => generateFeaturesMetadata({ params: { locale } }),
  },
  {
    name: 'templates',
    canonical: (locale) => '/' + locale + '/templates/',
    getMetadata: (locale) => generateTemplatesMetadata({ params: { locale } }),
  },
  {
    name: 'blog index',
    canonical: (locale) => '/' + locale + '/blog/',
    getMetadata: (locale) => generateBlogIndexMetadata({ params: { locale } }),
  },
  {
    name: 'blog article',
    canonical: (locale) => '/' + locale + '/blog/' + sampleSlug + '/',
    getMetadata: (locale) =>
      generateBlogArticleMetadata({ params: { locale, slug: sampleSlug } }),
  },
  {
    name: 'signwell landing',
    canonical: (locale) => '/' + locale + '/signwell/',
    getMetadata: (locale) => generateSignwellMetadata({ params: { locale } }),
  },
  {
    name: 'online notary landing',
    canonical: (locale) => '/' + locale + '/online-notary/',
    getMetadata: (locale) => generateOnlineNotaryMetadata({ params: { locale } }),
  },
  {
    name: 'partners landing',
    canonical: (locale) => '/' + locale + '/partners/',
    getMetadata: (locale) => generatePartnersMetadata({ params: { locale } }),
  },
  {
    name: 'support page',
    canonical: (locale) => '/' + locale + '/support/',
    getMetadata: (locale) => generateSupportMetadata({ params: { locale } }),
  },
  {
    name: 'faq page',
    canonical: (locale) => '/' + locale + '/faq/',
    getMetadata: (locale) => generateFaqMetadata({ params: { locale } }),
  },
  {
    name: 'sitemap',
    canonical: (locale) => '/' + locale + '/sitemap/',
    getMetadata: (locale) => generateSitemapMetadata({ params: { locale } }),
  },
];

describe('Marketing metadata localization', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
  });

  for (const route of routeDefinitions) {
    describe(route.name, () => {
      for (const locale of locales) {
        it('exposes canonical + hreflang metadata for ' + locale, async () => {
          const metadata = await route.getMetadata(locale);
          const languageAlternates = metadata.alternates?.languages as
            | Record<string, string>
            | undefined;

          expect(metadata.metadataBase?.href).toBe(siteUrl + '/');
          expect(metadata.alternates?.canonical).toBe(route.canonical(locale));
          expect(languageAlternates).toBeDefined();
          expect(languageAlternates).toMatchObject({
            en: siteUrl + route.canonical('en'),
            es: siteUrl + route.canonical('es'),
            'x-default': siteUrl + route.canonical('en'),
          });

          const openGraphUrl = metadata.openGraph?.url;
          expect(openGraphUrl).toBe(siteUrl + route.canonical(locale));

          const openGraphLocale = metadata.openGraph?.locale;
          expect(openGraphLocale).toBe(LOCALE_LANGUAGE_TAGS[locale]);

          const alternateLocale = metadata.openGraph?.alternateLocale;
          expect(alternateLocale).toBeDefined();
          const alternateLocaleArray = Array.isArray(alternateLocale)
            ? alternateLocale
            : [alternateLocale];
          const expectedAlternateLocales = locales
            .filter((item) => item !== locale)
            .map((item) => LOCALE_LANGUAGE_TAGS[item]);
          expect(alternateLocaleArray.sort()).toEqual(expectedAlternateLocales.sort());
        });
      }
    });
  }
});

