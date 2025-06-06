import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { localizations } from '@/lib/localizations';

const MyWidget = dynamic(() => import('@/components/MyWidget.client'), {
  ssr: false,
  suspense: true,
});

export async function generateStaticParams() {
  return localizations.map((locale) => ({ locale }));
}

export default function WidgetDemoPage() {
  return (
    <main className="container mx-auto py-8">
      <Suspense fallback={<p>Loading widget...</p>}>
        <MyWidget />
      </Suspense>
    </main>
  );
}
