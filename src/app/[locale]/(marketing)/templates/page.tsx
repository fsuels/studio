import TemplatesClientContent from './templates-client-content';
import { generateStaticParams } from '../page';

export { generateStaticParams };

export default function TemplatesPage({
  params,
}: {
  params: { locale: 'en' | 'es' };
}) {
  const { locale } = params;
  return <TemplatesClientContent locale={locale} />;
}
