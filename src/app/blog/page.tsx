// app/blog/page.tsx
'use client'

import { useState, useEffect } from 'react'; // Import useEffect
import { useTranslation } from 'react-i18next'
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

// Define the type for a single language entry
type LanguageEntry = {
  en: string;
  es: string;
};

// Define the base type for a blog article
type BlogArticle = {
  id: string;
  title: LanguageEntry;
  date: string; // Static ISO date string
  excerpt: LanguageEntry;
};

// New blog articles data
const blogArticles: BlogArticle[] = [
  {
    id: "ai-vs-lawyers",
    title: {
      en: "AI vs. Lawyers: When to Use a Legal Assistant Bot",
      es: "IA vs. Abogados: Cuándo Usar un Asistente Legal Automatizado"
    },
    date: "2024-03-11",
    excerpt: {
      en: "Understand when AI-driven tools like 123LegalDoc are sufficient and when you should seek human legal advice.",
      es: "Comprende cuándo las herramientas impulsadas por IA como 123LegalDoc son suficientes y cuándo debes buscar asesoría legal humana."
    }
  },
  {
    id: "how-to-make-a-lease",
    title: {
      en: "How to Make a Lease Agreement in 5 Minutes",
      es: "Cómo Hacer un Contrato de Alquiler en 5 Minutos"
    },
    date: "2024-02-01",
    excerpt: {
      en: "A step-by-step guide to quickly generating a state-compliant rental agreement.",
      es: "Guía paso a paso para generar rápidamente un contrato de alquiler compatible con tu estado."
    }
  },
  {
    id: "top-5-legal-mistakes",
    title: {
      en: "Top 5 Legal Mistakes Freelancers Make",
      es: "Los 5 Errores Legales Más Comunes de los Freelancers"
    },
    date: "2023-12-19",
    excerpt: {
      en: "Avoid these costly legal missteps when working with clients and subcontractors.",
      es: "Evita estos errores legales costosos al trabajar con clientes y subcontratistas."
    }
  },
  {
    id: "divorce-vs-legal-separation",
    title: {
      en: "Divorce vs. Legal Separation: What’s the Difference?",
      es: "Divorcio vs. Separación Legal: ¿Cuál es la Diferencia?"
    },
    date: "2023-11-02",
    excerpt: {
      en: "Explore the key distinctions between divorce and legal separation in the U.S.",
      es: "Explora las diferencias clave entre el divorcio y la separación legal en EE. UU."
    }
  },
  {
    id: "how-to-sell-a-car",
    title: {
      en: "How to Sell a Car Privately with a Bill of Sale",
      es: "Cómo Vender un Coche con un Contrato de Compra-Venta"
    },
    date: "2023-10-15",
    excerpt: {
      en: "Learn how to transfer ownership legally and safely with a bill of sale.",
      es: "Aprende cómo transferir la propiedad legalmente y con seguridad mediante un contrato de compra-venta."
    }
  },
  {
    id: "starting-a-partnership",
    title: {
      en: "Starting a Business Partnership: Must-Have Legal Docs",
      es: "Cómo Empezar una Sociedad: Documentos Legales Esenciales"
    },
    date: "2023-09-30",
    excerpt: {
      en: "What legal agreements should you have when co-founding a business?",
      es: "¿Qué acuerdos legales necesitas al iniciar un negocio con un socio?"
    }
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
            console.error("Error formatting date:", e, "for post:", post.id);
        }
        return { ...post, formattedDate: dateDisplay };
    });
    setFormattedPosts(clientFormattedPosts);

  }, [i18n.language]); // Rerun effect when language changes

  const placeholderTitle = "Loading...";
  const placeholderDesc = "Loading content...";
  const placeholderReadMore = "Read More";
  const placeholderDate = "Loading date...";

  // Determine current language key
  const langKey = i18n.language.startsWith('es') ? 'es' : 'en';

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
          <Card key={post.id} className="shadow-lg rounded-xl bg-card border border-border transition-shadow hover:shadow-xl flex flex-col">
            <CardHeader>
               <CardTitle className="text-xl font-semibold text-card-foreground">
                 {/* Access title based on current language */}
                 {isHydrated ? post.title[langKey] : placeholderTitle}
               </CardTitle>
                <CardDescription className="text-sm text-muted-foreground pt-1">
                   {/* Display formatted date */}
                   {post.formattedDate}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <p className="text-muted-foreground text-sm leading-relaxed">
                 {/* Access excerpt based on current language */}
                 {isHydrated ? post.excerpt[langKey] : placeholderDesc}
               </p>
            </CardContent>
            <CardFooter>
                <Link
                  href={`/blog/${post.id}`} // Use Link component with the article ID
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
