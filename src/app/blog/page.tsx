// app/blog/page.tsx
'use client'

import { useState, useEffect } from 'react'; // Import useEffect
import { useTranslation } from 'react-i18next'
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

const posts = [
  {
    slug: 'freelancer-docs',
    titleKey: 'blog.freelancer.title',
    descKey: 'blog.freelancer.desc',
    date: '2024-03-12'
  },
  {
    slug: 'ai-legaltech',
    titleKey: 'blog.ai.title',
    descKey: 'blog.ai.desc',
    date: '2024-02-02'
  },
  {
    slug: 'templates-risk',
    titleKey: 'blog.templates.title',
    descKey: 'blog.templates.desc',
    date: '2023-12-20'
  },
  {
    slug: 'lease-florida',
    titleKey: 'blog.lease.title',
    descKey: 'blog.lease.desc',
    date: '2023-11-03'
  }
];

export default function BlogPage() {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  const placeholderTitle = "Loading...";
  const placeholderDesc = "Loading content...";
  const placeholderReadMore = "Read More";

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
          {isHydrated ? t('blog.title', 'Blog') : placeholderTitle}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
          {isHydrated ? t('blog.subtitle', 'Insights and news about legal documents.') : placeholderDesc}
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug} className="shadow-lg rounded-xl bg-card border border-border transition-shadow hover:shadow-xl flex flex-col">
            <CardHeader>
               <CardTitle className="text-xl font-semibold text-card-foreground">
                  {isHydrated ? t(post.titleKey, placeholderTitle) : placeholderTitle}
               </CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-1">
                  {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
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
