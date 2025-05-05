// app/blog/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'; // Import hooks

// Define the type for a single blog article based on the new structure
type BlogArticle = {
  slug: string;
  title_en: string;
  title_es: string;
  date: string; // Static ISO date string
  summary_en: string;
  summary_es: string;
  content_en: string;
  content_es: string;
};


// New blog articles data based on the user's JSON
// Ideally, this would be fetched from a central source, but duplicating here for simplicity
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


export default function BlogPostPage() {
  const params = useParams(); // Get params object
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug as string | undefined; // Extract slug safely
  const { t, i18n } = useTranslation(); // Get i18n instance
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration
  const [formattedDate, setFormattedDate] = useState<string | null>(null); // State for formatted date

  // Find the specific article based on the slug
  const article = blogArticles.find(art => art.slug === slug);

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

  // Determine language key suffix
  const langSuffix = i18n.language.startsWith('es') ? '_es' : '_en';

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
          {/* Access title based on language suffix */}
          {isHydrated ? article[`title${langSuffix}` as keyof BlogArticle] : placeholderTitle}
      </h1>
      {/* Display formatted date only after hydration */}
      <p className="text-sm text-muted-foreground mb-8">
         {isHydrated && formattedDate ? formattedDate : placeholderDate}
      </p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground">
         {/* Render blog body using dangerouslySetInnerHTML and language suffix */}
          <div dangerouslySetInnerHTML={{ __html: isHydrated ? article[`content${langSuffix}` as keyof BlogArticle] : placeholderBody }} />
      </article>
    </main>
  )
}
