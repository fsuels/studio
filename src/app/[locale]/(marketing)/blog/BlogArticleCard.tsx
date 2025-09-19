'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type BlogArticleCardProps = {
  locale: 'en' | 'es';
  href: string;
  slug: string;
  title: string;
  summary: string;
  dateLabel: string;
  readMoreLabel: string;
  ariaLabel: string;
  surface?: string;
};

export function BlogArticleCard({
  locale,
  href,
  slug,
  title,
  summary,
  dateLabel,
  readMoreLabel,
  ariaLabel,
  surface = 'blog_index',
}: BlogArticleCardProps) {
  const handleClick = useCallback(() => {
    track('blog_article_click', {
      locale,
      slug,
      surface,
      destination: href,
    });
  }, [href, locale, slug, surface]);

  return (
    <Link
      href={href}
      className="block border rounded-xl p-4 shadow hover:shadow-md transition hover:bg-muted"
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-1">{dateLabel}</p>
      <p className="text-sm text-muted-foreground">{summary}</p>
      <span className="mt-2 inline-block text-primary text-sm underline">{readMoreLabel}</span>
    </Link>
  );
}