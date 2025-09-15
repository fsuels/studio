import React from 'react';
import Link from 'next/link';
import { usStates } from '@/lib/usStates';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface OnlineNotaryPageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

export default async function OnlineNotaryPage({ params }: OnlineNotaryPageProps) {
  const { locale } = await params;
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          {t(
            'Online Notary – Easily notarize documents online with guaranteed security and privacy. Legal in all 50 states.',
            'Notaría en Línea – Legaliza documentos desde casa con seguridad y privacidad. Válido en los 50 estados.',
          )}
        </h1>
        <a href={`/${locale}/templates`} className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90">
          {t('Add Document', 'Agregar Documento')}
        </a>
      </section>

      <section className="md:flex md:items-start gap-4">
        <div className="text-primary text-2xl">🔒</div>
        <p className="text-muted-foreground max-w-xl">
          {t(
            'An online notary allows you to get documents notarized remotely through secure video. Your information remains encrypted and private.',
            'Una notaría en línea te permite legalizar documentos de forma remota mediante video seguro. Tu información permanece cifrada y privada.',
          )}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('How it works', 'Cómo funciona')}</h2>
        <ol className="list-decimal ml-6 space-y-2 text-muted-foreground">
          <li>{t('Upload the document.', 'Sube el documento.')}</li>
          <li>{t('Connect with a notary via secure video.', 'Conéctate con un notario por video seguro.')}</li>
          <li>{t('Pay and download the notarized document.', 'Paga y descarga el documento notarizado.')}</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('Pricing', 'Precios')}</h2>
        <p className="text-muted-foreground">{t('$25 for the first seal and $10 for each additional seal.', '$25 por el primer sello y $10 por cada sello adicional.')}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('Legal Across the U.S.', 'Válido en EE. UU.')}</h2>
        <p className="text-muted-foreground mb-4">{t('Our partner service is legal in all 50 states.', 'Nuestro servicio asociado es legal en los 50 estados.')}</p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-sm text-muted-foreground">
          {usStates.map((s) => (
            <li key={s.value}>{s.label}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('Security & Compliance', 'Seguridad y Cumplimiento')}</h2>
        <p className="text-muted-foreground">
          {t(
            'Our notary API provider uses end-to-end encryption and maintains strict compliance with state laws and identity verification requirements.',
            'Nuestro proveedor utiliza cifrado de extremo a extremo y cumple estrictamente con las leyes estatales y verificación de identidad.',
          )}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('Learn More', 'Más Información')}</h2>
        <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
          <li>
            <Link href={`/${locale}/faq`} className="hover:underline">{t('Online Notary FAQs', 'Preguntas Frecuentes')}</Link>
          </li>
          <li>
            <Link href={`/${locale}/blog`} className="hover:underline">{t('Articles about remote notarization', 'Artículos sobre notarización remota')}</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
