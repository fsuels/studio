/* src/app/[locale]/documents/promissory-note/page.tsx
   Placeholder page — no next-intl dependency, so the build won’t fail. */

import type { Metadata } from 'next';

// Static generation for document template pages (revalidate hourly)
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export const metadata: Metadata = {
  title: 'Promissory Note Template | 123LegalDoc',
  description:
    'Create a legally binding promissory note in minutes. Free PDF download, bilingual, attorney-reviewed.',
};

export default function PromissoryNotePage() {
  return (
    <>
      <h1>Promissory Note Page</h1>
      <p>
        This page is under construction. Replace this content with the actual
        Promissory Note form and information.
      </p>
    </>
  );
}
