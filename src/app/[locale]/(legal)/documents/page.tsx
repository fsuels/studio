/* src/app/[locale]/documents/page.tsx
   Document listing page showing all available documents */

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import for route-based code splitting
const DocumentsListingPageClientWrapper = dynamic(
  () => import('@/components/document/DocumentsListingPageClientWrapper'),
  {
    loading: () => (
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-96 mx-auto" />
            <Skeleton className="h-6 w-128 mx-auto" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>

          {/* Documents Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
);

/* -------------------------------------------------------------------------- */
/*  Static metadata for SEO                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: 'Legal Document Templates | 123LegalDoc',
  description:
    'Browse our comprehensive collection of legal document templates. Generate professionally drafted documents with state-specific compliance in minutes.',
  openGraph: {
    title: 'Legal Document Templates | 123LegalDoc',
    description:
      'Browse our comprehensive collection of legal document templates. Generate professionally drafted documents with state-specific compliance in minutes.',
  },
};

/*  Prerender /en/… and /es/… at build time */
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}


/* -------------------------------------------------------------------------- */
/*  Server Component shell — real UI lazy-loads in the client wrapper         */
/* -------------------------------------------------------------------------- */
export default async function DocumentsListingPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' }>;
}) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { locale } = await params; // kept for future enhancement
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  return (
    <main className="py-8">
      <DocumentsListingPageClientWrapper />
    </main>
  );
}
