// Server-safe SEO helpers for meta tag generation

export function generateDocumentMetaTags(
  documentType: string,
  state?: string,
  city?: string,
  locale: 'en' | 'es' = 'en',
) {
  const isSpanish = locale === 'es';

  const title = isSpanish
    ? `${state ? `${state} ` : ''}${documentType} - Plantilla Gratuita 2025`
    : `${state ? `${state} ` : ''}${documentType} - Free Template 2025`;

  const description = isSpanish
    ? `Crea tu ${documentType.toLowerCase()} ${state ? `de ${state}` : ''} al instante. Plantilla gratuita con requisitos específicos del estado. Descarga en PDF y Word.`
    : `Create your ${state ? `${state} ` : ''}${documentType.toLowerCase()} instantly. Free template with ${state ? 'state-specific' : 'legal'} requirements. Download in PDF and Word formats.`;

  const keywords = isSpanish
    ? [
        `${documentType} plantilla`,
        `${documentType} gratis`,
        `formulario ${documentType}`,
        `documentos legales`,
        ...(state ? [`${documentType} ${state}`, `formularios legales ${state}`] : []),
        ...(city ? [`${documentType} ${city}`, `documentos legales ${city}`] : []),
      ]
    : [
        `${documentType} template`,
        `free ${documentType}`,
        `${documentType} form`,
        `legal documents`,
        ...(state ? [`${state} ${documentType}`, `${state} legal forms`] : []),
        ...(city ? [`${documentType} ${city}`, `legal documents ${city}`] : []),
      ];

  return {
    title,
    description,
    keywords,
    documentType,
    state,
    city,
  };
}

