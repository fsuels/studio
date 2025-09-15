// src/app/[locale]/blog/page.tsx
// Server-rendered blog index to keep client bundle lean
import React from 'react';
import Link from 'next/link';
import { blogArticles } from '@/data/blogArticles';

type BlogPageProps = {
  params: Promise<{ locale: 'en' | 'es' }>;
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const langSuffix = locale === 'es' ? 'es' : 'en';
  const articles = blogArticles
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid gap-4">
        {articles.map((a) => {
          const title = (a as any)[`title_${langSuffix}`] as string;
          const summary = (a as any)[`summary_${langSuffix}`] as string;
          const date = new Date(a.date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          return (
            <Link key={a.slug} href={`/${locale}/blog/${a.slug}`} className="block border rounded-xl p-4 shadow hover:shadow-md transition hover:bg-muted">
              <h2 className="text-xl font-semibold mb-1">{title}</h2>
              <p className="text-sm text-muted-foreground mb-1">{date}</p>
              <p className="text-sm text-muted-foreground">{summary}</p>
              <span className="mt-2 inline-block text-primary text-sm underline">Read more →</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
