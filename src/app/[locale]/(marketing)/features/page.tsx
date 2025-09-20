// src/app/[locale]/features/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import {
  Bot,
  ListChecks,
  Building,
  Languages,
  FileText,
  Share2,
  LayoutDashboard,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
import { FeaturesCTA } from './FeaturesCTA';

interface FeaturesPageParams {
  locale: 'en' | 'es';
}

const featureIconMap: Record<string, React.ReactNode> = {
  ai: <Bot className="h-8 w-8 text-primary" />,
  questionnaire: <ListChecks className="h-8 w-8 text-primary" />,
  stateClauses: <Building className="h-8 w-8 text-primary" />,
  bilingual: <Languages className="h-8 w-8 text-primary" />,
  pdf: <FileText className="h-8 w-8 text-primary" />,
  sharing: <Share2 className="h-8 w-8 text-primary" />,
  dashboard: <LayoutDashboard className="h-8 w-8 text-primary" />,
  security: <ShieldCheck className="h-8 w-8 text-primary" />,
};

const localizedContent = {
  en: {
    title: 'Key Features',
    description: 'Powerful tools that simplify your legal document workflow and help you launch faster.',
    heroEyebrow: 'Why people choose 123LegalDoc',
    sectionHeading: 'Why Choose Us?',
    tableFeatureHeading: 'Feature',
    tableColumnLabel: '123LegalDoc',
    competitors: ['LegalZoom', 'LawDepot'],
    structuredDataName: '123LegalDoc Key Features',
    structuredDataDescription:
      'Explore the core product capabilities that make 123LegalDoc an all-in-one legal document solution.',
    features: {
      ai: {
        name: 'AI Document Inference',
        description: 'Smart clause suggestions and summaries based on your answers.',
      },
      questionnaire: {
        name: 'Dynamic Questionnaires',
        description: 'Guided workflows tailored to the document you need.',
      },
      stateClauses: {
        name: 'State-Specific Clauses',
        description: 'Templates adapted for U.S. state requirements and compliance.',
      },
      bilingual: {
        name: 'Bilingual Support (EN/ES)',
        description: 'End-to-end experiences in English and Spanish for teams and customers.',
      },
      pdf: {
        name: 'Instant PDF Generation',
        description: 'Generate professional PDFs that are ready to sign and share.',
      },
      sharing: {
        name: 'Secure Sharing',
        description: 'Deliver documents with expiring share links and audit history (coming soon).',
      },
      dashboard: {
        name: 'Centralized Dashboard',
        description: 'Track drafts, downloads, and billing from one workspace.',
      },
      security: {
        name: 'Privacy & Security',
        description: 'Encrypted data storage plus tenant isolation for regulated industries.',
      },
    },
    tableRows: [
      {
        label: 'AI-Powered Drafting',
        competitors: ['no', 'no'],
      },
      {
        label: 'Instant Document Download',
        competitors: ['no', 'yes'],
      },
      {
        label: 'Fully Bilingual Support',
        competitors: ['no', 'no'],
      },
      {
        label: 'One-Time Payment Option',
        competitors: ['no', 'no'],
      },
    ],
    ctaHeading: 'Ready to build your next document?',
    ctaDescription: 'Kick off a guided workflow or review transparent pricing first.',
    ctaPrimaryLabel: 'Start the Wizard',
    ctaSecondaryLabel: 'View Pricing',
    metadata: {
      title: 'Legal Document Automation Features | 123LegalDoc',
      description:
        'Discover AI drafting, bilingual workflows, instant PDFs, and secure sharing that streamline legal document creation for teams.',
      keywords:
        'legal document automation features, ai legal drafting, bilingual legal documents, secure legal document sharing',
      ogTitle: 'Legal Document Automation Features Built for Scale',
      ogDescription:
        'See how AI drafting, instant PDFs, and bilingual workflows help launch compliant documents in minutes.',
    },
  },
  es: {
    title: 'Funciones Clave',
    description:
      'Herramientas potentes que simplifican tu flujo de documentos legales y aceleran tus lanzamientos.',
    heroEyebrow: 'Por qué las personas eligen 123LegalDoc',
    sectionHeading: '¿Por Qué Elegirnos?',
    tableFeatureHeading: 'Función',
    tableColumnLabel: '123LegalDoc',
    competitors: ['LegalZoom', 'LawDepot'],
    structuredDataName: 'Funciones Principales de 123LegalDoc',
    structuredDataDescription:
      'Conoce las capacidades clave del producto que hacen de 123LegalDoc una solución integral de documentos legales.',
    features: {
      ai: {
        name: 'Inferencia de Documentos con IA',
        description: 'Sugerencias inteligentes de cláusulas y resúmenes según tus respuestas.',
      },
      questionnaire: {
        name: 'Cuestionarios Dinámicos',
        description: 'Flujos guiados adaptados al documento que necesitas.',
      },
      stateClauses: {
        name: 'Cláusulas por Estado',
        description: 'Plantillas adaptadas a los requisitos y cumplimiento de cada estado de EE.UU.',
      },
      bilingual: {
        name: 'Soporte Bilingüe (EN/ES)',
        description: 'Experiencias completas en inglés y español para equipos y clientes.',
      },
      pdf: {
        name: 'Generación Instantánea de PDF',
        description: 'Genera PDFs profesionales listos para firmar y compartir.',
      },
      sharing: {
        name: 'Compartir Seguro',
        description: 'Entrega documentos con enlaces que expiran e historial de auditoría (próximamente).',
      },
      dashboard: {
        name: 'Panel Centralizado',
        description: 'Administra borradores, descargas y facturación desde un solo lugar.',
      },
      security: {
        name: 'Privacidad y Seguridad',
        description: 'Almacenamiento cifrado y aislamiento por inquilino para industrias reguladas.',
      },
    },
    tableRows: [
      {
        label: 'Redacción Impulsada por IA',
        competitors: ['no', 'no'],
      },
      {
        label: 'Descarga Instantánea de Documentos',
        competitors: ['no', 'sí'],
      },
      {
        label: 'Soporte Totalmente Bilingüe',
        competitors: ['no', 'no'],
      },
      {
        label: 'Opción de Pago Único',
        competitors: ['no', 'no'],
      },
    ],
    ctaHeading: '\u00bfListo para crear tu pr\u00f3ximo documento?',
    ctaDescription: 'Comienza un flujo guiado o revisa primero nuestros precios transparentes.',
    ctaPrimaryLabel: 'Iniciar el asistente',
    ctaSecondaryLabel: 'Ver precios',
    metadata: {
      title: 'Funciones de Automatización de Documentos Legales | 123LegalDoc',
      description:
        'Descubre redacción con IA, flujos bilingües, PDFs instantáneos y compartir seguro que agilizan la creación de documentos legales.',
      keywords:
        'funciones automatización documentos legales, documentos legales con ia, flujos bilingües legales, compartir documentos legales seguro',
      ogTitle: 'Funciones de Automatización Legal Diseñadas para Escalar',
      ogDescription:
        'Conoce cómo la redacción con IA, los PDFs instantáneos y los flujos bilingües ayudan a lanzar documentos en minutos.',
    },
  },
} as const;

function buildFeaturesStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/features/`;
  const localeContent = localizedContent[locale];

  const featureItems = Object.values(localeContent.features).map((feature, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: feature.name,
    description: feature.description,
  }));

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: localeContent.structuredDataName,
      description: localeContent.structuredDataDescription,
      itemListElement: featureItems,
      url: localizedUrl,
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FeaturesPageParams>;
}): Promise<Metadata> {
  const { locale } = params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/features/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/features/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/features/`;
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);

  const localizedMetadata = localizedContent[locale].metadata;

  return {
    title: localizedMetadata.title,
    description: localizedMetadata.description,
    keywords: localizedMetadata.keywords,
    metadataBase,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: localizedMetadata.ogTitle,
      description: localizedMetadata.ogDescription,
      type: 'website',
      url: siteUrl + canonicalPath,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: LOCALE_LANGUAGE_TAGS[locale],
      alternateLocale: alternateOgLocales,
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedMetadata.ogTitle,
      description: localizedMetadata.ogDescription,
    },
  };
}

function renderCompetitorCell(value: 'yes' | 'no') {
  return value === 'yes' ? (
    <Check className="h-5 w-5 text-green-500 mx-auto" aria-label="Yes" />
  ) : (
    <X className="h-5 w-5 text-destructive mx-auto" aria-label="No" />
  );
}

// generateStaticParams is a server-side function and can be exported from a Server Component page
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// This page.tsx is a Server Component – render static content to keep bundle lean
export default async function FeaturesPage({
  params,
}: {
  params: Promise<FeaturesPageParams>;
}) {
  const { locale } = params;
  const content = localizedContent[locale];

  const features = Object.entries(content.features).map(([key, feature]) => ({
    key,
    icon: featureIconMap[key],
    title: feature.name,
    description: feature.description,
  }));

  const featuresJsonLd = buildFeaturesStructuredData(locale);

  const Feature = ({
    icon,
    title,
    desc,
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  }) => (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
      <div className="mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: featuresJsonLd,
        }}
      />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-sm uppercase tracking-wide text-muted-foreground text-center mb-3">
          {content.heroEyebrow}
        </p>
        <h1 className="text-4xl font-bold text-center mb-6 text-foreground">{content.title}</h1>
        <p className="text-lg text-muted-foreground text-center mb-12">{content.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Feature key={feature.key} icon={feature.icon} title={feature.title} desc={feature.description} />
          ))}
        </div>

        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {content.sectionHeading}
          </h2>
          <Card className="shadow-lg border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">{content.tableFeatureHeading}</TableHead>
                  <TableHead className="text-center text-primary font-semibold">
                    {content.tableColumnLabel}
                  </TableHead>
                  {content.competitors.map((competitor) => (
                    <TableHead key={competitor} className="text-center text-muted-foreground">
                      {competitor}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.tableRows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell className="text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" aria-label="Yes" />
                    </TableCell>
                    {row.competitors.map((value, index) => (
                      <TableCell key={index} className="text-center">
                        {renderCompetitorCell(value === 'sí' ? 'yes' : value === 'yes' ? 'yes' : 'no')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        <section className="mt-16 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{content.ctaHeading}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{content.ctaDescription}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <FeaturesCTA
              locale={locale}
              href={`/${locale}/generate`}
              surface="features_wizard"
              variant="primary"
            >
              {content.ctaPrimaryLabel}
            </FeaturesCTA>
            <FeaturesCTA
              locale={locale}
              href={`/${locale}/pricing`}
              surface="features_pricing"
              variant="outline"
            >
              {content.ctaSecondaryLabel}
            </FeaturesCTA>
          </div>
        </section>
      </main>
    </>
  );
}

