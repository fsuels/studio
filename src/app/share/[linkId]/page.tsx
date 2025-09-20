// src/app/share/[linkId]/page.tsx

import React from 'react';

// Tell Next.js which linkIds to generate at build time
export async function generateStaticParams() {
  // In a real app, you might fetch known shareable link IDs from a database
  // For now, let's pre-generate a couple of examples
  return [
    { linkId: 'example-123' },
    { linkId: 'another-shared-doc-abc' },
    // Add more known linkIds if needed
  ];
}

export default async function SharePage({
  params,
}: {
  params: { linkId: string };
}) {
  const { linkId } = params;

  // In a real app, you would fetch the document data associated with linkId
  // and display it, potentially with restricted access controls.

  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold">Shared Document</h1>
      <p className="mt-4">
        Viewing document shared with ID:{' '}
        <span className="font-mono bg-muted px-2 py-1 rounded">{linkId}</span>
      </p>
      {/* Placeholder for displaying the shared document content */}
      <div className="mt-8 border rounded-md p-4 min-h-[200px] flex items-center justify-center bg-muted/50">
        <p className="text-muted-foreground italic">
          Shared document content would appear here...
        </p>
      </div>
    </main>
  );
}
