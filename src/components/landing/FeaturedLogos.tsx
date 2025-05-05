// src/components/landing/FeaturedLogos.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Image from 'next/image'; // For optimized images
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Updated logos based on user request - Assumes these files exist in /public/logos/
const logos = [
  { src: "/logos/forbes.svg", alt: "Forbes", dataAiHint: "forbes logo" },
  { src: "/logos/nyt.svg", alt: "The New York Times", dataAiHint: "new york times logo" }, // Assuming 'nyt.svg' is the filename
  { src: "/logos/techcrunch.svg", alt: "TechCrunch", dataAiHint: "techcrunch logo" },
  { src: "/logos/univision.svg", alt: "Univision", dataAiHint: "univision logo" },
  { src: "/logos/bloomberg.svg", alt: "Bloomberg", dataAiHint: "bloomberg logo" },
];

export function FeaturedLogos() {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderText = '...';

  return (
    <section className="w-full py-12 bg-muted/50"> {/* Changed background slightly */}
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wide mb-8"> {/* Adjusted spacing and style */}
          {isHydrated ? t('home.featuredIn') : placeholderText}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16 opacity-80"> {/* Added opacity-80 */}
          {logos.map((logo, index) => (
            <div key={index} className="h-6 md:h-7 filter grayscale hover:grayscale-0 transition-all duration-300 opacity-75 hover:opacity-100"> {/* Adjusted height and opacity */}
              {/* Use Next/Image for optimization if actual images are used */}
               {/* Using img tag for SVGs, ensure these exist in /public/logos */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full w-auto object-contain"
                data-ai-hint={logo.dataAiHint} // Keep AI hint
                // Add width/height if using Next/Image and know the dimensions
                // width={120} // Example intrinsic size
                // height={28} // Example intrinsic size
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
