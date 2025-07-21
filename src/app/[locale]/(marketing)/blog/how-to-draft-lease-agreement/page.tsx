// Example Blog Post with Internal Linking
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { CategoryDocumentsWidget, BlogFooterLinks } from '@/components/blog/InternalLinkWidget';
import BrowseTemplatesButton from '@/components/blog/BrowseTemplatesButton';

// Metadata will be generated dynamically based on locale
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const metadata = {
    en: {
      title: 'How to Draft a Lease Agreement: Complete Guide 2024 | 123LegalDoc',
      description: 'Learn how to draft a comprehensive lease agreement with our step-by-step guide. Includes state requirements, key clauses, and free template.',
      keywords: 'lease agreement, rental agreement, landlord tenant, property lease, lease template',
      ogTitle: 'How to Draft a Lease Agreement: Complete Guide 2024',
      ogDescription: 'Professional guide to creating legally sound lease agreements with expert tips and free templates.',
    },
    es: {
      title: 'Cómo Redactar un Contrato de Arrendamiento: Guía Completa 2024 | 123LegalDoc',
      description: 'Aprende a redactar un contrato de arrendamiento integral con nuestra guía paso a paso. Incluye requisitos estatales, cláusulas clave y plantilla gratuita.',
      keywords: 'contrato de arrendamiento, contrato de alquiler, propietario inquilino, arrendamiento de propiedad, plantilla de contrato',
      ogTitle: 'Cómo Redactar un Contrato de Arrendamiento: Guía Completa 2024',
      ogDescription: 'Guía profesional para crear contratos de arrendamiento legalmente sólidos con consejos expertos y plantillas gratuitas.',
    }
  };
  
  return {
    title: metadata[locale].title,
    description: metadata[locale].description,
    keywords: metadata[locale].keywords,
    openGraph: {
      title: metadata[locale].ogTitle,
      description: metadata[locale].ogDescription,
      type: 'article',
      publishedTime: '2024-12-16',
      authors: ['123LegalDoc Legal Team'],
    }
  };
}

interface PageProps {
  params: { locale: 'en' | 'es' };
}

