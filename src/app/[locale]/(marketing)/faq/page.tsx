// src/app/[locale]/faq/page.tsx
import React from 'react';

interface FaqPageProps {
  params: Promise<{ locale: 'en' | 'es' } & Record<string, string>>;
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function FAQPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  const faqs = [
    {
      q: t('How do I create a document?', '¿Cómo creo un documento?'),
      a: t('Choose a template, answer a few questions, and download your PDF.', 'Elige una plantilla, responde algunas preguntas y descarga tu PDF.'),
    },
    {
      q: t('Is my information secure?', '¿Mi información es segura?'),
      a: t('Yes. We use encryption and strict privacy practices.', 'Sí. Usamos cifrado y prácticas estrictas de privacidad.'),
    },
    {
      q: t('Do you support all U.S. states?', '¿Soportan todos los estados de EE. UU.?'),
      a: t('Yes, our templates adapt to state-specific requirements.', 'Sí, nuestras plantillas se adaptan a los requisitos estatales.'),
    },
    {
      q: t('Can I edit my document after generating?', '¿Puedo editar mi documento después de generarlo?'),
      a: t('Yes, you can customize clauses before downloading.', 'Sí, puedes personalizar cláusulas antes de descargarlo.'),
    },
    {
      q: t('Do you offer refunds?', '¿Ofrecen reembolsos?'),
      a: t('If you encounter an issue, contact support for assistance.', 'Si tienes un problema, contacta a soporte para asistencia.'),
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">{t('Frequently Asked Questions', 'Preguntas Frecuentes')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">{t('Find answers to common questions below.', 'Encuentra respuestas a preguntas comunes.')}</p>

      <div className="mb-6">
        <input type="search" placeholder={t('Search FAQs...', 'Buscar en FAQs...')} className="w-full rounded-md border px-3 py-2" aria-label="Search FAQs" />
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <details key={idx} className="bg-card border border-border rounded-lg shadow-sm p-4">
            <summary className="text-left font-semibold text-lg text-card-foreground cursor-pointer">
              {item.q}
            </summary>
            <div className="text-sm text-muted-foreground leading-relaxed pt-2">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
