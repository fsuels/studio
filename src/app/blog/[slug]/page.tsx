// app/blog/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'; // Import hooks

export default function BlogPostPage() {
  const params = useParams(); // Get params object
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug as string | undefined; // Extract slug safely
  const { t } = useTranslation()
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  // Placeholder text while hydrating
  const placeholderTitle = "Loading...";
  const placeholderDate = "Loading date...";
  const placeholderBody = "<p>Loading content...</p>"; // Default as HTML string

  if (!slug) {
      // Handle case where slug might be missing (e.g., during initial render)
      return (
         <main className="max-w-3xl mx-auto px-6 py-20">
           <h1 className="text-3xl font-bold mb-4 animate-pulse bg-muted h-8 w-3/4"></h1>
           <p className="text-sm text-muted-foreground mb-8 animate-pulse bg-muted h-4 w-1/4"></p>
           <article className="prose prose-primary max-w-none space-y-4">
              <div className="animate-pulse bg-muted h-4 w-full"></div>
              <div className="animate-pulse bg-muted h-4 w-full"></div>
              <div className="animate-pulse bg-muted h-4 w-5/6"></div>
           </article>
         </main>
      );
  }


  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
          {isHydrated ? t(`blog.${slug}.title`, placeholderTitle) : placeholderTitle}
      </h1>
      {/* Date can be tricky with hydration, consider fetching/formatting on client or passing from static props */}
      <p className="text-sm text-muted-foreground mb-8">
         {/* Example: Fetching or using a fixed date format for consistency */}
         {isHydrated ? t(`blog.${slug}.date`, { defaultValue: 'Loading Date...' }) : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground">
         {/* Render blog body using dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: isHydrated ? t(`blog.${slug}.body`, {
            defaultValue: '<p>This blog post is coming soon. Please check back later for the full article.</p>'
          }) : placeholderBody }} />
      </article>
    </main>
  )
}
