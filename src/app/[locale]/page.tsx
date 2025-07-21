// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';
import { localizations } from '@/lib/localizations';

export async function generateStaticParams() {
  // 1) If LIMIT_SSG=true, only build 'en' (or any one locale you choose)
  if (process.env.LIMIT_SSG === 'true') {
    return [{ locale: 'en' }];
  }

  // 2) Otherwise, build all locales as before
  return localizations.map((locale) => ({ locale }));
}

export default function HomePageContainer() {
  return <HomePageClient />;
}
