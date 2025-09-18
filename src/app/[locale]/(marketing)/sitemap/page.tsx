// src/app/[locale]/sitemap/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap | 123LegalDoc',
  description: 'Browse 123LegalDoc pages and resources.',
};

const sections = [
  { title: 'Product', links: [
    { href: '/documents', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/partners', label: 'Partners' },
  ]},
  { title: 'Resources', links: [
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support' },
  ]},
  { title: 'Legal', links: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ]},
];

export default function SitemapPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <div key={s.title} className="p-4 rounded-lg border bg-card">
            <h2 className="font-semibold mb-3">{s.title}</h2>
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-primary hover:underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

