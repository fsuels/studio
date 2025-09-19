'use client';

import { useCallback, useEffect } from 'react';
import { track } from '@/lib/analytics';

type SupportedLocale = 'en' | 'es';

interface SignWellContentProps {
  locale: SupportedLocale;
}

const benefits = [
  {
    id: 'legally-binding',
    en: {
      title: 'Legally Binding',
      description: 'Meets U.S. ESIGN and UETA requirements.',
    },
    es: {
      title: 'Legalmente Válido',
      description: 'Cumple con ESIGN y UETA en EE. UU.',
    },
  },
  {
    id: 'secure-private',
    en: {
      title: 'Secure & Private',
      description: 'Encrypted storage and access controls.',
    },
    es: {
      title: 'Seguro y Privado',
      description: 'Almacenamiento cifrado y controles de acceso.',
    },
  },
  {
    id: 'easy-to-use',
    en: {
      title: 'Easy to Use',
      description: 'Guide signers step-by-step on any device.',
    },
    es: {
      title: 'Fácil de Usar',
      description: 'Guía a los firmantes paso a paso en cualquier dispositivo.',
    },
  },
];

const howItWorksSteps = [
  {
    id: 1,
    en: 'Upload your document',
    es: 'Sube tu documento',
  },
  {
    id: 2,
    en: 'Add fields and recipients',
    es: 'Agrega campos y destinatarios',
  },
  {
    id: 3,
    en: 'Send for signature and download',
    es: 'Envía para firmar y descarga',
  },
];

function SignWellContent({ locale }: SignWellContentProps) {
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  useEffect(() => {
    track('signwell_disclaimer_view', {
      locale,
      page: 'signwell',
      section: 'compliance_disclaimer',
    });
  }, [locale]);

  const handleCtaClick = useCallback(
    (ctaId: 'start_esigning' | 'browse_templates') => {
      track('signwell_cta_click', {
        locale,
        page: 'signwell',
        cta_id: ctaId,
      });
    },
    [locale],
  );

  return (
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
          <a
            href={`/${locale}/signup`}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"
            onClick={() => handleCtaClick('start_esigning')}
          >
            {t('Start eSigning', 'Comenzar Firma')}
          </a>
          <a
            href={`/${locale}/templates`}
            className="inline-flex items-center justify-center rounded-md border border-primary text-primary px-4 py-2 bg-white hover:bg-primary/5"
            onClick={() => handleCtaClick('browse_templates')}
          >
            {t('Browse Templates', 'Explorar Plantillas')}
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {t(benefit.en.title, benefit.es.title)}
            </h3>
            <p className="text-sm text-gray-700">
              {t(benefit.en.description, benefit.es.description)}
            </p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          {t('How It Works', 'Cómo Funciona')}
        </h2>
        <ol className="grid md:grid-cols-3 gap-4 text-sm text-gray-800">
          {howItWorksSteps.map((step) => (
            <li key={step.id} className="bg-white p-4 rounded-lg border">
              {step.id}) {t(step.en, step.es)}
            </li>
          ))}
        </ol>
      </section>

      {/* Compliance blurb */}
      <section className="text-center bg-white p-8 rounded-lg border max-w-3xl mx-auto space-y-3">
        <p className="text-sm text-gray-700">
          {t(
            'Built with leading eSignature infrastructure. Compliant with ESIGN, UETA and industry best practices.',
            'Construido con infraestructura líder de firmas electrónicas. Cumple con ESIGN, UETA y mejores prácticas.',
          )}
        </p>
        <p className="text-xs text-gray-500">
          {t(
            '123LegalDoc provides self-help services and does not offer legal advice. Using SignWell with 123LegalDoc does not create an attorney-client relationship.',
            '123LegalDoc ofrece servicios de autoayuda y no brinda asesoría legal. El uso de SignWell con 123LegalDoc no crea una relación abogado-cliente.',
          )}
        </p>
      </section>
    </div>
  );
}

export default SignWellContent;
