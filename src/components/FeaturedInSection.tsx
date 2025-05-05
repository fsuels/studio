// src/components/FeaturedInSection.tsx
'use client'

import { useState, useEffect } from 'react'; // Import hooks
import { useTranslation } from 'react-i18next'

// Assume these logos exist in /public/logos/
const logos = [
  { src: "/logos/forbes.svg", alt: "Forbes", dataAiHint: "forbes logo" },
  { src: "/logos/nyt.svg", alt: "The New York Times", dataAiHint: "new york times logo" },
  { src: "/logos/techcrunch.svg", alt: "TechCrunch", dataAiHint: "techcrunch logo" },
  { src: "/logos/univision.svg", alt: "Univision", dataAiHint: "univision logo" },
  { src: "/logos/bloomberg.svg", alt: "Bloomberg", dataAiHint: "bloomberg logo" },
];


export default function FeaturedInSection() {
  const { t } = useTranslation()
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
              {/* Using img tag for SVGs, ensure these exist in /public/logos */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full w-auto object-contain"
                data-ai-hint={logo.dataAiHint} // Keep AI hint
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
