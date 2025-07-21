// src/app/[locale]/docs/page.tsx
// This is an optional index page for all documents.
// You can redirect to the main homepage or show a list of all categories/documents here.
import { redirect } from 'next/navigation';

interface DocsIndexPageProps {
  params: { locale: string };
}

export default function DocsIndexPage({ params }: DocsIndexPageProps) {
  const locale = params.locale;

  // For now, redirect to the homepage's document selection area
  redirect(`/${locale}/#workflow-start`);

  // Or, you could render a list of all documents/categories:
  // return (
  //   <main className="container mx-auto py-8">
  //     <h1 className="text-3xl font-bold">Document Library</h1>
  //     {/* Add logic to list all categories or documents here */}
  //   </main>
  // );
  return null;
}
