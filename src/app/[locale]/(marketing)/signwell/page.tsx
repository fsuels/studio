// src/app/[locale]/signwell/page.tsx
export const revalidate = 3600; // Revalidate every hour

import type { Metadata } from 'next';
import React from 'react';
import SignwellCtaIsland from './SignwellCtaIsland';

interface SignWellPageProps {
  params: Promise<{ locale: 'en' | 'es' } & Record<string, string>>;
}

/* ───────── Static metadata (no i18next on server) ───────── */
const META = {
  en: {
    title: 'eSign Documents Online Securely | 123LegalDoc',
    description:
      'Upload, prepare, and send documents for legally binding electronic signatures with 123LegalDoc, powered by SignWell. Fast, secure, and compliant.',
  },
  es: {
    title: 'Firmar Documentos Electrónicamente | 123LegalDoc',
    description:
      'Suba, prepare y envíe documentos para firmas electrónicas legalmente vinculantes con 123LegalDoc, impulsado por SignWell. Rápido, seguro y conforme.',
  },
} as const;

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = META[locale] ?? META.en;
  return { title, description, openGraph: { title, description } };
}

export default async function SignWellPage({ params }: SignWellPageProps) {
  const { locale } = await params;
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {t('eSign Documents Online', 'Firmar Documentos en Línea')}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t(
              'Upload, prepare, and send documents for legally binding e-signatures. Fast, secure, and compliant across the U.S.',
              'Sube, prepara y envía documentos para firmas electrónicas legalmente vinculantes. Rápido, seguro y conforme en EE. UU.',
            )}
          </p>
          <div className="flex justify-center gap-3">
            <SignwellCtaIsland locale={locale} />
            <a href={`/${locale}/templates`} className="inline-flex items-center justify-center rounded-md border border-primary text-primary px-4 py-2 bg-white hover:bg-primary/5">
              {t('Browse Templates', 'Explorar Plantillas')}
            </a>
          </div>
        </section>

        {/* Benefits */}
        <section className="grid md:grid-cols-3 gap-6">
          {[{
            title: t('Legally Binding', 'Legalmente Válido'),
            desc: t('Meets U.S. ESIGN and UETA requirements.', 'Cumple con ESIGN y UETA en EE. UU.'),
          }, {
            title: t('Secure & Private', 'Seguro y Privado'),
            desc: t('Encrypted storage and access controls.', 'Almacenamiento cifrado y controles de acceso.'),
          }, {
            title: t('Easy to Use', 'Fácil de Usar'),
            desc: t('Guide signers step-by-step on any device.', 'Guía a los firmantes paso a paso en cualquier dispositivo.'),
          }].map((b, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{b.title}</h3>
              <p className="text-sm text-gray-700">{b.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{t('How It Works', 'Cómo Funciona')}</h2>
          <ol className="grid md:grid-cols-3 gap-4 text-sm text-gray-800">
            <li className="bg-white p-4 rounded-lg border">1) {t('Upload your document', 'Sube tu documento')}</li>
            <li className="bg-white p-4 rounded-lg border">2) {t('Add fields and recipients', 'Agrega campos y destinatarios')}</li>
            <li className="bg-white p-4 rounded-lg border">3) {t('Send for signature and download', 'Envía para firmar y descarga')}</li>
          </ol>
        </section>

        {/* Compliance blurb */}
        <section className="text-center bg-white p-8 rounded-lg border max-w-3xl mx-auto">
          <p className="text-sm text-gray-700">
            {t('Built with leading eSignature infrastructure. Compliant with ESIGN, UETA and industry best practices.', 'Construido con infraestructura líder de firmas electrónicas. Cumple con ESIGN, UETA y mejores prácticas.')}
          </p>
        </section>
      </div>
    </div>
  );
}
