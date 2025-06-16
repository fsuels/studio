import TemplatesClientContent from './templates-client-content';

// Generate static params for both locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function TemplatesPage({
  params,
}: {
  params: { locale: 'en' | 'es' };
}) {
  const { locale } = params;
  return <TemplatesClientContent locale={locale} />;
}
