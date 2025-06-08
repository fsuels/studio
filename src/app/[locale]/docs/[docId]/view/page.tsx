// src/app/[locale]/docs/[docId]/view/page.tsx
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocumentDetail from '@/components/DocumentDetail';
import { Locale } from '@/lib/localizations'; // adjust import if you have a type for your locales

interface ViewPageProps {
  params: { locale: Locale; docId: string };
}

export const revalidate = 3600;

export default async function ViewPage({ params }: ViewPageProps) {
  const { locale, docId } = params;

  // 1) Verify this docId exists in your library
  //    (optional, but helpful to 404 early)
  const { documentLibrary } = await import('@/lib/document-library');
  const docConfig = documentLibrary.find((d) => d.id === docId);
  if (!docConfig) return notFound();

  // 2) Attempt to load the markdown source for this template
  let markdownContent: string | null = null;
  try {
    const mdPath = path.join(
      process.cwd(),
      'templates',
      locale,
      `${docId}.md`
    );
    markdownContent = await fs.readFile(mdPath, 'utf8');
  } catch {
    // file not found: we'll fall back to your PNG preview
    markdownContent = null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER BAR */}
      <header className="flex items-center justify-between p-6 bg-white shadow">
        <div className="flex items-center space-x-4">
          {/* Close button */}
          <Link
            href={`/${locale}/dashboard`}
            className="text-2xl font-bold text-gray-700 hover:text-gray-900"
            aria-label="Close viewer"
          >
            ×
          </Link>
          <h1 className="text-xl font-semibold">View Document</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit */}
          <Link
            href={`/${locale}/docs/${docId}/start`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </Link>

          {/* Sign */}
          <button
            onClick={() =>
              window.open(`/${locale}/signwell?docId=${docId}`, '_blank')
            }
            className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Sign
          </button>

          {/* Download */}
          <button
            onClick={() =>
              window.location.href = `/${locale}/checkout?docId=${docId}`
            }
            className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Download
          </button>
        </div>
      </header>

      {/* DOCUMENT PREVIEW */}
      <main className="p-8">
        <DocumentDetail
          docId={docId}
          locale={locale}
          markdownContent={markdownContent}
        />
      </main>
    </div>
  );
}
