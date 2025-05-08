// src/app/[locale]/support/page.tsx
'use client'; // This page uses client-side logic to determine which component to render

import { useParams } from 'next/navigation';
import SupportEN from '@/components/SupportEN';
import SupportES from '@/components/SupportES';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LocaleSupportPage() {
  const params = useParams();
  const locale = params.locale as 'en' | 'es';
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Optional: Render a loading state or null during hydration
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading support page...</p>
      </div>
    );
  }

  if (locale === 'es') {
    return <SupportES />;
  }
  // Default to English if locale is not 'es' or is undefined (though useParams should provide it)
  return <SupportEN />;
}
