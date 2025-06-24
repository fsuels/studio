// src/app/[locale]/blog/[slug]/blog-post-client-content.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { blogArticles, type BlogArticle } from '@/data/blogArticles';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface BlogPostClientContentProps {
  locale: 'en' | 'es';
  slug: string | undefined;
}

interface RelatedDocument {
  id: string;
  title: string;
  description: string;
  href: string;
}

// Smart function to determine related documents based on blog content
function getRelatedDocuments(article: BlogArticle, locale: 'en' | 'es'): RelatedDocument[] {
  const langSuffix = locale === 'es' ? '_es' : '_en';
  const title = (article[`title${langSuffix}` as keyof BlogArticle] as string || '').toLowerCase();
  const content = (article[`content${langSuffix}` as keyof BlogArticle] as string || '').toLowerCase();
  const fullText = `${title} ${content}`;

  const documents: RelatedDocument[] = [];

  // Real Estate & Leasing
  if (fullText.includes('lease') || fullText.includes('rent') || fullText.includes('property') || fullText.includes('landlord') || fullText.includes('tenant')) {
    documents.push({
      id: 'lease-agreement',
      title: locale === 'es' ? 'Contrato de Arrendamiento' : 'Lease Agreement',
      description: locale === 'es' ? 'Contratos de alquiler para propiedades residenciales y comerciales' : 'Rental agreements for residential and commercial property',
      href: `/${locale}/docs/lease-agreement`
    });
    documents.push({
      id: 'eviction-notice',
      title: locale === 'es' ? 'Aviso de Desalojo' : 'Eviction Notice',
      description: locale === 'es' ? 'Notificación legal para inquilinos por incumplimiento' : 'Legal notice for tenant violations or termination',
      href: `/${locale}/docs/eviction-notice`
    });
  }

  // Business & Employment
  if (fullText.includes('business') || fullText.includes('company') || fullText.includes('startup') || fullText.includes('llc') || fullText.includes('corporation')) {
    documents.push({
      id: 'llc-operating-agreement',
      title: locale === 'es' ? 'Acuerdo Operativo de LLC' : 'LLC Operating Agreement',
      description: locale === 'es' ? 'Estructura tu LLC con gobernanza y propiedad adecuadas' : 'Structure your LLC with proper governance and ownership',
      href: `/${locale}/docs/llc-operating-agreement`
    });
    documents.push({
      id: 'non-disclosure-agreement',
      title: locale === 'es' ? 'Acuerdo de Confidencialidad' : 'Non-Disclosure Agreement',
      description: locale === 'es' ? 'Protege información confidencial en relaciones comerciales' : 'Protect confidential information in business relationships',
      href: `/${locale}/docs/non-disclosure-agreement`
    });
  }

  // Employment
  if (fullText.includes('employ') || fullText.includes('hire') || fullText.includes('job') || fullText.includes('work') || fullText.includes('contract')) {
    documents.push({
      id: 'employment-contract',
      title: locale === 'es' ? 'Contrato de Trabajo' : 'Employment Contract',
      description: locale === 'es' ? 'Define términos de empleo y responsabilidades claramente' : 'Define employment terms and responsibilities clearly',
      href: `/${locale}/docs/employment-contract`
    });
    documents.push({
      id: 'independent-contractor-agreement',
      title: locale === 'es' ? 'Acuerdo de Contratista Independiente' : 'Independent Contractor Agreement',
      description: locale === 'es' ? 'Contrata freelancers con alcance y pago claros' : 'Hire freelancers with clear scope and payment terms',
      href: `/${locale}/docs/independent-contractor-agreement`
    });
  }

  // Services & Contracts
  if (fullText.includes('service') || fullText.includes('contract') || fullText.includes('agreement') || fullText.includes('client')) {
    documents.push({
      id: 'service-agreement',
      title: locale === 'es' ? 'Acuerdo de Servicios' : 'Service Agreement',
      description: locale === 'es' ? 'Estructura relaciones de servicios profesionales' : 'Structure professional service relationships',
      href: `/${locale}/docs/service-agreement`
    });
  }

  // Legal & NDA specific
  if (fullText.includes('nda') || fullText.includes('confidential') || fullText.includes('non-disclosure') || fullText.includes('secret')) {
    if (!documents.find(d => d.id === 'non-disclosure-agreement')) {
      documents.push({
        id: 'non-disclosure-agreement',
        title: locale === 'es' ? 'Acuerdo de Confidencialidad' : 'Non-Disclosure Agreement',
        description: locale === 'es' ? 'Protege información confidencial en relaciones comerciales' : 'Protect confidential information in business relationships',
        href: `/${locale}/docs/non-disclosure-agreement`
      });
    }
  }

  // Family & Estate
  if (fullText.includes('will') || fullText.includes('estate') || fullText.includes('family') || fullText.includes('custody') || fullText.includes('divorce')) {
    documents.push({
      id: 'last-will-testament',
      title: locale === 'es' ? 'Último Testamento' : 'Last Will & Testament',
      description: locale === 'es' ? 'Declara tus deseos finales para la distribución de bienes' : 'State your final wishes for asset distribution after death',
      href: `/${locale}/docs/last-will-testament`
    });
    documents.push({
      id: 'power-of-attorney',
      title: locale === 'es' ? 'Poder Notarial' : 'Power of Attorney',
      description: locale === 'es' ? 'Otorga autoridad legal a alguien para actuar en tu nombre' : 'Grant someone authority to act on your behalf legally',
      href: `/${locale}/docs/power-of-attorney`
    });
  }

  // Remove duplicates and return first 4
  const uniqueDocuments = documents.filter((doc, index, self) => 
    index === self.findIndex(d => d.id === doc.id)
  );
  
  return uniqueDocuments.slice(0, 4);
}

