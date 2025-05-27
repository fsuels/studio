// src/components/MarkdownPreview.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentDetail = dynamic(() => import('@/components/DocumentDetail'));

interface Props {
  markdown: string;
}

export default function MarkdownPreview({ markdown }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden h-[720px]">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <DocumentDetail markdownContent={markdown} liveData={null} />
      </Suspense>
    </div>
  );
}
