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
    "slug": "legal-checklist-small-business",
    "title_en": "The Ultimate Legal Checklist for Starting a Small Business",
    "title_es": "Lista Legal Definitiva para Iniciar un Pequeño Negocio",
    "date": "2024-03-11",
    "summary_en": "A step-by-step legal guide for new entrepreneurs—licenses, agreements, and tax forms.",
    "summary_es": "Una guía legal paso a paso para nuevos emprendedores: licencias, contratos y formularios fiscales.",
    "content_en": "<p>Starting a small business involves navigating a complex legal landscape. This checklist covers the essentials:</p><ul><li>Choosing a business structure (Sole Proprietorship, LLC, Corporation)</li><li>Registering your business name</li><li>Obtaining necessary licenses and permits (federal, state, local)</li><li>Understanding tax obligations (EIN, sales tax, income tax)</li><li>Drafting key agreements (Partnership, Operating, Leases)</li><li>Complying with employment laws</li></ul><p>Consulting with legal and financial professionals is crucial.</p>",
    "content_es": "<p>Iniciar un pequeño negocio implica navegar un complejo panorama legal. Esta lista cubre lo esencial:</p><ul><li>Elegir una estructura de negocio (Empresario individual, LLC, Corporación)</li><li>Registrar el nombre de tu negocio</li><li>Obtener las licencias y permisos necesarios (federales, estatales, locales)</li><li>Comprender las obligaciones fiscales (EIN, impuesto sobre ventas, impuesto sobre la renta)</li><li>Redactar acuerdos clave (Sociedad, Operativo, Arrendamientos)</li><li>Cumplir con las leyes laborales</li></ul><p>Consultar con profesionales legales y financieros es crucial.</p>"
  },
  {
    "slug": "contract-basics",
    "title_en": "Contract Basics: What Every Agreement Must Include",
    "title_es": "Contratos Básicos: Qué Debe Incluir Todo Acuerdo",
    "date": "2024-04-01",
    "summary_en": "Understand the essential parts of any valid legal contract.",
    "summary_es": "Conoce las partes esenciales de cualquier contrato legal válido.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "green-card-process",
    "title_en": "Understanding the Green Card Application Process",
    "title_es": "Entendiendo el Proceso de Solicitud de la Green Card",
    "date": "2024-04-02",
    "summary_en": "An overview of steps, forms, and documents for lawful permanent residency.",
    "summary_es": "Resumen de los pasos, formularios y documentos necesarios para la residencia legal permanente.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "why-you-need-a-will",
    "title_en": "Why You Need a Will — No Matter Your Age",
    "title_es": "Por Qué Necesitas un Testamento — Sin Importar Tu Edad",
    "date": "2024-04-03",
    "summary_en": "Learn how a simple will can protect your assets and your family.",
    "summary_es": "Descubre cómo un testamento puede proteger tus bienes y tu familia.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "eviction-letter-guide",
    "title_en": "How to Write a Legal Eviction Letter",
    "title_es": "Cómo Escribir una Carta Legal de Desalojo",
    "date": "2024-04-04",
    "summary_en": "Steps for landlords to give notice properly and avoid legal issues.",
    "summary_es": "Pasos para que los propietarios notifiquen correctamente y eviten problemas legales.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "buying-home-checklist",
    "title_en": "Legal Checklist for First-Time Homebuyers",
    "title_es": "Lista Legal para Compradores de Vivienda por Primera Vez",
    "date": "2024-04-05",
    "summary_en": "From purchase agreements to title searches — protect your real estate deal.",
    "summary_es": "Desde contratos de compra hasta títulos de propiedad — protege tu transacción inmobiliaria.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "identity-theft-response",
    "title_en": "What to Do if You're a Victim of Identity Theft",
    "title_es": "Qué Hacer Si Eres Víctima de Robo de Identidad",
    "date": "2024-04-06",
    "summary_en": "Your rights and the legal steps you should take immediately.",
    "summary_es": "Tus derechos y los pasos legales que debes tomar de inmediato.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "notarized-vs-witnessed",
    "title_en": "Notarized vs Witnessed: What's the Difference?",
    "title_es": "Notariado vs Testificado: ¿Cuál es la Diferencia?",
    "date": "2024-04-07",
    "summary_en": "When to use each form of document verification.",
    "summary_es": "Cuándo usar cada forma de verificación documental.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "nda-vs-noncompete",
    "title_en": "NDA vs. Non-Compete: Which One Do You Need?",
    "title_es": "NDA vs. No Competencia: ¿Cuál Necesitas?",
    "date": "2024-04-08",
    "summary_en": "Compare these two common business agreements.",
    "summary_es": "Compara estos dos contratos comunes en negocios.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "how-to-hire-freelancers",
    "title_en": "How to Legally Hire Freelancers in the U.S.",
    "title_es": "Cómo Contratar Freelancers Legalmente en EE.UU.",
    "date": "2024-04-09",
    "summary_en": "Independent contractor rules, contracts, and tax forms.",
    "summary_es": "Reglas para contratistas independientes, contratos y formularios fiscales.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
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
