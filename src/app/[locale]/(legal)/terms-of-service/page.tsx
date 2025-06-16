// src/app/[locale]/terms-of-service/page.tsx

// Static generation for legal pages (revalidate weekly)
export const dynamic = 'force-static';
export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function LocaleTermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground">
        This page is under construction.
      </p>
    </div>
  );
}
