import { getAllDocumentMetadata } from '@/lib/document-metadata-registry';
import { getAllDocuments } from '@/lib/document-library';
import { localizations } from '@/lib/localizations';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

export const revalidate = 3600;

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const params: { locale: 'en' | 'es'; docId: string }[] = [];
  const documentMetadata = getAllDocumentMetadata();
  for (const locale of localizations) {
    for (const doc of documentMetadata) {
      if (doc.id && doc.id !== 'general-inquiry') {
        params.push({ locale, docId: doc.id });
      }
    }
  }
  return params;
}

export default async function CompletePage({
  params,
}: {
  params: { locale: 'en' | 'es'; docId: string };
}) {
  const resolved = await params;
  const allDocuments = await getAllDocuments();
  const currentDoc = allDocuments.find((d) => d.id === resolved.docId);
  if (!currentDoc) return null;

  const related = allDocuments
    .filter(
      (doc) => doc.category === currentDoc.category && doc.id !== currentDoc.id,
    )
    .slice(0, 3);

  const getName = (doc: (typeof allDocuments)[number]) =>
    doc.translations?.[resolved.locale]?.name ||
    doc.translations?.en?.name ||
    doc.name ||
    doc.id;

  const getDesc = (doc: (typeof allDocuments)[number]) =>
    doc.translations?.[resolved.locale]?.description ||
    doc.translations?.en?.description ||
    doc.description ||
    '';

  return (
    <main className="container mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Document Complete</h1>
        <p className="text-muted-foreground">
          Your document is ready to download.
        </p>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Users who created {getName(currentDoc)} also needed:
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {related.map((doc) => (
              <Card key={doc.id} className="border border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{getName(doc)}</CardTitle>
                  <CardDescription className="text-sm">
                    {getDesc(doc)}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/${resolved.locale}/docs/${doc.id}/start`}>
                      Start
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
