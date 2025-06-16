import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { documentLibrary } from '@/lib/document-library';
import { usStates } from '@/lib/document-library/utils';
import AutoImage from '@/components/AutoImage';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-static';
export const revalidate = 86400; // daily

const slugify = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export async function generateStaticParams() {
  const params: { docId: string; state: string }[] = [];
  for (const doc of documentLibrary) {
    if (!doc.id || doc.id === 'general-inquiry') continue;
    const states =
      doc.states === 'all'
        ? usStates.map((s) => s.label)
        : Array.isArray(doc.states)
        ? doc.states
        : [];
    for (const state of states) {
      const label = usStates.find((s) => s.value === state)?.label || state;
      params.push({ docId: doc.id, state: slugify(label) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { docId: string; state: string };
}): Promise<Metadata> {
  const docConfig = documentLibrary.find((d) => d.id === params.docId);
  const state = usStates.find((s) => slugify(s.label) === params.state);
  if (!docConfig || !state) return {};
  const titleBase =
    docConfig.translations?.en?.name || docConfig.name || docConfig.id;
  const description =
    docConfig.translations?.en?.description || docConfig.description || '';
  const canonical = `https://123legaldoc.com/docs/${params.doc}/${params.state}`;
  return {
    title: `${titleBase} - ${state.label} | 123LegalDoc`,
    description,
    alternates: { canonical },
  };
}

export default function DocStatePage({
  params,
}: {
  params: { docId: string; state: string };
}) {
  const docConfig = documentLibrary.find((d) => d.id === params.docId);
  const state = usStates.find((s) => slugify(s.label) === params.state);
  if (!docConfig || !state) return notFound();
  const name = docConfig.translations?.en?.name || docConfig.name || docConfig.id;
  const desc = docConfig.translations?.en?.description || docConfig.description || '';
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">{name} - {state.label}</h1>
      {desc && <p className="text-muted-foreground">{desc}</p>}
      <div className="max-w-md mx-auto">
        <AutoImage
          src={`/images/previews/en/${docConfig.id}.png`}
          alt={`${name} preview`}
          width={850}
          height={1100}
          className="w-full"
        />
      </div>
      <Button asChild className="mt-4">
        <Link href={`/generate?docId=${docConfig.id}`}>Create Document</Link>
      </Button>
    </main>
  );
}

