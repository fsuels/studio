// src/app/[locale]/pricing/page.tsx
import React from 'react';
import Link from 'next/link';

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' } & Record<string, string>>;
}) {
  const { locale } = await params;
  const t = (en: string, es?: string) => (locale === 'es' && es ? es : en);

  const Plan = ({ title, price, period, features, cta }: { title: string; price: string; period?: string; features: string[]; cta: { href: string; label: string; variant?: 'primary' | 'outline' } }) => (
    <div className="shadow-lg rounded-xl bg-card border border-border transition-all hover:shadow-xl p-8">
      <div className="text-center space-y-2 mb-6">
        <div className="text-2xl font-semibold text-card-foreground">{title}</div>
        <div className="text-5xl font-bold text-primary">
          {price}
          {period && <span className="text-lg font-normal text-muted-foreground"> / {period}</span>}
        </div>
      </div>
      <ul className="text-sm text-left space-y-3 text-card-foreground/90 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">✅ {f}</li>
        ))}
      </ul>
      <a href={cta.href} className={cta.variant === 'outline' ? 'w-full inline-flex items-center justify-center rounded-md border border-primary text-primary px-4 py-2 hover:bg-primary/10' : 'w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90'}>
        {cta.label}
      </a>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{t('Simple, Transparent Pricing', 'Precios Simples y Transparentes')}</h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">{t('One-time $35/document • No subscription', 'Pago único de $35/documento • Sin suscripción')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Plan
          title={t('Single Document', 'Documento Único')}
          price="$35"
          period={t('document', 'documento')}
          features={[
            t('1 downloadable legal PDF', '1 PDF legal descargable'),
            t('Clause customization', 'Personalización de cláusulas'),
            t('Email support', 'Soporte por correo'),
            t('Secure sharing (soon)', 'Compartir seguro (pronto)')
          ]}
          cta={{ href: `/${locale}/#workflow-start`, label: t('Get Started', 'Comenzar') }}
        />

        <div className="relative">
          <div className="absolute -top-3 inset-x-0 mx-auto w-max bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{t('Most Popular', 'Más Popular')}</div>
          <Plan
            title={t('5-Document Bundle', 'Paquete de 5 Documentos')}
            price="$150"
            features={[
              t('5 downloadable PDFs', '5 PDFs descargables'),
              t('All single document features', 'Todas las funciones del plan individual'),
              t('Credits never expire', 'Los créditos no expiran'),
              t('Best value per document', 'Mejor valor por documento')
            ]}
            cta={{ href: `/${locale}/#workflow-start`, label: t('Get Started', 'Comenzar') }}
          />
        </div>

        <Plan
          title={t('Business Pro', 'Negocios Pro')}
          price="$99"
          period={t('month', 'mes')}
          features={[
            t('Unlimited documents', 'Documentos ilimitados'),
            t('Priority support', 'Soporte prioritario'),
            t('Team features (coming soon)', 'Funciones de equipo (pronto)'),
            t('Cancel anytime', 'Cancela cuando quieras')
          ]}
          cta={{ href: `/${locale}/support`, label: t('Contact Sales', 'Contactar Ventas'), variant: 'outline' }}
        />
      </div>

      <section className="mt-16 md:mt-24 max-w-4xl mx-auto text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">{t('How We Compare', 'Cómo nos Comparamos')}</h2>
        <div className="shadow-xl border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 w-[200px]">{t('Feature', 'Característica')}</th>
                <th className="text-center p-3 text-primary">123LegalDoc</th>
                <th className="text-center p-3 text-muted-foreground">{t('Traditional Lawyer', 'Abogado Tradicional')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">{t('AI-Powered Drafting', 'Redacción con IA')}</td>
                <td className="text-center p-3">✅</td>
                <td className="text-center p-3">❌</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">{t('Instant Document Download', 'Descarga Instantánea')}</td>
                <td className="text-center p-3">✅</td>
                <td className="text-center p-3">❌</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">{t('Fully Bilingual Support', 'Soporte Bilingüe')}</td>
                <td className="text-center p-3">✅</td>
                <td className="text-center p-3">❌</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">{t('One-Time Payment Option', 'Pago Único')}</td>
                <td className="text-center p-3">✅</td>
                <td className="text-center p-3">❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-12">
        <Link href={`/${locale}/generate`} className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90">
          {t('Take the Quiz →', 'Haz el Quiz →')}
        </Link>
      </div>
    </main>
  );
}