export default function BlogPostClientContent({
  locale,
  slug,
}: BlogPostClientContentProps) {
  const { t, i18n } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [article, setArticle] = useState<BlogArticle | undefined>(undefined);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (slug) {
      const foundArticle = blogArticles.find((art) => art.slug === slug);
      setArticle(foundArticle);

      if (foundArticle) {
        const dateString = foundArticle.date;
        if (dateString) {
          try {
            const dateObj = new Date(dateString);
            // Use i18n.language for consistency if available, otherwise fallback to locale prop
            const langForDate = i18n.language || locale || 'en';
            setFormattedDate(
              dateObj.toLocaleDateString(langForDate, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            );
          } catch (e) {
            console.error('Error formatting date:', e);
            setFormattedDate(dateString);
          }
        } else {
          setFormattedDate('Date not available');
        }
      } else {
        setFormattedDate(null);
      }
    } else {
      setArticle(undefined);
      setFormattedDate(null);
    }
  }, [slug, locale, i18n.language]);

  const langSuffix = locale === 'es' ? '_es' : '_en';

  const placeholderTitle = t('Loading...', { defaultValue: 'Loading...' });
  const placeholderDate = t('Loading date...', {
    defaultValue: 'Loading date...',
  });
  const placeholderBody = `<p>${t('Loading content...', { defaultValue: 'Loading content...' })}</p>`;

  if (!isHydrated) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
        <div className="bg-muted h-8 w-3/4 mb-4"></div>
        <div className="bg-muted h-4 w-1/4 mb-8"></div>
        <div className="space-y-4">
          <div className="bg-muted h-4 w-full"></div>
          <div className="bg-muted h-4 w-full"></div>
          <div className="bg-muted h-4 w-5/6"></div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4 text-destructive">
          {t('Article Not Found', { defaultValue: 'Article Not Found' })}
        </h1>
        <p className="text-muted-foreground">
          {t('Could not find article with slug', {
            defaultValue: 'Could not find an article with the slug:',
          })}{' '}
          <span className="font-mono bg-muted px-1">{slug || 'unknown'}</span>.
        </p>
        <Button variant="outline" asChild className="mt-4">
          <Link href={`/${locale}/blog`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Blog', { defaultValue: 'Back to Blog' })}
          </Link>
        </Button>
      </main>
    );
  }

  const articleTitle =
    article[`title${langSuffix}` as keyof BlogArticle] || placeholderTitle;
  const articleBody =
    article[`content${langSuffix}` as keyof BlogArticle] || placeholderBody;

  // Get related documents for this article
  const relatedDocuments = getRelatedDocuments(article, locale);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link
            href={`/${locale}/blog`}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Blog', { defaultValue: 'Back to Blog' })}
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
        {articleTitle}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {formattedDate ? formattedDate : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground mb-16">
        <div dangerouslySetInnerHTML={{ __html: articleBody }} />
      </article>

      {/* Related Legal Documents Section */}
      {relatedDocuments.length > 0 && (
        <section className="mb-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              {locale === 'es' ? 'Documentos Legales Relacionados' : 'Related Legal Documents'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={doc.href}
                  className="group bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {doc.description}
                  </p>
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {locale === 'es' ? 'Comenzar Gratis →' : 'Start Free →'}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href={`/${locale}/docs`}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {locale === 'es' ? 'Ver Todas las Plantillas' : 'Browse All Templates'}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <nav className="flex justify-start border-t border-border pt-8 mt-12">
        <Button variant="outline" asChild>
          <Link href={`/${locale}/blog`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Blog', { defaultValue: 'Back to Blog' })}
          </Link>
        </Button>
      </nav>
    </main>
  );
}
