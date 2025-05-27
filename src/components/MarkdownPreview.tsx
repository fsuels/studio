'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentDetail = dynamic(() => import('@/components/DocumentDetail'), {
  ssr: false,          // client-only rendering
});

interface Props {
  markdown: string;
  docId: string;
  locale: 'en' | 'es';
}

export default function MarkdownPreview({ markdown, docId, locale }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden h-[720px]">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <DocumentDetail
          markdownContent={markdown} // Prop name changed from markdown to markdownContent
          docId={docId}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
