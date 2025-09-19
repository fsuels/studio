'use client';

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type RelatedDocumentLinkProps = {
  locale: 'en' | 'es';
  href: string;
  documentId: string;
  title: string;
  description: ReactNode;
};

export function RelatedDocumentLink({ locale, href, documentId, title, description }: RelatedDocumentLinkProps) {
  const handleClick = useCallback(() => {
    track('blog_related_click', {
      locale,
      document_id: documentId,
      surface: 'related_documents',
      destination: href,
    });
  }, [documentId, href, locale]);

  return (
    <Link
      href={href}
      className="block border rounded-lg p-4 bg-white dark:bg-gray-900 hover:bg-muted transition"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}