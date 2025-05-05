// app/blog/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'; // Import hooks

// Re-import the articles data (or ideally fetch it based on slug)
// NOTE: In a real app, fetch this data server-side or via API
const blogArticles = [
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
    },
    // Example body content (replace with real HTML)
    body: {
        en: "<p>This is the full English content for the AI vs Lawyers article...</p>",
        es: "<p>Este es el contenido completo en español para el artículo de IA vs Abogados...</p>"
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
    },
    body: {
        en: "<p>This is the full English content for the Lease Agreement article...</p>",
        es: "<p>Este es el contenido completo en español para el artículo de Contrato de Alquiler...</p>"
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
    },
    body: {
        en: "<p>This is the full English content for the Freelancer Mistakes article...</p>",
        es: "<p>Este es el contenido completo en español para el artículo de Errores de Freelancers...</p>"
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
    },
     body: {
        en: "<p>This is the full English content for the Divorce vs Separation article...</p>",
        es: "<p>Este es el contenido completo en español para el artículo de Divorcio vs Separación...</p>"
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
    },
     body: {
        en: "<p>This is the full English content for the Selling a Car article...</p>",
        es: "<p>Este es el contenido completo en español para el artículo de Vender un Coche...</p>"
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
    },
     body: {
        en: "<p>This is the full English content for the Partnership Docs article...</p>",
        es: "<p>Este es el contenido completo en español para el artículo de Documentos de Sociedad...</p>"
    }
  }
];


export default function BlogPostPage() {
  const params = useParams(); // Get params object
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug as string | undefined; // Extract slug safely
  const { t, i18n } = useTranslation(); // Get i18n instance
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration
  const [formattedDate, setFormattedDate] = useState<string | null>(null); // State for formatted date

  // Find the specific article based on the slug
  const article = blogArticles.find(art => art.id === slug);

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client

    // Format date only on the client after hydration
    if (article) {
       const dateString = article.date;
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
    }
  }, [slug, article, i18n.language]); // Rerun on slug, article, or language change

  // Determine language key
  const langKey = i18n.language.startsWith('es') ? 'es' : 'en';

  // Placeholders
  const placeholderTitle = "Loading...";
  const placeholderDate = "Loading date...";
  const placeholderBody = "<p>Loading content...</p>";

  if (!article) {
      // Handle case where slug might be missing or article not found
      return (
         <main className="max-w-3xl mx-auto px-6 py-20">
           <h1 className="text-3xl font-bold mb-4 animate-pulse bg-muted h-8 w-3/4"></h1>
           <p className="text-sm text-muted-foreground mb-8 animate-pulse bg-muted h-4 w-1/4"></p>
           <article className="prose prose-primary max-w-none space-y-4">
              <div className="animate-pulse bg-muted h-4 w-full"></div>
              <div className="animate-pulse bg-muted h-4 w-full"></div>
              <div className="animate-pulse bg-muted h-4 w-5/6"></div>
           </article>
           <p className="mt-4 text-destructive">Article not found for slug: {slug}</p>
         </main>
      );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
          {isHydrated ? article.title[langKey] : placeholderTitle}
      </h1>
      {/* Display formatted date only after hydration */}
      <p className="text-sm text-muted-foreground mb-8">
         {isHydrated && formattedDate ? formattedDate : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground">
         {/* Render blog body using dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: isHydrated ? article.body[langKey] : placeholderBody }} />
      </article>
    </main>
  )
}
