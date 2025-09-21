import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { usStates } from '@/lib/usStates';
import { formatDocumentTitle } from '@/lib/format-utils';
import slugMap from '@/config/doc-meta/slug-category-map.json';
import { MetaTags } from '@/components/seo/MetaTags';
import { generateDocumentMetaTags } from '@/lib/seo/meta';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { generateStateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateDocumentFAQs } from '@/lib/seo/schema';
import { StateSpecificLegalSchema } from '@/components/seo/LocalBusinessSchema';
import Link from 'next/link';
type StateRouteParams = { locale: 'en' | 'es'; state: string };

export async function generateStaticParams() {
  const locales: StateRouteParams['locale'][] = ['en', 'es'];
  const states = usStates.map((state) =>
    state.label.toLowerCase().replace(/\s+/g, '-'),
  );

  const params: StateRouteParams[] = [];
  for (const locale of locales) {
    for (const state of states) {
      params.push({ locale, state });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: StateRouteParams;
}): Promise<Metadata> {
  const { state: stateSlug, locale } = params;
  const localeTyped = locale;

  const stateObj = usStates.find(
    (s) => s.label.toLowerCase().replace(/\s+/g, '-') === stateSlug,
  );

  if (!stateObj) {
    return {
      title: 'State Not Found',
      description: 'The requested state was not found.',
    };
  }

  const stateName = stateObj.label;
  const isSpanish = localeTyped === 'es';

  const title = isSpanish
    ? `Formularios Legales de ${stateName} - Plantillas Gratuitas 2025`
    : `${stateName} Legal Forms - Free Templates 2025`;

  const description = isSpanish
    ? `Crea documentos legales específicos para ${stateName} al instante. Más de 35 plantillas gratuitas que cumplen con las leyes estatales. Descarga en PDF y Word.`
    : `Create ${stateName}-specific legal documents instantly. 35+ free templates that comply with state laws. Download in PDF and Word formats.`;

  return {
    title,
    description,
    keywords: isSpanish
      ? [
          `formularios legales ${stateName}`,
          `documentos ${stateName}`,
          `plantillas legales ${stateName}`,
          'documentos legales gratuitos',
        ]
      : [
          `${stateName} legal forms`,
          `${stateName} documents`,
          `${stateName} legal templates`,
          'free legal documents',
        ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: localeTyped,
      siteName: '123LegalDoc',
    },
    alternates: {
      canonical: `/${localeTyped}/${stateSlug}`,
      languages: {
        en: `/en/${stateSlug}`,
        es: `/es/${stateSlug}`,
      },
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: StateRouteParams;
}) {
  const { state: stateSlug, locale } = params;
  const localeTyped = locale;

  const stateObj = usStates.find(
    (s) => s.label.toLowerCase().replace(/\s+/g, '-') === stateSlug,
  );

  if (!stateObj) {
    notFound();
  }

  const stateName = stateObj.label;
  const isSpanish = localeTyped === 'es';

  // Build a lightweight document list from slug/category map
  const allSlugs = Object.keys(slugMap).filter((s) => s !== 'general-inquiry');
  const stateDocuments = allSlugs.map((slug) => ({
    id: slug,
    name: formatDocumentTitle(slug),
    category: slugMap[slug as keyof typeof slugMap] || 'General',
  }));

  const metaTags = generateDocumentMetaTags(
    'Legal Forms',
    stateName,
    undefined,
    localeTyped,
  );
  const breadcrumbs = generateStateBreadcrumbs(stateName, undefined, localeTyped);
  const faqs = generateDocumentFAQs('Legal Forms', stateName, localeTyped);

  const documentsByCategory = stateDocuments.reduce(
    (acc, doc) => {
      const category = doc.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(doc);
      return acc;
    },
    {} as Record<string, Array<{ id: string; name: string; category: string }>>,
  );

  return (
    <>
      <MetaTags
        title={metaTags.title}
        description={metaTags.description}
        keywords={metaTags.keywords}
        documentType="Legal Forms"
        state={stateName}
        canonical={`/${locale}/${stateSlug}`}
        alternateLanguages={[
          { hrefLang: 'en', href: `/en/${stateSlug}` },
          { hrefLang: 'es', href: `/es/${stateSlug}` },
        ]}
      />

      <SchemaMarkup type="FAQ" data={{ faqs }} />

      <StateSpecificLegalSchema
        state={stateName}
        documentTypes={stateDocuments.map((doc) => formatDocumentTitle(doc.id))}
        locale={locale}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isSpanish
              ? `Formularios Legales de ${stateName}`
              : `${stateName} Legal Forms`}
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            {isSpanish
              ? `Crea documentos legales específicos para ${stateName} que cumplen con las leyes estatales. Todas nuestras plantillas están actualizadas para 2025.`
              : `Create ${stateName}-specific legal documents that comply with state laws. All our templates are updated for 2025.`}
          </p>

          <div className="grid gap-8">
            {Object.entries(documentsByCategory).map(([category, docs]) => (
              <div
                key={category}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {category}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((doc) => {
                    const docName = doc.name || formatDocumentTitle(doc.id);
                    const docSlug = doc.id;

                    return (
                      <Link
                        key={doc.id}
                        href={`/${locale}/${stateSlug}/${docSlug}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {docName}
                        </h3>
                        {/* Optional short description could be added here if available */}
                        <div className="mt-2 text-sm text-blue-600 font-medium">
                          {isSpanish
                            ? 'Crear documento →'
                            : 'Create document →'}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {isSpanish
                ? `¿Por qué elegir nuestros formularios de ${stateName}?`
                : `Why Choose Our ${stateName} Forms?`}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {isSpanish ? 'Conformidad Estatal' : 'State Compliance'}
                </h3>
                <p className="text-gray-600">
                  {isSpanish
                    ? `Todos nuestros formularios están diseñados específicamente para cumplir con las leyes de ${stateName}.`
                    : `All our forms are specifically designed to comply with ${stateName} laws.`}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {isSpanish ? 'Actualizados para 2025' : 'Updated for 2025'}
                </h3>
                <p className="text-gray-600">
                  {isSpanish
                    ? 'Nuestras plantillas se actualizan regularmente para reflejar cambios en las leyes.'
                    : 'Our templates are regularly updated to reflect changes in laws.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {isSpanish ? 'Fácil de Usar' : 'Easy to Use'}
                </h3>
                <p className="text-gray-600">
                  {isSpanish
                    ? 'Completa un cuestionario simple y obtén tu documento en minutos.'
                    : 'Complete a simple questionnaire and get your document in minutes.'}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isSpanish
                ? 'Preguntas Frecuentes'
                : 'Frequently Asked Questions'}
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6"
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
      </div>
    </>
  );
}
