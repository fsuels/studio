
// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import React from 'react';
import WizardShell from '@/components/WizardShell';
import { documentLibrary } from '@/lib/document-library'; // Using combined library
import { Loader2 } from 'lucide-react';

// Helper to get document (could be moved to a lib)
async function getDocumentConfig(docId: string) {
    const doc = documentLibrary.find(d => d.id === docId);
    // In a real app, you might fetch more detailed config from a DB
    return doc || null;
}

export default function StartPage() {
  const params = useParams();
  const router = useRouter();

  const locale = params.locale as 'en' | 'es';
  const docId = params.docId as string;

  const [docConfig, setDocConfig] = React.useState<typeof documentLibrary[0] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (docId) {
      getDocumentConfig(docId).then(config => {
        if (config) {
          setDocConfig(config);
        } else {
          notFound(); // Trigger Next.js not found if doc config isn't found
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      notFound(); // No docId means not found
    }
  }, [docId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading document wizard...</p>
      </div>
    );
  }

  if (!docConfig) {
    // This should be caught by notFound() earlier, but as a safeguard:
    return <p>Document configuration could not be loaded.</p>;
  }
  
  return (
    <WizardShell
      locale={locale}
      doc={docConfig}
      onComplete={(checkoutToken) => {
        // For now, log and redirect to a placeholder success page or homepage
        console.log('Wizard completed. Checkout Token:', checkoutToken);
        // Example: Redirect to a success page with the token, or to user's dashboard.
        // router.push(`/${locale}/checkout/success?session_id=${checkoutToken}`);
        // For now, let's go to dashboard as account/orders isn't built
        router.push(`/${locale}/dashboard?order=${checkoutToken}`); 
      }}
    />
  );
}

// Optional: If you want to pre-render some common document start pages
// export async function generateStaticParams() {
//   // Example: Pre-render for 'bill-of-sale-vehicle' in both locales
//   return documentLibrary.filter(doc => doc.id === 'bill-of-sale-vehicle').flatMap(doc => [
//     { locale: 'en', docId: doc.id },
//     { locale: 'es', docId: doc.id },
//   ]);
// }
