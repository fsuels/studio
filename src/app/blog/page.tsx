'use client'

import { useState } from 'react';
import { blogArticles } from '@/data/blogArticles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  'All',
  'Business',
  'Family',
  'Real Estate',
  'Immigration',
  'Employment',
  'Contracts',
  'Privacy',
];

function getCategory(article) {
  // Basic keyword inference for demo — you can refine this logic
  const title = article.title_en.toLowerCase();
  if (title.includes('freelancer') || title.includes('startup')) return 'Business';
  if (title.includes('will') || title.includes('custody') || title.includes('divorce')) return 'Family';
  if (title.includes('home') || title.includes('lease')) return 'Real Estate';
  if (title.includes('green card') || title.includes('immigrants')) return 'Immigration';
  if (title.includes('hire') || title.includes('employee')) return 'Employment';
  if (title.includes('contract') || title.includes('nda')) return 'Contracts';
  if (title.includes('identity') || title.includes('privacy')) return 'Privacy';
  return 'General';
}

export default function BlogLayout() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = blogArticles.filter((a) => {
    const matchesQuery = a.title_en.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === 'All' || getCategory(a) === category;
    return matchesQuery && matchesCat;
  });

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Our Legal Blog</h1>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={c === category ? 'default' : 'outline'}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {pageData.map((post) => (
          <div key={post.slug} className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-1">{post.title_en}</h2>
            <p className="text-sm text-muted-foreground mb-1">{new Date(post.date).toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">{post.summary_en}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </main>
  );
}
