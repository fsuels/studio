import { documentLibrary } from '@/lib/document-library';
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

export async function generateStaticParams() {
  const params: { locale: 'en' | 'es'; docId: string }[] = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      if (doc.id && doc.id !== 'general-inquiry') {
        params.push({ locale, docId: doc.id });
      }
    }
  }
  return params;
}

export default function CompletePage({
  params,
}: {
  params: { locale: 'en' | 'es'; docId: string };
}) {
  const currentDoc = documentLibrary.find((d) => d.id === params.docId);
  if (!currentDoc) return null;

  const related = documentLibrary
    .filter(
      (doc) => doc.category === currentDoc.category && doc.id !== currentDoc.id,
    )
    .slice(0, 3);

  const getName = (doc: (typeof documentLibrary)[number]) =>
    doc.translations?.[params.locale]?.name ||
    doc.translations?.en?.name ||
    doc.name ||
    doc.id;

  const getDesc = (doc: (typeof documentLibrary)[number]) =>
    doc.translations?.[params.locale]?.description ||
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
                    <Link href={`/${params.locale}/docs/${doc.id}/start`}>
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
