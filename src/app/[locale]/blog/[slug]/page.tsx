// src/app/[locale]/blog/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'; 
import { blogArticles, type BlogArticle } from '@/data/blogArticles'; 
import Link from 'next/link'; 
import { ArrowLeft } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 

export default function BlogPostPage() {
  const params = useParams(); 
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug as string | undefined; 
  const locale = params.locale as 'en' | 'es';
  const { t, i18n } = useTranslation(); 
  const [isHydrated, setIsHydrated] = useState(false); 
  const [formattedDate, setFormattedDate] = useState<string | null>(null); 
  const [article, setArticle] = useState<BlogArticle | undefined>(undefined); 

  useEffect(() => {
    setIsHydrated(true); 
  }, []);

  useEffect(() => {
    if (slug) {
       const foundArticle = blogArticles.find(art => art.slug === slug);
       setArticle(foundArticle);

        if (foundArticle) {
           const dateString = foundArticle.date;
           if (dateString) {
               try {
                   const dateObj = new Date(dateString);
                   setFormattedDate(dateObj.toLocaleDateString(locale || 'en', { year: 'numeric', month: 'long', day: 'numeric' }));
               } catch (e) {
                   console.error("Error formatting date:", e);
                   setFormattedDate(dateString); 
               }
           } else {
                setFormattedDate('Date not available');
           }
        } else {
            setFormattedDate(null); 
        }
    } else {
        setArticle(undefined); 
        setFormattedDate(null); 
    }
  }, [slug, locale]); 


  const langSuffix = locale === 'es' ? '_es' : '_en';

  const placeholderTitle = t('Loading...', { defaultValue: "Loading..."});
  const placeholderDate = t('Loading date...', { defaultValue: "Loading date..."});
  const placeholderBody = `<p>${t('Loading content...', { defaultValue: "Loading content..."})}</p>`;

  if (!isHydrated) {
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
      return (
         <main className="max-w-3xl mx-auto px-6 py-20">
           <h1 className="text-3xl font-bold mb-4 text-destructive">
                {t('Article Not Found', { defaultValue: 'Article Not Found' })}
            </h1>
           <p className="text-muted-foreground">
                {t('Could not find article with slug', { defaultValue: 'Could not find an article with the slug:' })} <span className="font-mono bg-muted px-1">{slug || 'unknown'}</span>.
            </p>
           <Button variant="outline" asChild className="mt-4">
               <Link href={`/${locale}/blog`} className="flex items-center gap-2">
                 <ArrowLeft className="h-4 w-4" />
                 {t('Back to Blog', { defaultValue: 'Back to Blog'})}
               </Link>
           </Button>
         </main>
      );
  }

  const articleTitle = article[`title${langSuffix}` as keyof BlogArticle] || placeholderTitle;
  const articleBody = article[`content${langSuffix}` as keyof BlogArticle] || placeholderBody;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-8">
         <Button variant="outline" asChild>
             <Link href={`/${locale}/blog`} className="flex items-center gap-2 text-sm">
               <ArrowLeft className="h-4 w-4" />
               {t('Back to Blog', { defaultValue: 'Back to Blog'})}
             </Link>
         </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {articleTitle}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
         {formattedDate ? formattedDate : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground mb-16">
          <div dangerouslySetInnerHTML={{ __html: articleBody }} />
      </article>

      <nav className="flex justify-start border-t border-border pt-8 mt-12">
          <Button variant="outline" asChild>
               <Link href={`/${locale}/blog`} className="flex items-center gap-2">
                 <ArrowLeft className="h-4 w-4" />
                 {t('Back to Blog', { defaultValue: 'Back to Blog'})}
               </Link>
           </Button>
      </nav>
    </main>
  )
}
