// app/blog/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'; // Import hooks
import { blogArticles, type BlogArticle } from '@/data/blogArticles'; // Import data and type
import Link from 'next/link'; // Import Link
import { ArrowLeft } from 'lucide-react'; // Import icons
import { Button } from '@/components/ui/button'; // Import Button

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
                   // Ensure i18n.language exists before using it
                   setFormattedDate(dateObj.toLocaleDateString(i18n.language || 'en', { year: 'numeric', month: 'long', day: 'numeric' }));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, i18n.language]); // Rerun on slug or language change


  // Determine language key suffix - Ensure i18n.language exists
  const langSuffix = (i18n.language && i18n.language.startsWith('es')) ? '_es' : '_en';

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
           <Button variant="outline" asChild className="mt-4">
               <Link href="/blog" className="flex items-center gap-2">
                 <ArrowLeft className="h-4 w-4" />
                 {t('Back to Blog', { defaultValue: 'Back to Blog'})}
               </Link>
           </Button>
         </main>
      );
  }

  // Content extraction using the determined language suffix
  const articleTitle = article[`title${langSuffix}` as keyof BlogArticle] || placeholderTitle;
  const articleBody = article[`content${langSuffix}` as keyof BlogArticle] || placeholderBody;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      {/* Button to go back to the main blog page */}
      <div className="mb-8">
         <Button variant="outline" asChild>
             <Link href="/blog" className="flex items-center gap-2 text-sm">
               <ArrowLeft className="h-4 w-4" />
               {t('Back to Blog', { defaultValue: 'Back to Blog'})}
             </Link>
         </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {articleTitle}
      </h1>
      {/* Display formatted date only after hydration */}
      <p className="text-sm text-muted-foreground mb-8">
         {formattedDate ? formattedDate : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground mb-16">
         {/* Render blog body using dangerouslySetInnerHTML and language suffix */}
          <div dangerouslySetInnerHTML={{ __html: articleBody }} />
      </article>

      {/* Simplified Navigation: Only back to blog */}
      <nav className="flex justify-start border-t border-border pt-8 mt-12">
          <Button variant="outline" asChild>
               <Link href="/blog" className="flex items-center gap-2">
                 <ArrowLeft className="h-4 w-4" />
                 {t('Back to Blog', { defaultValue: 'Back to Blog'})}
               </Link>
           </Button>
      </nav>
    </main>
  )
}
