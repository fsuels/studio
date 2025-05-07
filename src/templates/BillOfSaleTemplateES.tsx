// src/templates/BillOfSaleTemplateES.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function BillOfSaleTemplateES() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const response = await fetch('/templates/es/bill-of-sale-vehicle.md');
         if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        const markdownText = await response.text();
        setHtmlContent(marked.parse(markdownText) as string);
      } catch (err) {
        console.error("Error fetching or parsing markdown:", err);
        setError(err instanceof Error ? err.message : 'Unknown error loading template.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMarkdown();
  }, []);

  if (isLoading) {
    return <div className="p-4 border rounded-md bg-muted animate-pulse min-h-[300px]">Cargando plantilla...</div>;
  }

  if (error) {
    return <div className="p-4 border rounded-md bg-destructive/20 text-destructive">Error: {error}</div>;
  }

  return (
     <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none p-4 border rounded-md bg-card text-card-foreground shadow">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
