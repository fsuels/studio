// src/components/DocumentPreview.tsx
'use client';

import React from 'react';
import Image from 'next/image'; // Use next/image for optimization

interface DocumentPreviewProps {
  /** slug or docId matching your preview filename */
  docId: string;
  alt?: string;
  locale?: 'en' | 'es'; // Optional locale for alt text or conditional image paths
}

export default function DocumentPreview({
  docId,
  alt,
  locale = 'en', // Default to English
}: DocumentPreviewProps) {
  // Potentially adjust src based on locale if you have localized preview images
  const src = `/images/previews/${docId}.png`;
  const defaultAlt = locale === 'es' ? `Vista previa de ${docId}` : `${docId} preview`;

  return (
    <div className="border rounded-lg overflow-hidden bg-muted flex items-center justify-center aspect-[8.5/11] max-h-[500px] md:max-h-[600px] w-full shadow-lg">
      {/* Using next/image component for optimized image loading */}
      <Image
        src={src}
        alt={alt ?? defaultAlt}
        width={850} // Example width, adjust based on your image's aspect ratio
        height={1100} // Example height, adjust
        className="object-contain w-full h-full"
        priority // Consider priority if it's LCP
        unoptimized={process.env.NODE_ENV === 'development'} // Useful for local dev if image optimizer is slow
        data-ai-hint="document template screenshot"
      />
    </div>
  );
}
