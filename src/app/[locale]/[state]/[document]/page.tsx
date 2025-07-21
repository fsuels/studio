import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getDocumentsForCountry,
  usStates,
  allDocuments,
} from '@/lib/document-library';
import { getDocumentTitle } from '@/lib/format-utils';
import { MetaTags, generateDocumentMetaTags } from '@/components/seo/MetaTags';
import {
  Breadcrumbs,
  generateStateBreadcrumbs,
} from '@/components/seo/Breadcrumbs';
import {
  SchemaMarkup,
  generateDocumentFAQs,
  generateDocumentHowToSteps,
} from '@/components/seo/SchemaMarkup';
import { StateSpecificLegalSchema } from '@/components/seo/LocalBusinessSchema';
import Link from 'next/link';

interface StateDocumentPageProps {
  params: Promise<{
    locale: string;
    state: string;
    document: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ['en', 'es'];
  const states = usStates.map((state) =>
    state.label.toLowerCase().replace(/\s+/g, '-'),
  );
  const documents = allDocuments.filter((doc) => doc.id !== 'general-inquiry');

  const params = [];
  for (const locale of locales) {
    for (const state of states) {
      for (const doc of documents) {
        params.push({
          locale,
          state,
          document: doc.id,
        });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: StateDocumentPageProps): Promise<Metadata> {
  const { state: stateSlug, document: documentSlug, locale } = await params;
  const localeTyped = locale as 'en' | 'es';

  const stateObj = usStates.find(
    (s) => s.label.toLowerCase().replace(/\s+/g, '-') === stateSlug,
  );

  const document = allDocuments.find((d) => d.id === documentSlug);

  if (!stateObj || !document) {
    return {
      title: 'Document Not Found',
      description: 'The requested document was not found.',
    };
  }

  const stateName = stateObj.label;
  const documentName = getDocumentTitle(document, localeTyped);
  const documentDesc =
    document.translations?.[localeTyped]?.description || document.description || '';
  const isSpanish = localeTyped === 'es';

  const title = isSpanish
    ? `${documentName} de ${stateName} - Plantilla Gratuita 2025`
    : `${stateName} ${documentName} - Free Template 2025`;

  const description = isSpanish
    ? `Crea tu ${documentName.toLowerCase()} de ${stateName} al instante. Plantilla gratuita que cumple con las leyes estatales. ${documentDesc}`
    : `Create your ${stateName} ${documentName.toLowerCase()} instantly. Free template that complies with state laws. ${documentDesc}`;

  return {
    title,
    description,
    keywords: isSpanish
      ? [
          `${documentName} ${stateName}`,
          `plantilla ${documentName}`,
          `${documentName} gratis`,
          `formularios ${stateName}`,
        ]
      : [
          `${stateName} ${documentName}`,
          `${documentName} template`,
          `free ${documentName}`,
          `${stateName} forms`,
        ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: localeTyped,
      siteName: '123LegalDoc',
    },
    alternates: {
      canonical: `/${localeTyped}/${stateSlug}/${documentSlug}`,
      languages: {
        en: `/en/${stateSlug}/${documentSlug}`,
        es: `/es/${stateSlug}/${documentSlug}`,
      },
    },
  };
}

export default async function StateDocumentPage({ params }: StateDocumentPageProps) {
  const { state: stateSlug, document: documentSlug, locale } = await params;
  const localeTyped = locale as 'en' | 'es';

  const stateObj = usStates.find(
    (s) => s.label.toLowerCase().replace(/\s+/g, '-') === stateSlug,
  );

  const document = allDocuments.find((d) => d.id === documentSlug);

  if (!stateObj || !document) {
    notFound();
  }

  // Check if document is available for this state
  if (
    document.states !== 'all' &&
    Array.isArray(document.states) &&
    !document.states.includes(stateObj.value)
  ) {
    notFound();
  }

  const stateName = stateObj.label;
  const documentName = getDocumentTitle(document, localeTyped);
  const documentDesc =
    document.translations?.[localeTyped]?.description || document.description || '';
  const isSpanish = localeTyped === 'es';

  const metaTags = generateDocumentMetaTags(
    documentName,
    stateName,
    undefined,
    localeTyped,
  );
  const breadcrumbs = generateStateBreadcrumbs(stateName, documentName, localeTyped);
  const faqs = generateDocumentFAQs(documentName, stateName, localeTyped);
  const howToSteps = generateDocumentHowToSteps(documentName);

  return (
    <>
      <MetaTags
        title={metaTags.title}
        description={metaTags.description}
        keywords={metaTags.keywords}
        documentType={documentName}
        state={stateName}
        canonical={`/${localeTyped}/${stateSlug}/${documentSlug}`}
        alternateLanguages={[
          { hrefLang: 'en', href: `/en/${stateSlug}/${documentSlug}` },
          { hrefLang: 'es', href: `/es/${stateSlug}/${documentSlug}` },
        ]}
      />

      <SchemaMarkup
        type="LegalService"
        data={{
          serviceName: `${stateName} ${documentName}`,
          serviceDescription: documentDesc,
          provider: {
            name: '123LegalDoc',
            url: 'https://123legaldoc.com',
          },
          areaServed: [stateName],
          serviceType: 'Legal Document Preparation',
        }}
      />

      <SchemaMarkup type="FAQ" data={{ faqs }} />

      <SchemaMarkup
        type="HowTo"
        data={{
          name: `How to Create a ${stateName} ${documentName}`,
          description: `Step-by-step guide to create your ${documentName} for ${stateName}`,
          steps: howToSteps,
        }}
      />

      <StateSpecificLegalSchema
        state={stateName}
        documentTypes={[documentName]}
        locale={localeTyped}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isSpanish
                ? `${documentName} de ${stateName}`
                : `${stateName} ${documentName}`}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {isSpanish
                ? `Crea tu ${documentName.toLowerCase()} específico para ${stateName} en minutos. Plantilla gratuita que cumple con las leyes estatales.`
                : `Create your ${stateName}-specific ${documentName.toLowerCase()} in minutes. Free template that complies with state laws.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${localeTyped}/docs/${documentSlug}/start`}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                {isSpanish ? 'Crear Documento' : 'Create Document'}
              </Link>

              <Link
                href={`/${localeTyped}/docs/${documentSlug}`}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors text-center"
              >
                {isSpanish ? 'Ver Plantilla' : 'View Template'}
              </Link>
            </div>
          </div>

          {/* Document Information */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {isSpanish
                    ? `¿Qué es un ${documentName}?`
                    : `What is a ${documentName}?`}
                </h2>

                <p className="text-gray-600 mb-4">
                  {documentDesc ||
                    (isSpanish
                      ? `Un ${documentName} es un documento legal importante que sirve para propósitos específicos bajo las leyes de ${stateName}.`
                      : `A ${documentName} is an important legal document that serves specific purposes under ${stateName} laws.`)}
                </p>

                {document.category && (
                  <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {document.category}
                  </div>
                )}
              </div>

              {/* State-Specific Requirements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {isSpanish
                    ? `Requisitos de ${stateName}`
                    : `${stateName} Requirements`}
                </h2>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      {isSpanish
                        ? `Cumple con todas las leyes y regulaciones específicas de ${stateName}`
                        : `Complies with all ${stateName}-specific laws and regulations`}
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      {isSpanish
                        ? 'Formato aprobado por tribunales locales'
                        : 'Format approved by local courts'}
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      {isSpanish
                        ? 'Actualizado para los requisitos legales de 2025'
                        : 'Updated for 2025 legal requirements'}
                    </p>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {isSpanish ? '¿Cómo funciona?' : 'How It Works'}
                </h2>

                <div className="space-y-4">
                  {howToSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {step.name}
                        </h3>
                        <p className="text-gray-600">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {isSpanish
                    ? 'Preguntas Frecuentes'
                    : 'Frequently Asked Questions'}
                </h2>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isSpanish ? 'Acciones Rápidas' : 'Quick Actions'}
                </h3>

                <div className="space-y-3">
                  <Link
                    href={`/${localeTyped}/docs/${documentSlug}/start`}
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    {isSpanish ? 'Crear Ahora' : 'Create Now'}
                  </Link>

                  <Link
                    href={`/${localeTyped}/docs/${documentSlug}/view`}
                    className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:border-gray-400 transition-colors text-center"
                  >
                    {isSpanish ? 'Vista Previa' : 'Preview'}
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isSpanish ? '¿Necesitas Ayuda?' : 'Need Help?'}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {isSpanish
                    ? 'Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta.'
                    : 'Our support team is here to help you with any questions.'}
                </p>

                <Link
                  href={`/${localeTyped}/support`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {isSpanish ? 'Contactar Soporte' : 'Contact Support'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
