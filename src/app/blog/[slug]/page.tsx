// app/blog/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'; // Import hooks
import { blogArticles, type BlogArticle } from '@/data/blogArticles'; // Import data and type

// No need for separate data fetching logic here if using the local data file

export default function BlogPostPage() {
  const params = useParams(); // Get params object
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug as string | undefined; // Extract slug safely
  const { t, i18n } = useTranslation(); // Get i18n instance
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration
  const [formattedDate, setFormattedDate] = useState<string | null>(null); // State for formatted date
  const [article, setArticle] = useState<BlogArticle | undefined>(undefined); // State for the article

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

   // Effect to find the article and format date when slug or data changes
  useEffect(() => {
    if (slug) {
       const foundArticle = blogArticles.find(art => art.slug === slug);
       setArticle(foundArticle);

        // Format date only on the client after hydration and article found
        if (foundArticle) {
           const dateString = foundArticle.date;
           if (dateString) {
               try {
                   // Parse the ISO date string and format it using current locale
                   const dateObj = new Date(dateString);
                   setFormattedDate(dateObj.toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }));
               } catch (e) {
                   console.error("Error formatting date:", e);
                   setFormattedDate(dateString); // Fallback to the raw string if parsing fails
               }
           } else {
                setFormattedDate('Date not available');
           }
        } else {
            setFormattedDate(null); // Reset date if article not found
        }
    } else {
        setArticle(undefined); // Clear article if slug is missing
        setFormattedDate(null); // Clear date
    }
  }, [slug, i18n.language]); // Rerun on slug or language change


  // Determine language key suffix
  const langSuffix = i18n.language.startsWith('es') ? '_es' : '_en';

  // Placeholders
  const placeholderTitle = t('Loading...', { defaultValue: "Loading..."});
  const placeholderDate = t('Loading date...', { defaultValue: "Loading date..."});
  const placeholderBody = `<p>${t('Loading content...', { defaultValue: "Loading content..."})}</p>`;

  if (!isHydrated) {
     // Minimal loader for hydration phase
      return (
         <main className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
           <div className="bg-muted h-8 w-3/4 mb-4"></div>
           <div className="bg-muted h-4 w-1/4 mb-8"></div>
           <div className="space-y-4">
              <div className="bg-muted h-4 w-full"></div>
              <div className="bg-muted h-4 w-full"></div>
              <div className="bg-muted h-4 w-5/6"></div>
           </div>
         </main>
      );
  }

  if (!article) {
      // Handle case where article not found after hydration
      return (
         <main className="max-w-3xl mx-auto px-6 py-20">
           <h1 className="text-3xl font-bold mb-4 text-destructive">
                {t('Article Not Found', { defaultValue: 'Article Not Found' })}
            </h1>
           <p className="text-muted-foreground">
                {t('Could not find article with slug', { defaultValue: 'Could not find an article with the slug:' })} <span className="font-mono bg-muted px-1">{slug || 'unknown'}</span>.
            </p>
         </main>
      );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
          {/* Access title based on language suffix */}
          {article[`title${langSuffix}` as keyof BlogArticle] || placeholderTitle}
      </h1>
      {/* Display formatted date only after hydration */}
      <p className="text-sm text-muted-foreground mb-8">
         {formattedDate ? formattedDate : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground">
         {/* Render blog body using dangerouslySetInnerHTML and language suffix */}
          <div dangerouslySetInnerHTML={{ __html: article[`content${langSuffix}` as keyof BlogArticle] || placeholderBody }} />
      </article>
    </main>
  )
}
