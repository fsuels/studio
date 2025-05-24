import Link from 'next/link';
import { getDocumentsForCountry, supportedCountries } from '@/lib/document-library/index';
import { localizations } from '@/lib/localizations';

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: Array<{ locale: string; country: string }> = [];
  for (const locale of localizations) {
    for (const country of supportedCountries) {
      params.push({ locale, country });
    }
  }
  return params;
}

export default async function CountryDocsPage({ params }: { params: { locale: string; country: string } }) {
  const { locale, country } = params;
  const docs = getDocumentsForCountry(country);
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Documents for {country.toUpperCase()}</h1>
      <ul className="space-y-2">
        {docs.map(doc => (
          <li key={doc.id}>
            <Link className="text-blue-600 underline" href={`/${locale}/docs/${country}/${doc.id}`}>{doc.translations?.[locale]?.name ?? doc.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
