import related from '@/data/relatedDocs.json';
import Link from 'next/link';

export default function RelatedDocs({ docId }: { docId: string }) {
  const list =
    (related as Record<string, { slug: string; title: string }[]>)[docId] ?? [];
  if (!list.length) return null;
  return (
    <section className="my-16 max-w-4xl mx-auto">
      <h2 className="mb-6 text-xl font-semibold">
        People who bought this also needed
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {list.map((d) => (
          <li key={d.slug} className="rounded-lg border p-4">
            <p className="mb-2 font-medium">{d.title}</p>
            <Link
              href={`/docs/${d.slug}`}
              className="text-sm text-teal-600 underline"
            >
              Preview template →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
