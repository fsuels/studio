// src/components/landing/FeaturedLogos.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Image from 'next/image'; // For optimized images
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Placeholder logos - Replace with actual logo paths and alt text
const logos = [
  { src: "/logos/techcrunch.svg", alt: "TechCrunch", dataAiHint: "techcrunch logo" },
  { src: "/logos/forbes.svg", alt: "Forbes", dataAiHint: "forbes logo"},
  { src: "/logos/fastcompany.svg", alt: "Fast Company", dataAiHint: "fast company logo" },
  { src: "/logos/wired.svg", alt: "Wired", dataAiHint: "wired logo" },
  { src: "/logos/inc.svg", alt: "Inc.", dataAiHint: "inc magazine logo" },
];

export function FeaturedLogos() {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderText = '...';

  return (
    <section className="w-full py-12 bg-background">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6">
          {isHydrated ? t('home.featuredIn') : placeholderText}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16">
          {logos.map((logo, index) => (
            <div key={index} className="h-8 md:h-10 filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
               {/* Using simple img tag with placeholder SVGs for simplicity now */}
               {/* Replace with Next/Image if using actual image files */}
              <img
                // Generate placeholder SVG logo-like shapes
                src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" fill="hsl(var(--muted))" rx="5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="hsl(var(--muted-foreground))" font-size="12" font-family="sans-serif">${logo.alt}</text></svg>`}
                alt={logo.alt}
                className="h-full w-auto object-contain"
                data-ai-hint={logo.dataAiHint} // Keep AI hint for potential future image replacement
                // width={120} // Provide intrinsic size if using Next/Image
                // height={40}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
