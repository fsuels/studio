// src/app/bundle/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { bundles } from '@/data/bundles';
import { loadBundles } from '@/lib/firestore/bundles'; // harmless if collection absent
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartProvider';
import Link from 'next/link';

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // try Firestore first
  let bundle = (await loadBundles()).find((b) => b.id === id);
  if (!bundle) {
    bundle = bundles.find((b) => b.id === id);
  }
  if (!bundle) return notFound();

  return <BundleClient bundle={bundle} />;
}

/* ---------- client component so we can use cart context ---------- */
function BundleClient({ bundle }: { bundle: (typeof bundles)[number] }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: bundle.id,
      type: 'bundle',
      name: bundle.name,
      price: bundle.priceCents,
      docIds: bundle.docIds,
    });
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Card className="border border-border shadow-sm">
        {bundle.imageUrl && (
          <Image
            src={bundle.imageUrl}
            alt={bundle.name}
            width={768}
            height={192}
            className="h-48 w-full object-cover rounded-t"
          />
        )}

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{bundle.name}</CardTitle>
          <CardDescription>{bundle.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold mb-1">What’s included</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {bundle.docIds.map((id) => (
                <li key={id}>
                  <Link
                    href={`/generate?doc=${encodeURIComponent(id)}`}
                    className="hover:underline text-primary"
                  >
                    {id.replace(/[-_]/g, ' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-primary">
              ${(bundle.priceCents / 100).toFixed(2)}
            </span>
            <Button onClick={handleAdd}>Add bundle to cart</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
