'use client';

import dynamic from 'next/dynamic';

const DocumentFlow = dynamic(() => import('@/components/DocumentFlow'), {
  ssr: false,
});

export default DocumentFlow;
