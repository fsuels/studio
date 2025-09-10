// src/app/[locale]/partners/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partners | 123LegalDoc',
  description: 'Explore partnership opportunities with 123LegalDoc.',
};

export default function PartnersPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Partners</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        We collaborate with legal professionals, marketplaces, and platforms to bring smart document workflows to everyone.
      </p>
      <div className="space-x-4">
        <Link href="/" className="underline">Back to Home</Link>
        <Link href="/en/support" className="underline">Contact Support</Link>
      </div>
    </main>
  );
}

