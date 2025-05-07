// src/templates/BillOfSaleTemplateEN.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { marked } from 'marked'; // Using marked for Markdown to HTML conversion

export default function BillOfSaleTemplateEN() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const response = await fetch('/templates/en/bill-of-sale-vehicle.md');
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        const markdownText = await response.text();
        // Basic placeholder replacement (replace with more robust templating if needed)
        // For this example, we'll just render the raw template.
        // In a real scenario, you'd pass data to fill in {{placeholders}}.
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
    return <div className="p-4 border rounded-md bg-muted animate-pulse min-h-[300px]">Loading template...</div>;
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
