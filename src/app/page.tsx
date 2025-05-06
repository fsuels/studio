// src/app/page.tsx

import React from 'react';
import DocumentFlow from '@/components/DocumentFlow';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Create Your Legal Document</h1>
      <DocumentFlow />
    </main>
  );
}
