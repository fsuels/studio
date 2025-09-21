// src/app/share/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

interface SharePageProps {
  searchParams?: Record<string, string | string[]>;
}

const DEFAULT_LINK_ID = 'example-123';

function normalizeLinkId(raw?: string | string[]): string {
  if (!raw) {
    return DEFAULT_LINK_ID;
  }
  return Array.isArray(raw) ? raw[0] ?? DEFAULT_LINK_ID : raw;
}

export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const linkId = normalizeLinkId(searchParams?.linkId);
  return {
    title: `Shared Document ${linkId} | 123LegalDoc`,
    description: 'Review the shared document contents for collaboration.',
  };
}

export default function SharePage({ searchParams }: SharePageProps) {
  const linkId = normalizeLinkId(searchParams?.linkId);

  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold">Shared Document</h1>
      <p className="mt-4">
        Viewing document shared with ID:{' '}
        <span className="font-mono bg-muted px-2 py-1 rounded">{linkId}</span>
      </p>
      <div className="mt-8 border rounded-md p-4 min-h-[200px] flex items-center justify-center bg-muted/50">
        <p className="text-muted-foreground italic">
          Shared document content would appear here once hydration completes.
        </p>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Looking for another document?{' '}
        <Link className="underline" href="/en">
          Return to the homepage
        </Link>
        .
      </p>
    </main>
  );
}
