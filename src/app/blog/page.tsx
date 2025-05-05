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
    "slug": "ndas-how-to-use",
    "title_en": "When and Why You Need an NDA (Non-Disclosure Agreement)",
    "title_es": "Cuándo y Por Qué Necesitas un NDA (Acuerdo de Confidencialidad)",
    "date": "2024-02-01",
    "summary_en": "Learn what an NDA is, when to use it, and how to protect sensitive business information.",
    "summary_es": "Descubre qué es un NDA, cuándo usarlo y cómo proteger información sensible de negocios.",
    "content_en": "<p>An NDA, or Non-Disclosure Agreement, is a legal contract that establishes confidentiality between parties. Key considerations:</p><ul><li><strong>Purpose:</strong> Protects trade secrets, client lists, financial data, or proprietary ideas during discussions.</li><li><strong>Types:</strong> Mutual (both parties share info) or Unilateral (one party discloses).</li><li><strong>When to Use:</strong> Before pitching investors, hiring contractors with access to sensitive data, exploring partnerships, or discussing inventions.</li><li><strong>Key Clauses:</strong> Definition of confidential info, obligations of receiving party, duration of confidentiality, exclusions.</li></ul><p>An NDA is a fundamental tool for safeguarding intellectual property and business strategies.</p>",
    "content_es": "<p>Un NDA, o Acuerdo de Confidencialidad, es un contrato legal que establece la confidencialidad entre las partes. Consideraciones clave:</p><ul><li><strong>Propósito:</strong> Protege secretos comerciales, listas de clientes, datos financieros o ideas propietarias durante las conversaciones.</li><li><strong>Tipos:</strong> Mutuo (ambas partes comparten información) o Unilateral (una parte revela).</li><li><strong>Cuándo Usar:</strong> Antes de presentar a inversores, contratar contratistas con acceso a datos sensibles, explorar asociaciones o discutir invenciones.</li><li><strong>Cláusulas Clave:</strong> Definición de información confidencial, obligaciones de la parte receptora, duración de la confidencialidad, exclusiones.</li></ul><p>Un NDA es una herramienta fundamental para salvaguardar la propiedad intelectual y las estrategias comerciales.</p>"
  },
  {
    "slug": "eviction-process",
    "title_en": "Understanding the Eviction Process: Landlord & Tenant Rights",
    "title_es": "Entendiendo el Proceso de Desalojo: Derechos del Propietario e Inquilino",
    "date": "2023-12-19",
    "summary_en": "Explore the legal eviction process and how to avoid common pitfalls as a landlord or tenant.",
    "summary_es": "Explora el proceso legal de desalojo y cómo evitar errores comunes como propietario o inquilino.",
    "content_en": "<p>Eviction is a legal process landlords must follow to remove a tenant. Key steps and rights:</p><ul><li><strong>Valid Reason:</strong> Typically non-payment of rent, lease violations, or illegal activity.</li><li><strong>Notice:</strong> Landlord must provide proper written notice (e.g., 3-day notice to pay or quit, 30-day notice to vacate). State laws vary significantly.</li><li><strong>Court Filing:</strong> If the tenant doesn't comply, the landlord files an unlawful detainer lawsuit.</li><li><strong>Tenant Response:</strong> Tenant has a specific timeframe to respond to the court summons.</li><li><strong>Hearing:</strong> A judge hears the case and issues a ruling.</li><li><strong>Writ of Possession:</strong> If the landlord wins, law enforcement executes the eviction.</li></ul><p>Both landlords and tenants should understand their state's specific laws and seek legal advice if unsure.</p>",
    "content_es": "<p>El desalojo es un proceso legal que los propietarios deben seguir para remover a un inquilino. Pasos clave y derechos:</p><ul><li><strong>Razón Válida:</strong> Típicamente falta de pago de renta, violaciones del contrato de arrendamiento o actividad ilegal.</li><li><strong>Notificación:</strong> El propietario debe dar una notificación escrita adecuada (ej., aviso de 3 días para pagar o desalojar, aviso de 30 días para desocupar). Las leyes estatales varían significativamente.</li><li><strong>Presentación Judicial:</strong> Si el inquilino no cumple, el propietario presenta una demanda de retención ilícita.</li><li><strong>Respuesta del Inquilino:</strong> El inquilino tiene un plazo específico para responder a la citación judicial.</li><li><strong>Audiencia:</strong> Un juez escucha el caso y emite un fallo.</li><li><strong>Orden de Posesión:</strong> Si el propietario gana, las autoridades ejecutan el desalojo.</li></ul><p>Tanto propietarios como inquilinos deben entender las leyes específicas de su estado y buscar asesoría legal si tienen dudas.</p>"
  },
  {
    "slug": "power-of-attorney-basics",
    "title_en": "Power of Attorney: What It Is and Why It Matters",
    "title_es": "Poder Legal: Qué Es y Por Qué Es Importante",
    "date": "2024-01-12",
    "summary_en": "A clear breakdown of Power of Attorney types and when to create one.",
    "summary_es": "Una guía clara sobre los tipos de poder legal y cuándo crearlo.",
    "content_en": "<p>A Power of Attorney (POA) is a legal document granting someone (the Agent) authority to act on another person's (the Principal) behalf. Types include:</p><ul><li><strong>General POA:</strong> Broad authority over financial matters. Often ends if the Principal becomes incapacitated.</li><li><strong>Durable POA:</strong> Remains effective even if the Principal becomes incapacitated. Crucial for planning.</li><li><strong>Healthcare POA (or Proxy):</strong> Allows the Agent to make medical decisions if the Principal cannot.</li><li><strong>Special/Limited POA:</strong> Grants specific, limited powers for a particular task or time.</li></ul><p>Creating POAs is vital for ensuring your affairs and healthcare wishes are managed if you're unable to do so yourself.</p>",
    "content_es": "<p>Un Poder Legal (POA) es un documento legal que otorga a alguien (el Agente) autoridad para actuar en nombre de otra persona (el Principal). Los tipos incluyen:</p><ul><li><strong>POA General:</strong> Autoridad amplia sobre asuntos financieros. A menudo termina si el Principal queda incapacitado.</li><li><strong>POA Duradero:</strong> Permanece efectivo incluso si el Principal queda incapacitado. Crucial para la planificación.</li><li><strong>POA de Atención Médica (o Proxy):</strong> Permite al Agente tomar decisiones médicas si el Principal no puede.</li><li><strong>POA Especial/Limitado:</strong> Otorga poderes específicos y limitados para una tarea o tiempo particular.</li></ul><p>Crear Poderes Legales es vital para asegurar que tus asuntos y deseos de atención médica sean gestionados si no puedes hacerlo tú mismo.</p>"
  },
  {
    "slug": "contract-breach",
    "title_en": "What Happens If Someone Breaks a Contract?",
    "title_es": "¿Qué Pasa Si Alguien Rompe un Contrato?",
    "date": "2024-03-01",
    "summary_en": "Understand legal remedies and prevention strategies for breach of contract.",
    "summary_es": "Conoce los remedios legales y estrategias para prevenir el incumplimiento de contratos.",
    "content_en": "<p>A breach of contract occurs when one party fails to fulfill their obligations under a legally binding agreement. Consequences and remedies depend on the contract and the nature of the breach:</p><ul><li><strong>Material Breach:</strong> A significant failure that undermines the contract's core purpose. The non-breaching party may be excused from performance and can sue for damages.</li><li><strong>Minor Breach:</strong> A less significant failure. The non-breaching party must still perform but can sue for damages caused by the breach.</li><li><strong>Remedies:</strong> Compensatory damages (money to cover losses), specific performance (court orders performance), rescission (cancels the contract), reformation (court rewrites part of the contract).</li></ul><p>Clear contract drafting, communication, and negotiation can help prevent breaches. Seek legal advice if a breach occurs.</p>",
    "content_es": "<p>Un incumplimiento de contrato ocurre cuando una parte no cumple sus obligaciones bajo un acuerdo legalmente vinculante. Las consecuencias y remedios dependen del contrato y la naturaleza del incumplimiento:</p><ul><li><strong>Incumplimiento Material:</strong> Una falla significativa que socava el propósito central del contrato. La parte no incumplidora puede ser excusada de cumplir y puede demandar por daños y perjuicios.</li><li><strong>Incumplimiento Menor:</strong> Una falla menos significativa. La parte no incumplidora aún debe cumplir pero puede demandar por los daños causados por el incumplimiento.</li><li><strong>Remedios:</strong> Daños compensatorios (dinero para cubrir pérdidas), cumplimiento específico (el tribunal ordena el cumplimiento), rescisión (cancela el contrato), reforma (el tribunal reescribe parte del contrato).</li></ul><p>Una redacción clara del contrato, comunicación y negociación pueden ayudar a prevenir incumplimientos. Busca asesoría legal si ocurre un incumplimiento.</p>"
  },
  {
    "slug": "child-custody-explained",
    "title_en": "Child Custody Agreements: A Simple Guide for Parents",
    "title_es": "Acuerdos de Custodia de Menores: Una Guía para Padres",
    "date": "2024-03-25",
    "summary_en": "Learn about joint custody, sole custody, and how to create a fair plan.",
    "summary_es": "Aprende sobre custodia compartida, exclusiva y cómo crear un plan justo.",
    "content_en": "<p>Child custody agreements determine where children live and who makes decisions for them after parents separate. Key concepts:</p><ul><li><strong>Legal Custody:</strong> Right to make major decisions (education, healthcare, religion). Can be Joint or Sole.</li><li><strong>Physical Custody:</strong> Where the child primarily resides. Can be Joint (significant time with both parents) or Sole (primarily with one parent, visitation for the other).</li><li><strong>Best Interests of the Child:</strong> Courts prioritize the child's well-being, considering factors like parental stability, child's preference (if old enough), and history of care.</li><li><strong>Parenting Plan:</strong> A detailed schedule outlining visitation, holidays, transportation, and communication.</li></ul><p>Mediation or collaboration is often encouraged to create a plan. Formalizing the agreement legally is essential.</p>",
    "content_es": "<p>Los acuerdos de custodia de menores determinan dónde viven los niños y quién toma decisiones por ellos después de que los padres se separan. Conceptos clave:</p><ul><li><strong>Custodia Legal:</strong> Derecho a tomar decisiones importantes (educación, salud, religión). Puede ser Conjunta o Única.</li><li><strong>Custodia Física:</strong> Dónde reside principalmente el niño. Puede ser Conjunta (tiempo significativo con ambos padres) o Única (principalmente con un padre, visitas para el otro).</li><li><strong>Mejor Interés del Menor:</strong> Los tribunales priorizan el bienestar del niño, considerando factores como la estabilidad parental, la preferencia del niño (si tiene edad suficiente) y el historial de cuidados.</li><li><strong>Plan de Crianza:</strong> Un horario detallado que describe visitas, días festivos, transporte y comunicación.</li></ul><p>A menudo se fomenta la mediación o colaboración para crear un plan. Es esencial formalizar legalmente el acuerdo.</p>"
  },
  {
    "slug": "digital-signatures-legal",
    "title_en": "Are Digital Signatures Legally Binding in the U.S.?",
    "title_es": "¿Son Legalmente Válidas las Firmas Digitales en EE. UU.?",
    "date": "2024-03-30",
    "summary_en": "Understand the legal status of e-signatures under U.S. law.",
    "summary_es": "Comprende la validez legal de las firmas electrónicas según la ley estadounidense.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "notarized-documents-online",
    "title_en": "Can You Notarize Documents Online? What to Know",
    "title_es": "¿Se Puede Notariar un Documento en Línea? Lo Que Debes Saber",
    "date": "2024-03-28",
    "summary_en": "Learn how online notarization works and which states support it.",
    "summary_es": "Aprende cómo funciona la notarización en línea y qué estados la permiten.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "legal-documents-immigrants",
    "title_en": "Top 5 Legal Documents Immigrants Need in the U.S.",
    "title_es": "Los 5 Documentos Legales Más Importantes para Inmigrantes en EE. UU.",
    "date": "2024-03-27",
    "summary_en": "From work permits to affidavits—here’s what new residents should prepare.",
    "summary_es": "Desde permisos de trabajo hasta declaraciones juradas—esto es lo que deben preparar los nuevos residentes.",
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
