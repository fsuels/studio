// app/blog/page.tsx
'use client'

import { useState, useEffect } from 'react'; // Import useEffect
import { useTranslation } from 'react-i18next'
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

const posts = [
  {
    slug: 'freelancer-docs',
    titleKey: 'blog.freelancer-docs.title', // Updated key to match translation file structure
    descKey: 'blog.freelancer-docs.desc', // Updated key
    date: '2024-03-12' // Static ISO date string
  },
  {
    slug: 'ai-legaltech',
    titleKey: 'blog.ai-legaltech.title', // Updated key
    descKey: 'blog.ai-legaltech.desc', // Updated key
    date: '2024-02-02' // Static ISO date string
  },
  {
    slug: 'templates-risk',
    titleKey: 'blog.templates-risk.title', // Updated key
    descKey: 'blog.templates-risk.desc', // Updated key
    date: '2023-12-20' // Static ISO date string
  },
  {
    slug: 'lease-florida',
    titleKey: 'blog.lease-florida.title', // Updated key
    descKey: 'blog.lease-florida.desc', // Updated key
    date: '2023-11-03' // Static ISO date string - Placeholder, update if needed
  }
];

interface FormattedPost extends (typeof posts)[0] {
  formattedDate: string;
}

export default function BlogPage() {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration
  const [formattedPosts, setFormattedPosts] = useState<FormattedPost[]>([]); // State for posts with formatted dates

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client

    // Format dates only on the client side
    const clientFormattedPosts = posts.map(post => {
        let dateDisplay = post.date; // Default to ISO string
        try {
            dateDisplay = new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", e, "for post:", post.slug);
        }
        return { ...post, formattedDate: dateDisplay };
    });
    setFormattedPosts(clientFormattedPosts);

  }, []); // Empty dependency array ensures this runs once on mount after hydration

  const placeholderTitle = "Loading...";
  const placeholderDesc = "Loading content...";
  const placeholderReadMore = "Read More";
  const placeholderDate = "Loading date...";

  // Use formattedPosts if hydrated, otherwise use placeholders
  const displayPosts = isHydrated ? formattedPosts : posts.map(p => ({ ...p, formattedDate: placeholderDate }));


  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
          {isHydrated ? t('blog.title', 'Blog') : placeholderTitle}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
          {isHydrated ? t('blog.subtitle', 'Insights and news about legal documents.') : placeholderDesc}
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        {displayPosts.map((post) => (
          <Card key={post.slug} className="shadow-lg rounded-xl bg-card border border-border transition-shadow hover:shadow-xl flex flex-col">
            <CardHeader>
               <CardTitle className="text-xl font-semibold text-card-foreground">
                  {isHydrated ? t(post.titleKey, placeholderTitle) : placeholderTitle}
               </CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-1">
                   {/* Display formatted date */}
                   {post.formattedDate}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <p className="text-muted-foreground text-sm leading-relaxed">
                 {isHydrated ? t(post.descKey, placeholderDesc) : placeholderDesc}
               </p>
            </CardContent>
            <CardFooter>
                <Link
                  href={`/blog/${post.slug}`} // Use Link component
                  className="text-primary text-sm font-medium hover:underline"
                >
                  {isHydrated ? t('blog.readMore', 'Read More') : placeholderReadMore} →
                </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