export default function LeaseAgreementBlogPost({ params }: PageProps) {
  const { locale } = params;
  
  const content = {
    en: {
      backToBlog: 'Back to Blog',
      title: 'How to Draft a Lease Agreement: Complete Guide 2024',
      readTime: '8 min read',
      author: '123LegalDoc Legal Team',
      intro: 'Creating a comprehensive lease agreement is essential for protecting both landlords and tenants. A well-drafted lease agreement establishes clear expectations and helps prevent costly disputes.',
      tocTitle: 'Table of Contents',
      needHelp: 'Need Legal Help?',
      needHelpDesc: 'Get professional legal document templates that comply with your state\'s laws.',
      browseTemplates: 'Browse All Templates',
      getTemplate: 'Get Lease Agreement Template',
      readyTitle: 'Ready to Create Your Lease Agreement?',
      readyDesc: 'Use our professionally drafted lease agreement template to get started today. It includes all essential clauses and can be customized for your specific needs.'
    },
    es: {
      backToBlog: 'Volver al Blog',
      title: 'Cómo Redactar un Contrato de Arrendamiento: Guía Completa 2024',
      readTime: '8 min de lectura',
      author: 'Equipo Legal de 123LegalDoc',
      intro: 'Crear un contrato de arrendamiento integral es esencial para proteger tanto a propietarios como a inquilinos. Un contrato bien redactado establece expectativas claras y ayuda a prevenir disputas costosas.',
      tocTitle: 'Tabla de Contenidos',
      needHelp: '¿Necesitas Ayuda Legal?',
      needHelpDesc: 'Obtén plantillas de documentos legales profesionales que cumplen con las leyes de tu estado.',
      browseTemplates: 'Ver Todas las Plantillas',
      getTemplate: 'Obtener Plantilla de Contrato de Arrendamiento',
      readyTitle: '¿Listo para Crear tu Contrato de Arrendamiento?',
      readyDesc: 'Usa nuestra plantilla de contrato de arrendamiento redactada profesionalmente para comenzar hoy. Incluye todas las cláusulas esenciales y puede personalizarse según tus necesidades específicas.'
    }
  };
  
  const t = content[locale];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToBlog}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime="2024-12-16">December 16, 2024</time>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{t.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{t.readTime}</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t.intro}
              </p>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {locale === 'en' ? (
                <>
                  <h2>What is a Lease Agreement?</h2>
                  
                  <p>
                    A lease agreement is a legally binding contract between a landlord and tenant that outlines 
                    the terms and conditions of renting a property. Our{' '}
                    <Link 
                      href={`/${locale}/docs/lease-agreement`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      lease agreement template
                    </Link>{' '}
                    provides a professional foundation for your rental relationship.
                  </p>

                  <CategoryDocumentsWidget category="real-estate" maxLinks={3} />

                  <h2>Key Components of a Lease Agreement</h2>

                  <h3>1. Property Details</h3>
                  <ul>
                    <li>Complete property address</li>
                    <li>Description of rental unit</li>
                    <li>Included amenities and fixtures</li>
                    <li>Parking arrangements</li>
                  </ul>

                  <h3>2. Lease Terms</h3>
                  <ul>
                    <li>Lease duration (month-to-month or fixed-term)</li>
                    <li>Rent amount and due date</li>
                    <li>Security deposit requirements</li>
                    <li>Late fees and penalties</li>
                  </ul>

                  <h3>3. Tenant and Landlord Responsibilities</h3>
                  <p>
                    Clearly defining responsibilities prevents misunderstandings. When managing rental properties 
                    as a business, you may also need to hire property managers. Our{' '}
                    <Link 
                      href={`/${locale}/docs/employment-contract`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      employment contract template
                    </Link>{' '}
                    can help establish clear job expectations for your staff.
                  </p>

                  <h2>State-Specific Requirements</h2>
                  
                  <p>
                    Different states have varying requirements for lease agreements. It's crucial to understand 
                    your local laws:
                  </p>

                  <ul>
                    <li><strong>California:</strong> Rent control laws and tenant protection acts</li>
                    <li><strong>Texas:</strong> Property code requirements and security deposit limits</li>
                    <li><strong>New York:</strong> Rent stabilization regulations and disclosure requirements</li>
                    <li><strong>Florida:</strong> Landlord-tenant act provisions</li>
                  </ul>
                </>
              ) : (
                <>
                  <h2>¿Qué es un Contrato de Arrendamiento?</h2>
                  
                  <p>
                    Un contrato de arrendamiento es un acuerdo legalmente vinculante entre un propietario e inquilino que describe 
                    los términos y condiciones del alquiler de una propiedad. Nuestra{' '}
                    <Link 
                      href={`/${locale}/docs/lease-agreement`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      plantilla de contrato de arrendamiento
                    </Link>{' '}
                    proporciona una base profesional para tu relación de alquiler.
                  </p>

                  <CategoryDocumentsWidget category="real-estate" maxLinks={3} />

                  <h2>Componentes Clave de un Contrato de Arrendamiento</h2>

                  <h3>1. Detalles de la Propiedad</h3>
                  <ul>
                    <li>Dirección completa de la propiedad</li>
                    <li>Descripción de la unidad de alquiler</li>
                    <li>Comodidades e instalaciones incluidas</li>
                    <li>Arreglos de estacionamiento</li>
                  </ul>

                  <h3>2. Términos del Contrato</h3>
                  <ul>
                    <li>Duración del contrato (mes a mes o término fijo)</li>
                    <li>Monto del alquiler y fecha de vencimiento</li>
                    <li>Requisitos de depósito de seguridad</li>
                    <li>Cargos por mora y penalidades</li>
                  </ul>

                  <h3>3. Responsabilidades del Inquilino y Propietario</h3>
                  <p>
                    Definir claramente las responsabilidades previene malentendidos. Al administrar propiedades de alquiler 
                    como negocio, también podrías necesitar contratar administradores de propiedades. Nuestra{' '}
                    <Link 
                      href={`/${locale}/docs/employment-contract`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      plantilla de contrato de empleo
                    </Link>{' '}
                    puede ayudar a establecer expectativas claras de trabajo para tu personal.
                  </p>

                  <h2>Requisitos Específicos por Estado</h2>
                  
                  <p>
                    Diferentes estados tienen requisitos variables para los contratos de arrendamiento. Es crucial entender 
                    las leyes locales:
                  </p>

                  <ul>
                    <li><strong>California:</strong> Leyes de control de alquileres y actas de protección al inquilino</li>
                    <li><strong>Texas:</strong> Requisitos del código de propiedad y límites de depósito de seguridad</li>
                    <li><strong>Nueva York:</strong> Regulaciones de estabilización de alquileres y requisitos de divulgación</li>
                    <li><strong>Florida:</strong> Disposiciones del acta propietario-inquilino</li>
                  </ul>
                </>
              )}

              {locale === 'en' ? (
                <>
                  <h2>Common Lease Agreement Clauses</h2>

                  <h3>Maintenance and Repairs</h3>
                  <p>
                    Specify who handles different types of maintenance. For major repairs requiring contractors, 
                    having a solid{' '}
                    <Link 
                      href={`/${locale}/docs/independent-contractor-agreement`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      independent contractor agreement
                    </Link>{' '}
                    protects your interests.
                  </p>

                  <h3>Pet Policy</h3>
                  <p>
                    Clearly state whether pets are allowed, any pet deposits, and breed restrictions.
                  </p>

                  <h3>Subletting and Assignment</h3>
                  <p>
                    Define whether tenants can sublet the property and under what conditions.
                  </p>

                  <h2>Legal Protection and Documentation</h2>
                  
                  <p>
                    Beyond the lease agreement itself, consider these additional protective measures:
                  </p>

                  <ul>
                    <li>
                      <Link 
                        href={`/${locale}/docs/property-deed`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                      >
                        Property deed verification
                      </Link> to confirm ownership
                    </li>
                    <li>
                      <Link 
                        href={`/${locale}/docs/eviction-notice`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                      >
                        Eviction notice templates
                      </Link> for non-compliance situations
                    </li>
                    <li>Insurance documentation and liability waivers</li>
                  </ul>

                  <h2>Digital Age Considerations</h2>
                  
                  <p>
                    Modern lease agreements should address contemporary issues:
                  </p>

                  <ul>
                    <li>Internet and utility responsibilities</li>
                    <li>Smart home device policies</li>
                    <li>Digital payment methods</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h2>Conclusion</h2>
                  
                  <p>
                    A properly drafted lease agreement protects both parties and ensures a smooth rental 
                    relationship. By including all necessary clauses and following state-specific requirements, 
                    you create a solid foundation for your landlord-tenant relationship.
                  </p>
                </>
              ) : (
                <>
                  <h2>Cláusulas Comunes del Contrato de Arrendamiento</h2>

                  <h3>Mantenimiento y Reparaciones</h3>
                  <p>
                    Especifica quién maneja diferentes tipos de mantenimiento. Para reparaciones mayores que requieren contratistas, 
                    tener un sólido{' '}
                    <Link 
                      href={`/${locale}/docs/independent-contractor-agreement`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      acuerdo de contratista independiente
                    </Link>{' '}
                    protege tus intereses.
                  </p>

                  <h3>Política de Mascotas</h3>
                  <p>
                    Establece claramente si se permiten mascotas, cualquier depósito por mascotas y restricciones de raza.
                  </p>

                  <h3>Subarrendamiento y Cesión</h3>
                  <p>
                    Define si los inquilinos pueden subarrendar la propiedad y bajo qué condiciones.
                  </p>

                  <h2>Protección Legal y Documentación</h2>
                  
                  <p>
                    Más allá del contrato de arrendamiento en sí, considera estas medidas de protección adicionales:
                  </p>

                  <ul>
                    <li>
                      <Link 
                        href={`/${locale}/docs/property-deed`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                      >
                        Verificación de escritura de propiedad
                      </Link> para confirmar la propiedad
                    </li>
                    <li>
                      <Link 
                        href={`/${locale}/docs/eviction-notice`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                      >
                        Plantillas de aviso de desalojo
                      </Link> para situaciones de incumplimiento
                    </li>
                    <li>Documentación de seguro y exenciones de responsabilidad</li>
                  </ul>

                  <h2>Consideraciones de la Era Digital</h2>
                  
                  <p>
                    Los contratos de arrendamiento modernos deben abordar temas contemporáneos:
                  </p>

                  <ul>
                    <li>Responsabilidades de internet y servicios públicos</li>
                    <li>Políticas de dispositivos de hogar inteligente</li>
                    <li>Métodos de pago digital</li>
                    <li>Preferencias de comunicación</li>
                  </ul>

                  <h2>Conclusión</h2>
                  
                  <p>
                    Un contrato de arrendamiento redactado adecuadamente protege a ambas partes y asegura una 
                    relación de alquiler fluida. Al incluir todas las cláusulas necesarias y seguir los requisitos específicos del estado, 
                    creas una base sólida para tu relación propietario-inquilino.
                  </p>
                </>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  {t.readyTitle}
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  {t.readyDesc}
                </p>
                <Link
                  href={`/${locale}/docs/lease-agreement`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t.getTemplate}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>

            {/* Footer Links */}
            <BlogFooterLinks 
              keywords={['lease agreement', 'rental agreement', 'property lease', 'landlord tenant']}
              maxLinks={4}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Table of Contents */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t.tocTitle}
              </h3>
              <nav className="space-y-2 text-sm">
                {locale === 'en' ? (
                  <>
                    <a href="#what-is-lease" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      What is a Lease Agreement?
                    </a>
                    <a href="#key-components" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Key Components
                    </a>
                    <a href="#state-requirements" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      State-Specific Requirements
                    </a>
                    <a href="#common-clauses" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Common Clauses
                    </a>
                    <a href="#legal-protection" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Legal Protection
                    </a>
                  </>
                ) : (
                  <>
                    <a href="#what-is-lease" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      ¿Qué es un Contrato de Arrendamiento?
                    </a>
                    <a href="#key-components" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Componentes Clave
                    </a>
                    <a href="#state-requirements" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Requisitos Específicos por Estado
                    </a>
                    <a href="#common-clauses" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Cláusulas Comunes
                    </a>
                    <a href="#legal-protection" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Protección Legal
                    </a>
                  </>
                )}
              </nav>
            </div>

            {/* Related Documents Widget */}
            <CategoryDocumentsWidget category="real-estate" maxLinks={4} />

            {/* CTA Widget */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                {t.needHelp}
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm mb-4">
                {t.needHelpDesc}
              </p>
              <BrowseTemplatesButton className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                {t.browseTemplates}
              </BrowseTemplatesButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}