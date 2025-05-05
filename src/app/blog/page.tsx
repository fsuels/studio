// app/blog/page.tsx
'use client'

import { useState, useEffect } from 'react'; // Import useEffect
import { useTranslation } from 'react-i18next'
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

// Define the type for a single blog article based on the new structure
type BlogArticle = {
  slug: string;
  title_en: string;
  title_es: string;
  date: string; // Static ISO date string
  summary_en: string;
  summary_es: string;
  content_en: string; // Add content fields if needed for direct use (though usually handled by slug page)
  content_es: string;
};

// New blog articles data based on the user's JSON
const blogArticles: BlogArticle[] = [
  {
    slug: "legal-checklist-small-business",
    title_en: "The Ultimate Legal Checklist for Starting a Small Business",
    title_es: "Lista Legal Definitiva para Iniciar un Pequeño Negocio",
    date: "2024-03-11",
    summary_en: "A step-by-step legal guide for new entrepreneurs—licenses, agreements, and tax forms.",
    summary_es: "Una guía legal paso a paso para nuevos emprendedores: licencias, contratos y formularios fiscales.",
    content_en: "Coming soon...",
    content_es: "Próximamente..."
  },
  {
    slug: "ndas-how-to-use",
    title_en: "When and Why You Need an NDA (Non-Disclosure Agreement)",
    title_es: "Cuándo y Por Qué Necesitas un NDA (Acuerdo de Confidencialidad)",
    date: "2024-02-01",
    summary_en: "Learn what an NDA is, when to use it, and how to protect sensitive business information.",
    summary_es: "Descubre qué es un NDA, cuándo usarlo y cómo proteger información sensible de negocios.",
    content_en: "Coming soon...",
    content_es: "Próximamente..."
  },
  {
    slug: "eviction-process",
    title_en: "Understanding the Eviction Process: Landlord & Tenant Rights",
    title_es: "Entendiendo el Proceso de Desalojo: Derechos del Propietario e Inquilino",
    date: "2023-12-19",
    summary_en: "Explore the legal eviction process and how to avoid common pitfalls as a landlord or tenant.",
    summary_es: "Explora el proceso legal de desalojo y cómo evitar errores comunes como propietario o inquilino.",
    content_en: "Coming soon...",
    content_es: "Próximamente..."
  },
  {
    slug: "power-of-attorney-basics",
    title_en: "Power of Attorney: What It Is and Why It Matters",
    title_es: "Poder Legal: Qué Es y Por Qué Es Importante",
    date: "2024-01-12",
    summary_en: "A clear breakdown of Power of Attorney types and when to create one.",
    summary_es: "Una guía clara sobre los tipos de poder legal y cuándo crearlo.",
    content_en: "Coming soon...",
    content_es: "Próximamente..."
  },
  {
    slug: "contract-breach",
    title_en: "What Happens If Someone Breaks a Contract?",
    title_es: "¿Qué Pasa Si Alguien Rompe un Contrato?",
    date: "2024-03-01",
    summary_en: "Understand legal remedies and prevention strategies for breach of contract.",
    summary_es: "Conoce los remedios legales y estrategias para prevenir el incumplimiento de contratos.",
    content_en: "Coming soon...",
    content_es: "Próximamente..."
  },
  {
    slug: "child-custody-explained",
    title_en: "Child Custody Agreements: A Simple Guide for Parents",
    title_es: "Acuerdos de Custodia de Menores: Una Guía para Padres",
    date: "2024-03-25",
    summary_en: "Learn about joint custody, sole custody, and how to create a fair plan.",
    summary_es: "Aprende sobre custodia compartida, exclusiva y cómo crear un plan justo.",
    content_en: "Coming soon...",
    content_es: "Próximamente..."
  }
];


// Define FormattedPost using the base BlogArticle type and adding formattedDate
interface FormattedBlogArticle extends BlogArticle {
  formattedDate: string;
}

export default function BlogPage() {
  const { t, i18n } = useTranslation(); // Get i18n instance
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration
  const [formattedPosts, setFormattedPosts] = useState<FormattedBlogArticle[]>([]); // State for posts with formatted dates

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client

    // Format dates only on the client side
    const clientFormattedPosts = blogArticles.map(post => {
        let dateDisplay = post.date; // Default to ISO string
        try {
            // Format date to locale string (e.g., "March 12, 2024")
            dateDisplay = new Date(post.date).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", e, "for post:", post.slug);
        }
        return { ...post, formattedDate: dateDisplay };
    });
    setFormattedPosts(clientFormattedPosts);

  }, [i18n.language]); // Rerun effect when language changes

  const placeholderTitle = "Loading...";
  const placeholderDesc = "Loading content...";
  const placeholderReadMore = "Read More";
  const placeholderDate = "Loading date...";

  // Determine current language key suffix
  const langSuffix = i18n.language.startsWith('es') ? '_es' : '_en';

  // Use formattedPosts if hydrated, otherwise use placeholders
  const displayPosts = isHydrated ? formattedPosts : blogArticles.map(p => ({ ...p, formattedDate: placeholderDate }));

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
                 {/* Access title based on current language suffix */}
                 {isHydrated ? post[`title${langSuffix}` as keyof BlogArticle] : placeholderTitle}
               </CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-1">
                   {/* Display formatted date */}
                   {post.formattedDate}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <p className="text-muted-foreground text-sm leading-relaxed">
                 {/* Access summary based on current language suffix */}
                 {isHydrated ? post[`summary${langSuffix}` as keyof BlogArticle] : placeholderDesc}
               </p>
            </CardContent>
            <CardFooter>
                <Link
                  href={`/blog/${post.slug}`} // Use Link component with the article slug
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