import TemplatesClientContent from './templates-client-content';

// Generate static params for both locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' }>;
}) {
  const { locale } = await params;
  return <TemplatesClientContent locale={locale} />;
}
