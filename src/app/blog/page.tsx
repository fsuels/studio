'use client'

import { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link'; // Import Link
import { blogArticles } from '@/data/blogArticles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next'; // Import useTranslation

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
  if (title.includes('freelancer') || title.includes('startup') || title.includes('business') || title.includes('llc')) return 'Business';
  if (title.includes('will') || title.includes('custody') || title.includes('divorce') || title.includes('prenuptial') || title.includes('minors') || title.includes('pet agreements')) return 'Family';
  if (title.includes('home') || title.includes('lease') || title.includes('rent') || title.includes('eviction') || title.includes('property')) return 'Real Estate';
  if (title.includes('green card') || title.includes('immigrants')) return 'Immigration';
  if (title.includes('hire') || title.includes('employee') || title.includes('remote work')) return 'Employment';
  if (title.includes('contract') || title.includes('nda') || title.includes('bill of sale')) return 'Contracts';
  if (title.includes('identity') || title.includes('privacy') || title.includes('non-compete')) return 'Privacy';
  return 'General';
}

export default function BlogLayout() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false); // Hydration state

  useEffect(() => {
    setIsHydrated(true); // Set hydrated on client mount
  }, []);


  const filtered = blogArticles.filter((a) => {
    const matchesQuery = a.title_en.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === 'All' || getCategory(a) === category;
    return matchesQuery && matchesCat;
  });

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // Placeholder for initial load / SSR
  if (!isHydrated) {
    return <div className="max-w-5xl mx-auto px-4 py-12 h-screen animate-pulse bg-muted"></div>;
  }

   // Determine language suffix for dynamic text
  const langSuffix = i18n.language.startsWith('es') ? '_es' : '_en';


  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('blog.title')}</h1> {/* Use translation */}

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <Input
          type="text"
          placeholder={t('Search articles...', { defaultValue: "Search articles..."})} // Translate placeholder
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }} // Reset page on query change
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
              {c} {/* Categories likely don't need translation unless specified */}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
         {pageData.length === 0 ? (
             <p className="text-muted-foreground italic">{t('No articles found for your criteria.', { defaultValue: "No articles found matching your criteria."})}</p> // Translate
         ) : (
           pageData.map((post) => (
             <Link href={`/blog/${post.slug}`} key={post.slug} passHref>
               {/* Card Content wrapped in <a> tag */}
               <div className="block border rounded-xl p-4 shadow hover:shadow-md transition hover:bg-muted cursor-pointer">
                   <h2 className="text-xl font-semibold mb-1">{post[`title${langSuffix}` as keyof typeof post]}</h2> {/* Dynamic title */}
                   <p className="text-sm text-muted-foreground mb-1">
                     {/* Client-side date formatting */}
                     {new Date(post.date).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}
                   </p>
                   <p className="text-sm text-muted-foreground">{post[`summary${langSuffix}` as keyof typeof post]}</p> {/* Dynamic summary */}
                   <span className="mt-2 inline-block text-primary text-sm hover:underline">{t('blog.readMore')} →</span> {/* Use translation */}
               </div>
             </Link>
           ))
         )}
      </div>

      {totalPages > 1 && (
         <div className="flex justify-between items-center mt-8">
           <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t('Previous', { defaultValue: 'Previous'})}</Button> {/* Translate */}
           <p className="text-sm text-muted-foreground">
             {t('Page {{currentPage}} of {{totalPages}}', { defaultValue: `Page ${page} of ${totalPages}`, currentPage: page, totalPages: totalPages })} {/* Translate */}
           </p>
           <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>{t('Next', { defaultValue: 'Next'})}</Button> {/* Translate */}
         </div>
      )}
    </main>
  );
}
