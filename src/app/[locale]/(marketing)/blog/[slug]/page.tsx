// src/app/[locale]/blog/[slug]/page.tsx
// Server-rendered blog post to keep client bundle lean
import React from 'react';
import Link from 'next/link';
import { blogArticles, type BlogArticle } from '@/data/blogArticles';

export async function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'es']) {
    for (const article of blogArticles) {
      params!.push({ locale, slug: article.slug });
    }
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es'; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4 text-destructive">Article Not Found</h1>
        <p className="text-muted-foreground">Could not find an article with the slug: <span className="font-mono bg-muted px-1">{slug}</span></p>
        <div className="mt-4">
          <Link href={`/${locale}/blog`} className="underline">Back to Blog</Link>
        </div>
      </main>
    );
  }

  const langSuffix = locale === 'es' ? 'es' : 'en';
  const title = article[`title_${langSuffix}` as keyof BlogArticle] as string;
  const content = article[`content_${langSuffix}` as keyof BlogArticle] as string;
  const formattedDate = new Date(article.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const related = getRelatedDocuments(article, locale);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-4">
        <Link href={`/${locale}/blog`} className="text-sm text-primary underline">&larr; Back to Blog</Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mb-8">{formattedDate}</p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground mb-16">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {related.length > 0 && (
        <section className="mb-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Legal Documents</h2>
            <div className="grid gap-4">
              {related.map((doc) => (
                <Link key={doc.id} href={doc.href} className="block border rounded-lg p-4 bg-white dark:bg-gray-900 hover:bg-muted transition">
                  <h3 className="text-lg font-semibold mb-1">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="flex justify-between items-center border-t pt-6">
        <div>
          {article.prev && (
            <Link href={`/${locale}/blog/${article.prev}`} className="text-primary underline">
              &larr; Previous
            </Link>
          )}
        </div>
        <div>
          {article.next && (
            <Link href={`/${locale}/blog/${article.next}`} className="text-primary underline">
              Next &rarr;
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}

function getRelatedDocuments(article: BlogArticle, locale: 'en' | 'es') {
  const langSuffix = locale === 'es' ? '_es' : '_en';
  const title = ((article as any)[`title${langSuffix}`] as string || '').toLowerCase();
  const content = ((article as any)[`content${langSuffix}`] as string || '').toLowerCase();
  const full = `${title} ${content}`;
  const docs: Array<{ id: string; title: string; description: string; href: string }> = [];
  const add = (id: string, en: string, es: string, enDesc: string, esDesc: string) =>
    docs.push({
      id,
      title: locale === 'es' ? es : en,
      description: locale === 'es' ? esDesc : enDesc,
      href: `/${locale}/docs/${id}`,
    });

  if (/lease|rent|property|landlord|tenant/.test(full)) {
    add('lease-agreement', 'Lease Agreement', 'Contrato de Arrendamiento', 'Rental agreements for residential/commercial use', 'Contratos de alquiler residenciales/comerciales');
    add('eviction-notice', 'Eviction Notice', 'Aviso de Desalojo', 'Legal notice to tenants', 'Notificación legal a inquilinos');
  }
  if (/business|company|startup|llc|corporation/.test(full)) {
    add('llc-operating-agreement', 'LLC Operating Agreement', 'Acuerdo Operativo de LLC', 'Structure your LLC governance', 'Estructura la gobernanza de tu LLC');
    add('non-disclosure-agreement', 'Non-Disclosure Agreement', 'Acuerdo de Confidencialidad', 'Protect confidential information', 'Protege información confidencial');
  }
  if (/employ|hire|job|work/.test(full)) {
    add('employment-contract', 'Employment Contract', 'Contrato de Trabajo', 'Define terms and responsibilities', 'Define términos y responsabilidades');
    add('independent-contractor-agreement', 'Independent Contractor Agreement', 'Acuerdo de Contratista Independiente', 'Hire freelancers with clear scope', 'Contrata freelancers con alcance claro');
  }
  if (/service|contract|agreement|client/.test(full)) {
    add('service-agreement', 'Service Agreement', 'Acuerdo de Servicios', 'Structure professional services', 'Estructura servicios profesionales');
  }
  if (/nda|confidential|non-disclosure|secret/.test(full)) {
    if (!docs.find((d) => d.id === 'non-disclosure-agreement')) {
      add('non-disclosure-agreement', 'Non-Disclosure Agreement', 'Acuerdo de Confidencialidad', 'Protect confidential information', 'Protege información confidencial');
    }
  }
  if (/will|estate|probate|inherit/.test(full)) {
    add('last-will', 'Last Will & Testament', 'Última Voluntad y Testamento', 'Plan your estate properly', 'Planifica tu herencia adecuadamente');
  }
  return docs;
}
