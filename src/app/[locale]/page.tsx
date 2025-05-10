// src/app/[locale]/page.tsx
// This is now a Server Component

import HomePageClient from './HomePageClient';
import { localizations } from '@/lib/localizations';

export async function generateStaticParams() {
  return localizations.map((locale) => ({
    locale,
  }));
}

// Props will be passed to HomePageClient if needed,
// but for now, HomePageClient uses useParams and useTranslation directly.
export default function HomePageContainer() {
  return <HomePageClient />;
}
